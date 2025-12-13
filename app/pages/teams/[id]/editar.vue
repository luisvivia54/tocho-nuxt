<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue'
    import { useNuxtApp, useRuntimeConfig, useRouter, useRoute } from '#imports'
    import { useAuthz } from '@/composables/useAuthz'
    
    const authz = useAuthz()
    const rawIsAuthenticated = (authz as any).isAuthenticated
    
    const isAuthenticated = computed<boolean>(() => {
      const v = rawIsAuthenticated
      if (typeof v === 'boolean') return v
      if (v && typeof v === 'object' && 'value' in v) return !!(v as any).value
      return false
    })
    
    const nuxtApp = useNuxtApp()
    const config = useRuntimeConfig()
    const router = useRouter()
    const route = useRoute()
    
    const teamId = computed(() => Number(route.params.id))
    
    // ================== TIPOS ==================
    interface TeamDetail {
      id: number
      name: string
      shortName: string | null
      logoUrl: string | null
      leagueId: number
      seasonId: number
      categoryId: number
    }
    
    interface PlayerApi {
      playerId: number
      fullName: string
      curp: string
      jerseyNumber: number | null
      photoUrl: string | null
    }
    
    interface PlayerForm {
      localId: number
      playerId?: number          // si existe en BD
      fullName: string
      curp: string
      jerseyNumber: number | null
      photoFile: File | null
      photoPreview: string | null // foto nueva o existente
      markedForDeletion: boolean
      isNew: boolean
    }
    
    interface TeamPhotoApi {
      id: number
      photoUrl: string
      sortOrder: number
    }
    
    interface PhotoForm {
      localId: number
      photoId?: number
      sortOrder: number | null
      currentUrl: string | null
      newFile: File | null
      newPreview: string | null
      markedForDeletion: boolean
      isNew: boolean
    }
    
    // ================== ESTADO ==================
    const loading = ref(true)
    const saving = ref(false)
    const loadError = ref<string | null>(null)
    
    const teamName = ref('')
    const teamShortName = ref('')
    const logoFile = ref<File | null>(null)
    const logoPreview = ref<string | null>(null)
    
    // Estas siguen siendo de adorno, no se mandan al back
    const colorPrimary = ref('#1D4ED8')
    const colorSecondary = ref('#FFFFFF')
    
    // Liga/temporada/categoría (solo lectura aquí)
    const leagueName = ref<string>('Liga Tochero5')
    const seasonName = ref<string>('Temporada Acatlán')
    const categoryName = ref<string>('Femenil U16')
    
    // Jugadores
    const players = ref<PlayerForm[]>([])
    
    // Fotos carrusel
    const photos = ref<PhotoForm[]>([])
    const maxCarouselPhotos = 5
    const activePhotosCount = computed(
      () => photos.value.filter((p) => !p.markedForDeletion).length
    )
    
    // Mensajes
    const successMessage = ref('')
    const errorMessage = ref('')
    
    // ================== HELPERS ==================
    const getAuthToken = async (): Promise<string | null> => {
      const { $kcGetToken } = nuxtApp as any
      const tokenFn: (() => Promise<string | undefined>) | undefined = $kcGetToken
      const token = tokenFn ? ((await tokenFn()) ?? '') : ''
      return token || null
    }
    
    const getStatusCode = (err: any): number | undefined =>
      err?.statusCode ?? err?.response?.status ?? err?.response?._data?.status
    
    // ================== CARGA INICIAL ==================
    const loadTeam = async () => {
      loadError.value = null
      try {
        const token = await getAuthToken()
        const headers: Record<string, string> = {}
        if (token) headers.Authorization = `Bearer ${token}`
    
        const data = await $fetch<TeamDetail>(`/teams/${teamId.value}`, {
          baseURL: config.public.apiBase,
          headers
        })
    
        teamName.value = data.name
        teamShortName.value = data.shortName ?? ''
        logoPreview.value = data.logoUrl ?? null
      } catch (err) {
        console.error('Error cargando equipo', err)
        loadError.value = 'No se pudo cargar la información del equipo.'
      }
    }
    
    const loadPlayers = async () => {
      try {
        const token = await getAuthToken()
        const headers: Record<string, string> = {}
        if (token) headers.Authorization = `Bearer ${token}`
    
        const data = await $fetch<PlayerApi[]>(`/teams/${teamId.value}/players`, {
          baseURL: config.public.apiBase,
          headers
        })
    
        if (!data || data.length === 0) {
          players.value = []
          for (let i = 0; i < 5; i++) {
            players.value.push({
              localId: i + 1,
              fullName: '',
              curp: '',
              jerseyNumber: null,
              photoFile: null,
              photoPreview: null,
              markedForDeletion: false,
              isNew: true
            })
          }
          return
        }
    
        players.value = data.map((p, idx) => ({
          localId: idx + 1,
          playerId: p.playerId,
          fullName: p.fullName,
          curp: p.curp,
          jerseyNumber: p.jerseyNumber ?? null,
          photoFile: null,
          photoPreview: p.photoUrl ?? null,
          markedForDeletion: false,
          isNew: false
        }))
      } catch (err) {
        console.error('Error cargando jugadores', err)
        // No tiramos toda la pantalla por esto; solo mostramos mensaje suave
      }
    }
    
    const loadPhotos = async () => {
      try {
        const token = await getAuthToken()
        const headers: Record<string, string> = {}
        if (token) headers.Authorization = `Bearer ${token}`
    
        const data = await $fetch<TeamPhotoApi[]>(`/teams/${teamId.value}/photos`, {
          baseURL: config.public.apiBase,
          headers
        })
    
        photos.value = (data ?? []).map((p, idx) => ({
          localId: idx + 1,
          photoId: p.id,
          sortOrder: p.sortOrder ?? idx,
          currentUrl: p.photoUrl ?? null,
          newFile: null,
          newPreview: null,
          markedForDeletion: false,
          isNew: false
        }))
      } catch (err) {
        console.error('Error cargando fotos del carrusel', err)
        photos.value = []
      }
    }
    
    const loadAll = async () => {
      loading.value = true
      await Promise.all([loadTeam(), loadPlayers(), loadPhotos()])
      loading.value = false
    }
    
    // ================== MANEJO DE FORM ==================
    const onLogoChange = (event: Event) => {
      const target = event.target as HTMLInputElement | null
      const file = target?.files?.[0] ?? null
    
      if (!file) {
        logoFile.value = null
        logoPreview.value = null
        return
      }
    
      logoFile.value = file
      logoPreview.value = URL.createObjectURL(file)
    }
    
    const onPlayerPhotoChange = (index: number, event: Event) => {
      const player = players.value[index]
      if (!player) return
    
      const target = event.target as HTMLInputElement | null
      const file = target?.files?.[0] ?? null
    
      if (!file) {
        player.photoFile = null
        return
      }
    
      player.photoFile = file
      player.photoPreview = URL.createObjectURL(file)
    }
    
    const addPlayer = () => {
      const list = players.value
      const last = list[list.length - 1]
      const nextLocalId = last ? last.localId + 1 : 1
      list.push({
        localId: nextLocalId,
        fullName: '',
        curp: '',
        jerseyNumber: null,
        photoFile: null,
        photoPreview: null,
        markedForDeletion: false,
        isNew: true
      })
    }
    
    const toggleRemovePlayer = (index: number) => {
      const player = players.value[index]
      if (!player) return
      player.markedForDeletion = !player.markedForDeletion
    }
    
    const removeNewPlayerCard = (index: number) => {
      const player = players.value[index]
      if (!player) return
      if (player.isNew && !player.playerId) {
        players.value.splice(index, 1)
      } else {
        player.markedForDeletion = true
      }
    }
    
    // ======== FOTOS CARRUSEL =========
    const addPhotoSlot = () => {
      if (activePhotosCount.value >= maxCarouselPhotos) {
        errorMessage.value = 'Solo puedes tener hasta 5 fotos activas en el carrusel.'
        return
      }
      const last = photos.value[photos.value.length - 1]
      const nextLocalId = last ? last.localId + 1 : 1
      const currentMaxSort = photos.value.reduce((max, p) => {
        const v = p.sortOrder ?? -1
        return v > max ? v : max
      }, -1)
      const nextSortOrder = currentMaxSort + 1
    
      photos.value.push({
        localId: nextLocalId,
        photoId: undefined,
        sortOrder: nextSortOrder,
        currentUrl: null,
        newFile: null,
        newPreview: null,
        markedForDeletion: false,
        isNew: true
      })
    }
    
    const onCarouselPhotoChange = (index: number, event: Event) => {
      const photo = photos.value[index]
      if (!photo) return
    
      const target = event.target as HTMLInputElement | null
      const file = target?.files?.[0] ?? null
    
      if (!file) {
        photo.newFile = null
        photo.newPreview = null
        return
      }
    
      photo.newFile = file
      photo.newPreview = URL.createObjectURL(file)
    }
    
    const toggleRemovePhoto = (index: number) => {
      const photo = photos.value[index]
      if (!photo) return
      photo.markedForDeletion = !photo.markedForDeletion
    }
    
    const removeNewPhotoSlot = (index: number) => {
      const photo = photos.value[index]
      if (!photo) return
      if (photo.isNew && !photo.photoId) {
        photos.value.splice(index, 1)
      } else {
        photo.markedForDeletion = true
      }
    }
    
    // ================== SUBMIT ==================
    const onSubmit = async () => {
      errorMessage.value = ''
      successMessage.value = ''
    
      if (!teamName.value.trim()) {
        errorMessage.value = 'El nombre del equipo no puede estar vacío.'
        return
      }
    
      try {
        saving.value = true
        const token = await getAuthToken()
        if (!token) {
          errorMessage.value = 'No se encontró token de sesión. Vuelve a iniciar sesión.'
          saving.value = false
          return
        }
    
        const authHeaders = {
          Authorization: `Bearer ${token}`
        }
    
        // 1) Actualizar datos básicos del equipo
        await $fetch(`/teams/${teamId.value}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
          },
          body: {
            name: teamName.value.trim(),
            shortName: teamShortName.value.trim() || null
          }
        })
    
        // 2) Subir logo si hay nuevo
        if (logoFile.value) {
          const formLogo = new FormData()
          formLogo.append('logo', logoFile.value)
    
          await $fetch(`/teams/${teamId.value}/logo`, {
            baseURL: config.public.apiBase,
            method: 'POST',
            body: formLogo,
            headers: authHeaders
          })
        }
    
        // 3) Procesar jugadores
        // 3.1 Eliminar marcados (que ya existan en BD)
        for (const p of players.value) {
          if (p.playerId && p.markedForDeletion) {
            try {
              await $fetch(`/teams/${teamId.value}/players/${p.playerId}`, {
                baseURL: config.public.apiBase,
                method: 'DELETE',
                headers: authHeaders
              })
            } catch (errDel) {
              console.error('Error eliminando jugador', errDel)
            }
          }
        }
    
        // 3.2 Crear nuevos
        for (const p of players.value) {
          if (!p.isNew || p.markedForDeletion) continue
          if (!p.fullName.trim() || !p.curp.trim()) continue
    
          const form = new FormData()
          form.append('fullName', p.fullName)
          form.append('curp', p.curp)
          if (p.jerseyNumber !== null && p.jerseyNumber !== undefined) {
            form.append('jerseyNumber', String(p.jerseyNumber))
          }
          if (p.photoFile) {
            form.append('photo', p.photoFile)
          }
    
          try {
            await $fetch(`/teams/${teamId.value}/players`, {
              baseURL: config.public.apiBase,
              method: 'POST',
              body: form,
              headers: authHeaders
            })
          } catch (errNew: any) {
            const status = getStatusCode(errNew)
            if (status === 413) {
              errorMessage.value =
                'Una de las fotos nuevas de jugador es demasiado pesada. Usa imágenes más ligeras (por ejemplo, < 5–10 MB).'
            } else {
              console.error('Error creando jugador', errNew)
            }
          }
        }
    
        // 3.3 Actualizar existentes
        for (const p of players.value) {
          if (!p.playerId || p.markedForDeletion) continue
    
          const form = new FormData()
          form.append('fullName', p.fullName)
          form.append('curp', p.curp)
          if (p.jerseyNumber !== null && p.jerseyNumber !== undefined) {
            form.append('jerseyNumber', String(p.jerseyNumber))
          }
          if (p.photoFile) {
            form.append('photo', p.photoFile)
          }
    
          try {
            await $fetch(`/teams/${teamId.value}/players/${p.playerId}`, {
              baseURL: config.public.apiBase,
              method: 'PUT',
              body: form,
              headers: authHeaders
            })
          } catch (errUpd: any) {
            const status = getStatusCode(errUpd)
            if (status === 413) {
              errorMessage.value =
                'Una de las fotos actualizadas de jugador es demasiado pesada. Usa imágenes más ligeras.'
            } else {
              console.error('Error actualizando jugador', errUpd)
            }
          }
        }
    
        // 4) Procesar fotos del carrusel
        // 4.1 Eliminar fotos marcadas (existentes)
        for (const photo of photos.value) {
          if (photo.photoId && photo.markedForDeletion) {
            try {
              await $fetch(`/teams/${teamId.value}/photos/${photo.photoId}`, {
                baseURL: config.public.apiBase,
                method: 'DELETE',
                headers: authHeaders
              })
            } catch (errDelPhoto) {
              console.error('Error eliminando foto de carrusel', errDelPhoto)
            }
          }
        }
    
        // 4.2 Actualizar fotos existentes con nuevo archivo
        for (const photo of photos.value) {
          if (!photo.photoId || photo.markedForDeletion || !photo.newFile) continue
    
          const formPhoto = new FormData()
          formPhoto.append('photo', photo.newFile)
          if (photo.sortOrder !== null && photo.sortOrder !== undefined) {
            formPhoto.append('positionIndex', String(photo.sortOrder))
          }
    
          try {
            await $fetch(`/teams/${teamId.value}/photos/${photo.photoId}`, {
              baseURL: config.public.apiBase,
              method: 'PUT',
              body: formPhoto,
              headers: authHeaders
            })
          } catch (errUpdPhoto: any) {
            const status = getStatusCode(errUpdPhoto)
            if (status === 413) {
              errorMessage.value =
                'Una de las fotos del carrusel es demasiado pesada. Usa imágenes más ligeras (por ejemplo, < 5–10 MB).'
            } else {
              console.error('Error actualizando foto de carrusel', errUpdPhoto)
            }
          }
        }
    
        // 4.3 Crear nuevas fotos (respetando máximo 5 activas)
        const existingActivePhotos = photos.value.filter(
          (p) => p.photoId && !p.markedForDeletion
        ).length
        let remainingSlots = maxCarouselPhotos - existingActivePhotos
        if (remainingSlots < 0) remainingSlots = 0
    
        for (const photo of photos.value) {
          if (!photo.isNew || photo.markedForDeletion || !photo.newFile) continue
          if (remainingSlots <= 0) {
            errorMessage.value =
              'Solo se permiten hasta 5 fotos en el carrusel. Algunas fotos nuevas no se pudieron agregar.'
            break
          }
    
          const formNew = new FormData()
          formNew.append('photo', photo.newFile)
          if (photo.sortOrder !== null && photo.sortOrder !== undefined) {
            formNew.append('positionIndex', String(photo.sortOrder))
          }
    
          try {
            await $fetch(`/teams/${teamId.value}/photos`, {
              baseURL: config.public.apiBase,
              method: 'POST',
              body: formNew,
              headers: authHeaders
            })
            remainingSlots--
          } catch (errNewPhoto: any) {
            const status = getStatusCode(errNewPhoto)
            if (status === 413) {
              errorMessage.value =
                'Una de las fotos nuevas del carrusel es demasiado pesada. Usa imágenes más ligeras.'
            } else {
              console.error('Error creando foto de carrusel', errNewPhoto)
            }
          }
        }
    
        successMessage.value = 'Cambios guardados correctamente.'
        // Recargar datos para ver el resultado actualizado
        await loadAll()
        await router.push(`/teams/${teamId.value}`)
      } catch (err: any) {
        console.error('Error guardando cambios', err)
        const status = getStatusCode(err)
        const rawMessage: string | undefined =
          err?.data?.message ?? err?.response?._data?.message ?? err?.message
    
        if (rawMessage && rawMessage.includes('uq_team_league_name')) {
          errorMessage.value =
            'Ya existe un equipo con ese nombre en esta liga. Elige otro nombre o contacta al administrador.'
        } else if (status === 413) {
          errorMessage.value =
            'Alguno de los archivos (logo, fotos de jugadores o carrusel) supera el tamaño máximo permitido. Intenta con archivos más ligeros.'
        } else {
          errorMessage.value =
            'Ocurrió un error al guardar los cambios. Intenta de nuevo más tarde.'
        }
      } finally {
        saving.value = false
      }
    }
    
    // ================== LOGIN ==================
    const onLoginClick = () => {
      const kc = (nuxtApp as any).$kc
      if (typeof window === 'undefined' || !kc) return
      kc.login({ redirectUri: window.location.href })
    }
    
    // ================== CICLO DE VIDA ==================
    onMounted(async () => {
      if (isAuthenticated.value) {
        await loadAll()
      }
    })
    
    watch(
      () => isAuthenticated.value,
      async (value) => {
        if (value) {
          await loadAll()
        }
      }
    )
    </script>
    
    <template>
      <main class="bg-[#020617] text-slate-50 min-h-screen pt-24 md:pt-28 lg:pt-32">
        <div class="max-w-5xl mx-auto container-pad px-6 pb-16">
          <header class="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 class="font-display text-3xl font-extrabold text-slate-50">
                Editar equipo
              </h1>
              <p class="mt-1 text-sm text-slate-400">
                Actualiza la información del equipo y de sus integrantes.
              </p>
            </div>
    
            <NuxtLink
              :to="`/teams/${teamId}`"
              class="inline-flex items-center rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
            >
              ← Volver al detalle
            </NuxtLink>
          </header>
    
          <!-- Estado de login -->
          <div
            v-if="!isAuthenticated"
            class="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="font-semibold text-slate-50 mb-1">
                Inicia sesión para editar tu equipo
              </h2>
              <p class="text-sm text-slate-400">
                Necesitas entrar con tu cuenta para modificar la información del equipo.
              </p>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
              @click="onLoginClick"
            >
              Entrar con mi cuenta
            </button>
          </div>
    
          <div v-else>
            <div
              v-if="loading"
              class="mt-6 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 shadow-sm"
            >
              Cargando información del equipo…
            </div>
    
            <div
              v-else-if="loadError"
              class="mt-6 rounded-2xl border border-red-400 bg-red-950/50 px-4 py-3 text-sm text-red-200 shadow-sm"
            >
              {{ loadError }}
            </div>
    
            <section
              v-else
              class="mt-6 rounded-[26px] bg-slate-900 border border-slate-800 shadow-[0_20px_45px_rgba(15,23,42,0.45)] overflow-hidden"
            >
              <!-- Header -->
              <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-between">
                <div>
                  <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">
                    edición de equipo
                  </p>
                  <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                    Ajusta datos y roster
                  </h2>
                </div>
                <div class="hidden sm:block text-xs text-blue-50/85 text-right">
                  <p>Recuerda guardar cambios antes de salir.</p>
                </div>
              </div>
    
              <form class="px-6 py-8 space-y-8" @submit.prevent="onSubmit">
                <!-- DATOS DEL EQUIPO -->
                <div class="space-y-4">
                  <h3 class="font-semibold text-slate-50 text-lg">Datos del equipo</h3>
                  <p class="text-xs text-slate-400">
                    Nombre, identificadores y logo del equipo.
                  </p>
    
                  <div class="grid md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Nombre del equipo
                      </label>
                      <input
                        v-model="teamName"
                        type="text"
                        class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        placeholder="Ej. Leoness"
                      />
                    </div>
    
                    <div>
                      <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Nombre corto
                      </label>
                      <input
                        v-model="teamShortName"
                        type="text"
                        class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        placeholder="Ej. LNS"
                      />
                    </div>
                  </div>
    
                  <!-- Liga/temporada/categoría solo lectura -->
                  <div class="grid md:grid-cols-3 gap-4 mt-2 text-xs text-slate-400">
                    <div>
                      <p class="font-semibold text-slate-300 mb-1">Liga</p>
                      <p>{{ leagueName }}</p>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-300 mb-1">Temporada</p>
                      <p>{{ seasonName }}</p>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-300 mb-1">Categoría</p>
                      <p>{{ categoryName }}</p>
                    </div>
                  </div>
    
                  <!-- Colores solo adorno -->
                  <div class="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Color primario (solo visual)
                      </label>
                      <div class="flex items-center gap-3">
                        <input
                          v-model="colorPrimary"
                          type="color"
                          class="h-9 w-9 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                        />
                        <input
                          v-model="colorPrimary"
                          type="text"
                          class="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        />
                      </div>
                    </div>
    
                    <div>
                      <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Color secundario (solo visual)
                      </label>
                      <div class="flex items-center gap-3">
                        <input
                          v-model="colorSecondary"
                          type="color"
                          class="h-9 w-9 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                        />
                        <input
                          v-model="colorSecondary"
                          type="text"
                          class="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        />
                      </div>
                    </div>
                  </div>
    
                  <!-- Logo -->
                  <div class="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start mt-2">
                    <div>
                      <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Logo del equipo
                      </label>
                      <p class="text-[11px] text-slate-400 mb-2">
                        Si no subes un archivo nuevo, se mantiene el logo actual.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        class="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-200 hover:file:bg-blue-100/20"
                        @change="onLogoChange"
                      />
                    </div>
    
                    <div class="flex justify-center md:justify-end">
                      <div
                        class="w-28 h-28 rounded-2xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden"
                      >
                        <img
                          v-if="logoPreview"
                          :src="logoPreview"
                          alt="Logo del equipo"
                          class="w-full h-full object-contain"
                        />
                        <span v-else class="text-[11px] text-slate-500 text-center px-2">
                          Logo actual / previsualización
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
    
                <!-- FOTOS DEL CARRUSEL -->
                <div class="space-y-4 mt-8">
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <h3 class="font-semibold text-slate-50 text-lg">
                        Fotos del carrusel
                      </h3>
                      <p class="text-xs text-slate-400">
                        Máximo 5 fotos activas. Puedes reemplazar o eliminar fotos individuales.
                      </p>
                    </div>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-xl border border-slate-600 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-800"
                      @click="addPhotoSlot"
                    >
                      + Agregar foto
                    </button>
                  </div>
    
                  <p class="text-[11px] text-slate-500">
                    Fotos activas: {{ activePhotosCount }} / 5
                  </p>
    
                  <div v-if="photos.length === 0" class="text-[11px] text-slate-500">
                    Aún no hay fotos en el carrusel. Usa “Agregar foto” para subir la primera.
                  </div>
    
                  <div v-else class="space-y-3">
                    <div
                      v-for="(photo, index) in photos"
                      :key="photo.localId"
                      :class="[
                        'rounded-2xl px-4 py-4 sm:px-5 sm:py-4 border',
                        photo.markedForDeletion
                          ? 'border-red-500/70 bg-red-950/30'
                          : 'border-slate-700 bg-slate-900/60'
                      ]"
                    >
                      <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex items-center gap-2 text-xs text-slate-400">
                          <span
                            class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-50"
                          >
                            {{ index + 1 }}
                          </span>
                          <span
                            v-if="photo.isNew && !photo.photoId"
                            class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-500/40"
                          >
                            Nueva
                          </span>
                          <span
                            v-if="photo.markedForDeletion"
                            class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-100 border border-red-500/60"
                          >
                            Se eliminará
                          </span>
                        </div>
                        <button
                          type="button"
                          class="text-[11px] text-slate-400 hover:text-red-400"
                          @click="photo.isNew && !photo.photoId ? removeNewPhotoSlot(index) : toggleRemovePhoto(index)"
                        >
                          {{
                            photo.isNew && !photo.photoId
                              ? 'Quitar tarjeta'
                              : photo.markedForDeletion
                                ? 'Deshacer'
                                : 'Marcar para eliminar'
                          }}
                        </button>
                      </div>
    
                      <div class="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)] gap-4 items-start">
                        <div class="space-y-3">
                          <div>
                            <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                              Archivo de imagen
                            </label>
                            <p class="text-[11px] text-slate-400 mb-2">
                              Si no subes un archivo nuevo, se mantiene la imagen actual.
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              :disabled="photo.markedForDeletion"
                              class="block w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50/10 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-blue-100 hover:file:bg-blue-100/20 disabled:opacity-60 disabled:cursor-not-allowed"
                              @change="onCarouselPhotoChange(index, $event)"
                            />
                          </div>
                        </div>
    
                        <div
                          class="w-full h-24 rounded-2xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden"
                        >
                        <img
  v-if="photo.newPreview || photo.currentUrl"
  :src="(photo.newPreview || photo.currentUrl) as string"
  alt="Foto del carrusel"
  class="w-full h-full object-cover"
/>
                          <span v-else class="text-[11px] text-slate-500 px-2 text-center">
                            Foto actual / previsualización
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <p class="text-[11px] text-slate-500">
                    Las fotos marcadas como
                    <span class="text-red-300">"Se eliminará"</span> se borrarán al guardar.
                  </p>
                </div>
    
                <!-- JUGADORES -->
                <div class="space-y-4 mt-8">
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <h3 class="font-semibold text-slate-50 text-lg">Integrantes del equipo</h3>
                      <p class="text-xs text-slate-400">
                        Edita, agrega o elimina jugadoras/jugadores. Los marcados en rojo se eliminarán.
                      </p>
                    </div>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-xl border border-slate-600 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-800"
                      @click="addPlayer"
                    >
                      + Agregar integrante
                    </button>
                  </div>
    
                  <div class="space-y-3">
                    <div
                      v-for="(player, index) in players"
                      :key="player.localId"
                      :class="[
                        'rounded-2xl px-4 py-4 sm:px-5 sm:py-4 border',
                        player.markedForDeletion
                          ? 'border-red-500/70 bg-red-950/30'
                          : 'border-slate-700 bg-slate-900/60'
                      ]"
                    >
                      <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex items-center gap-2 text-xs text-slate-400">
                          <span
                            class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-50"
                          >
                            {{ index + 1 }}
                          </span>
                          <span
                            v-if="player.isNew && !player.playerId"
                            class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-500/40"
                          >
                            Nuevo
                          </span>
                          <span
                            v-if="player.markedForDeletion"
                            class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-100 border border-red-500/60"
                          >
                            Se eliminará
                          </span>
                        </div>
                        <button
                          type="button"
                          class="text-[11px] text-slate-400 hover:text-red-400"
                          @click="player.isNew && !player.playerId ? removeNewPlayerCard(index) : toggleRemovePlayer(index)"
                        >
                          {{
                            player.isNew && !player.playerId
                              ? 'Quitar tarjeta'
                              : player.markedForDeletion
                                ? 'Deshacer'
                                : 'Marcar para eliminar'
                          }}
                        </button>
                      </div>
    
                      <div class="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 items-start">
                        <!-- Datos -->
                        <div class="space-y-3">
                          <div>
                            <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                              Nombre completo <span class="text-red-400">*</span>
                            </label>
                            <input
                              v-model="player.fullName"
                              type="text"
                              :disabled="player.markedForDeletion"
                              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 disabled:opacity-60 disabled:cursor-not-allowed"
                              placeholder="Ej. María López"
                            />
                          </div>
    
                          <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
                            <div>
                              <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                                CURP <span class="text-red-400">*</span>
                              </label>
                              <input
                                v-model="player.curp"
                                type="text"
                                :disabled="player.markedForDeletion"
                                class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 uppercase tracking-[0.08em] focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 disabled:opacity-60 disabled:cursor-not-allowed"
                                placeholder="CURP"
                              />
                            </div>
    
                            <div>
                              <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                                # Jersey (opcional)
                              </label>
                              <input
                                v-model.number="player.jerseyNumber"
                                type="number"
                                min="0"
                                :disabled="player.markedForDeletion"
                                class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 disabled:opacity-60 disabled:cursor-not-allowed"
                                placeholder="Ej. 10"
                              />
                            </div>
                          </div>
                        </div>
    
                        <!-- Foto -->
                        <div class="space-y-2">
                          <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                            Foto del jugador(a)
                          </label>
                          <p class="text-[11px] text-slate-400">
                            Si no subes un archivo nuevo, se mantiene la foto actual.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            :disabled="player.markedForDeletion"
                            class="block w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50/10 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-blue-100 hover:file:bg-blue-100/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            @change="onPlayerPhotoChange(index, $event)"
                          />
    
                          <div
                            class="mt-2 w-full h-24 rounded-2xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden"
                          >
                            <img
                              v-if="player.photoPreview"
                              :src="player.photoPreview"
                              alt="Foto del jugador"
                              class="w-full h-full object-cover"
                            />
                            <span v-else class="text-[11px] text-slate-500 px-2 text-center">
                              Foto actual / previsualización
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <p class="text-[11px] text-slate-500">
                    Los jugadores marcados como
                    <span class="text-red-300">"Se eliminará"</span> se borrarán al guardar.
                  </p>
                </div>
    
                <!-- Mensajes -->
                <div
                  v-if="successMessage"
                  class="mt-4 rounded-xl border border-emerald-500/60 bg-emerald-900/30 px-4 py-2 text-xs text-emerald-100"
                >
                  {{ successMessage }}
                </div>
                <div
                  v-if="errorMessage"
                  class="mt-2 rounded-xl border border-red-500/60 bg-red-900/40 px-4 py-2 text-xs text-red-100"
                >
                  {{ errorMessage }}
                </div>
    
                <!-- Botones -->
                <div class="mt-6 flex flex-wrap justify-end gap-3">
                  <NuxtLink
                    :to="`/teams/${teamId}`"
                    class="inline-flex items-center rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800"
                  >
                    Cancelar
                  </NuxtLink>
    
                  <button
                    type="submit"
                    class="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="saving"
                  >
                    <span v-if="saving">Guardando cambios…</span>
                    <span v-else>Guardar cambios</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </template>
    