<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useNuxtApp, useRuntimeConfig, useRouter } from '#imports'
  import { useAuthz } from '@/composables/useAuthz'
  
  import type { CategoryDto } from '@/composables/useCategoryService'
  import { useCatalogService } from '@/composables/useCategoryService'
  
  const authz = useAuthz()
  const rawIsAuthenticated = (authz as any).isAuthenticated
  
  // isAuthenticated SIEMPRE será un computed<boolean>
  const isAuthenticated = computed<boolean>(() => {
    const v = rawIsAuthenticated
    if (typeof v === 'boolean') return v
    if (v && typeof v === 'object' && 'value' in v) return !!(v as any).value
    return false
  })
  
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const router = useRouter()
  
  // ================== TIPOS ==================
  interface MyTeamItem {
    teamId: number
    name: string
    shortName: string | null
    logoUrl: string | null
  }
  
  interface MyTeamsInfo {
    userId: number
    role: string
    maxTeamsAllowed: number
    currentTeams: number
    hasCaptainPrivileges: boolean
    canCreateTeam: boolean
    teams: MyTeamItem[]
  }
  
  interface CreatedTeam {
    teamId: number
    name: string
    shortName: string | null
    logoUrl?: string | null
  }
  
  interface PlayerForm {
    id: number
    fullName: string
    curp: string
    jerseyNumber: number | null
    photoFile: File | null
    photoPreview: string | null
  }
  
  // ================== ESTADO BACK (teams/mine) ==================
  const myTeams = ref<MyTeamsInfo | null>(null)
  const captainLoading = ref(false)
  const captainError = ref<string | null>(null)
  
  const mainTeam = computed<MyTeamItem | null>(() => myTeams.value?.teams?.[0] ?? null)
  
  const mainTeamLink = computed(() => {
    return mainTeam.value ? `/teams/${mainTeam.value.teamId}` : '/mi-equipo'
  })
  
  const canRegisterTeam = computed(() => {
    if (!myTeams.value) return false
    return myTeams.value.hasCaptainPrivileges && myTeams.value.canCreateTeam
  })
  
  const fetchMyTeams = async () => {
    captainError.value = null
    myTeams.value = null
  
    if (!isAuthenticated.value) return
  
    try {
      captainLoading.value = true
      const { $kcGetToken } = nuxtApp as any
      const tokenFn: (() => Promise<string | undefined>) | undefined = $kcGetToken
      const token = tokenFn ? ((await tokenFn()) ?? '') : ''
  
      if (!token) {
        captainError.value = 'No se encontró token de sesión. Vuelve a iniciar sesión.'
        return
      }
  
      const resp = await $fetch<MyTeamsInfo>('/teams/mine', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${token}` }
      })
  
      myTeams.value = resp
    } catch (err) {
      console.error('Error cargando /teams/mine', err)
      captainError.value = 'No se pudo obtener la información de tus equipos.'
    } finally {
      captainLoading.value = false
    }
  }
  
  // ================== LIGA / TEMPORADA / CATÁLOGO ==================
  const catalog = useCatalogService()
  
  interface LeagueOption {
    id: number
    name: string
  }
  interface SeasonOption {
    id: number
    name: string
    leagueId: number
  }
  
  const leagues = ref<LeagueOption[]>([{ id: 1, name: 'Liga Tochero5' }])
  const seasons = ref<SeasonOption[]>([{ id: 1, name: 'Temporada Acatlán', leagueId: 1 }])
  
  const selectedLeagueId = ref<number>(0)
  const selectedSeasonId = ref<number>(0)
  
  // catálogo real
  const categories = ref<CategoryDto[]>([])
  const categoriesLoading = ref(false)
  const categoriesError = ref<string | null>(null)
  
  // lo que se manda al back
  const selectedCategoryId = ref<number>(0)
  
  // selects que ve el usuario
  const selectedGender = ref<string>('') // FEMENIL | VARONIL | MIXTO
  const selectedRama = ref<string>('')   // U16 | SUB18 | etc
  
  const availableSeasons = computed(() =>
    seasons.value.filter((s) => !selectedLeagueId.value || s.leagueId === selectedLeagueId.value)
  )
  
  const norm = (v?: string | null) => (v ?? '').trim().toUpperCase()
  
  const prettyGender = (g: string) => {
    const key = norm(g)
    if (key === 'FEMENIL') return 'Femenil'
    if (key === 'VARONIL') return 'Varonil'
    if (key === 'MIXTO') return 'Mixto'
    return g
  }
  
  const genderOptions = computed(() => {
    const set = new Map<string, string>()
    for (const c of categories.value) {
      const g = norm(c.gender)
      if (g) set.set(g, prettyGender(g))
    }
    return Array.from(set.entries()).map(([value, label]) => ({ value, label }))
  })
  
  const ramaOptions = computed(() => {
    if (!selectedGender.value) return []
    const set = new Map<string, string>()
    for (const c of categories.value) {
      if (norm(c.gender) !== selectedGender.value) continue
      const codeKey = norm(c.code)
      if (codeKey) set.set(codeKey, c.code)
    }
    return Array.from(set.entries()).map(([value, label]) => ({ value, label }))
  })
  
  const selectedCategory = computed(() => {
    if (!selectedGender.value || !selectedRama.value) return null
    return (
      categories.value.find(
        (c) => norm(c.gender) === selectedGender.value && norm(c.code) === selectedRama.value
      ) ?? null
    )
  })
  
  watch(selectedCategory, (c) => {
    selectedCategoryId.value = c?.id ?? 0
  })
  
  const fetchCategories = async () => {
    categoriesError.value = null
    try {
      categoriesLoading.value = true
      const leagueIdToUse = selectedLeagueId.value || 1
      categories.value = await catalog.getCategories({ leagueId: leagueIdToUse })
    } catch (e) {
      console.error('Error cargando /categories', e)
      categoriesError.value = 'No se pudieron cargar las categorías.'
      categories.value = []
    } finally {
      categoriesLoading.value = false
    }
  }
  
  watch(
    () => selectedLeagueId.value,
    async () => {
      selectedSeasonId.value = 0
      selectedGender.value = ''
      selectedRama.value = ''
      selectedCategoryId.value = 0
      await fetchCategories()
    }
  )
  
  watch(
    () => selectedSeasonId.value,
    () => {
      selectedGender.value = ''
      selectedRama.value = ''
      selectedCategoryId.value = 0
    }
  )
  
  watch(
    () => selectedGender.value,
    () => {
      selectedRama.value = ''
      selectedCategoryId.value = 0
    }
  )
  
  // ================== ESTADO FORM ==================
  const teamName = ref('')
  const teamShortName = ref('')
  const logoFile = ref<File | null>(null)
  const logoPreview = ref<string | null>(null)
  
  // Colores: adorno
  const colorPrimary = ref('#1D4ED8')
  const colorSecondary = ref('#FFFFFF')
  
  // ✅ AHORA puedes tener 0 jugadores
  const players = ref<PlayerForm[]>([])
  
  const createEmptyPlayer = (id: number): PlayerForm => ({
    id,
    fullName: '',
    curp: '',
    jerseyNumber: null,
    photoFile: null,
    photoPreview: null
  })
  
  const nextPlayerId = () => {
    const maxId = players.value.reduce((mx, p) => Math.max(mx, p.id), 0)
    return maxId + 1
  }
  
  const addPlayer = () => {
    players.value.push(createEmptyPlayer(nextPlayerId()))
  }
  
  const removePlayer = (index: number) => {
    if (index < 0 || index >= players.value.length) return
    const p = players.value[index]
    if (p?.photoPreview) URL.revokeObjectURL(p.photoPreview)
    players.value.splice(index, 1)
  }
  
  // Logo
  const onLogoChange = (event: Event) => {
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0] ?? null
  
    if (!file) {
      logoFile.value = null
      if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
      logoPreview.value = null
      return
    }
  
    logoFile.value = file
    if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
    logoPreview.value = URL.createObjectURL(file)
  }
  
  // Foto jugador
  const onPlayerPhotoChange = (index: number, event: Event) => {
    const player = players.value[index]
    if (!player) return
  
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0] ?? null
  
    if (!file) {
      player.photoFile = null
      if (player.photoPreview) URL.revokeObjectURL(player.photoPreview)
      player.photoPreview = null
      return
    }
  
    player.photoFile = file
    if (player.photoPreview) URL.revokeObjectURL(player.photoPreview)
    player.photoPreview = URL.createObjectURL(file)
  }
  
  // ✅ Solo estos se mandan
  const sendablePlayers = computed(() =>
    players.value.filter((p) => !!p.fullName.trim() && !!p.curp.trim() && !!p.photoFile)
  )
  
  // ================== BORRADOR LOCAL ==================
  const DRAFT_KEY = 'registroEquipoDraft'
  
  const successMessage = ref('')
  const errorMessage = ref('')
  
  interface DraftPlayer {
    id: number
    fullName?: string
    curp?: string
    jerseyNumber?: number
  }
  interface DraftData {
    teamName?: string
    teamShortName?: string
    colorPrimary?: string
    colorSecondary?: string
    leagueId?: number
    seasonId?: number
    categoryId?: number
    gender?: string
    rama?: string
    players?: DraftPlayer[]
  }
  
  const saveDraft = () => {
    try {
      const draft: DraftData = {
        teamName: teamName.value,
        teamShortName: teamShortName.value,
        colorPrimary: colorPrimary.value,
        colorSecondary: colorSecondary.value,
        leagueId: selectedLeagueId.value,
        seasonId: selectedSeasonId.value,
        categoryId: selectedCategoryId.value,
        gender: selectedGender.value,
        rama: selectedRama.value,
        players: players.value.map((p) => ({
          id: p.id,
          fullName: p.fullName,
          curp: p.curp,
          jerseyNumber: p.jerseyNumber === null ? undefined : p.jerseyNumber
        }))
      }
  
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        successMessage.value = 'Cambios guardados localmente. No se ha enviado aún a la liga.'
        errorMessage.value = ''
      }
    } catch (e) {
      console.error('Error guardando borrador:', e)
      errorMessage.value = 'No se pudo guardar el borrador local.'
    }
  }
  
  const loadDraft = () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      const raw = window.localStorage.getItem(DRAFT_KEY)
      if (!raw) return
  
      const draft = JSON.parse(raw) as DraftData
  
      teamName.value = draft.teamName ?? ''
      teamShortName.value = draft.teamShortName ?? ''
      if (draft.colorPrimary) colorPrimary.value = draft.colorPrimary
      if (draft.colorSecondary) colorSecondary.value = draft.colorSecondary
  
      selectedLeagueId.value = draft.leagueId ?? 0
      selectedSeasonId.value = draft.seasonId ?? 0
  
      selectedGender.value = draft.gender ?? ''
      selectedRama.value = draft.rama ?? ''
      selectedCategoryId.value = draft.categoryId ?? 0
  
      const playersDraft = draft.players ?? []
      players.value = playersDraft.map((p, idx) => ({
        id: p.id ?? idx + 1,
        fullName: p.fullName ?? '',
        curp: p.curp ?? '',
        jerseyNumber: typeof p.jerseyNumber === 'number' ? p.jerseyNumber : null,
        photoFile: null,      // ⚠️ archivos no se pueden restaurar desde localStorage
        photoPreview: null
      }))
    } catch (e) {
      console.error('Error cargando borrador:', e)
    }
  }
  
  const clearProgress = () => {
    teamName.value = ''
    teamShortName.value = ''
    colorPrimary.value = '#1D4ED8'
    colorSecondary.value = '#FFFFFF'
  
    logoFile.value = null
    if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
    logoPreview.value = null
  
    selectedLeagueId.value = 0
    selectedSeasonId.value = 0
    selectedGender.value = ''
    selectedRama.value = ''
    selectedCategoryId.value = 0
  
    // ✅ ahora sí puede quedar vacío
    for (const p of players.value) if (p.photoPreview) URL.revokeObjectURL(p.photoPreview)
    players.value = []
  
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(DRAFT_KEY)
    }
  
    successMessage.value = ''
    errorMessage.value = ''
  }
  
  // ================== LOGIN ==================
  const onLoginClick = () => {
    const kc = (nuxtApp as any).$kc
    if (typeof window === 'undefined' || !kc) return
    kc.login({ redirectUri: window.location.href })
  }
  
  // ================== SUBMIT ==================
  const submitting = ref(false)
  
  const getStatusCode = (err: any): number | undefined =>
    err?.statusCode ?? err?.response?.status ?? err?.response?._data?.status
  
  const onSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''
  
    if (!canRegisterTeam.value) {
      errorMessage.value = 'Actualmente no puedes registrar más equipos.'
      return
    }
  
    if (!teamName.value.trim()) {
      errorMessage.value = 'Ingresa el nombre del equipo antes de subir la información.'
      return
    }
  
    if (!selectedLeagueId.value || !selectedSeasonId.value || !selectedCategoryId.value) {
      errorMessage.value = 'Selecciona liga, temporada, categoría y rama antes de registrar el equipo.'
      return
    }
  
    let createdTeamId: number | null = null
    let createdTeamName = ''
  
    try {
      submitting.value = true
  
      const { $kcGetToken } = nuxtApp as any
      const tokenFn: (() => Promise<string | undefined>) | undefined = $kcGetToken
      const token = tokenFn ? ((await tokenFn()) ?? '') : ''
  
      if (!token) {
        errorMessage.value = 'No se encontró un token de sesión. Vuelve a iniciar sesión.'
        return
      }
  
      // 1) Crear equipo
      const createdTeam = await $fetch<CreatedTeam>('/teams/mine', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: teamName.value.trim(),
          leagueId: selectedLeagueId.value,
          seasonId: selectedSeasonId.value,
          categoryId: selectedCategoryId.value,
          colorPrimary: colorPrimary.value,
          colorSecondary: colorSecondary.value
        }
      })
  
      createdTeamId = createdTeam.teamId
      createdTeamName = createdTeam.name
  
      // 2) Subir logo (si hay)
      if (logoFile.value && createdTeamId) {
        const formLogo = new FormData()
        formLogo.append('logo', logoFile.value)
  
        await $fetch(`/teams/${createdTeamId}/logo`, {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: formLogo,
          headers: { Authorization: `Bearer ${token}` }
        })
      }
  
      // 3) Crear jugadores: SOLO completos (nombre + curp + foto). Si no hay, NO PASA NADA.
      if (createdTeamId && sendablePlayers.value.length > 0) {
        for (const p of sendablePlayers.value) {
          const formPlayer = new FormData()
          formPlayer.append('fullName', p.fullName.trim())
          formPlayer.append('curp', p.curp.trim())
  
          // jersey opcional
          if (typeof p.jerseyNumber === 'number' && Number.isFinite(p.jerseyNumber)) {
            formPlayer.append('jerseyNumber', String(p.jerseyNumber))
          }
  
          formPlayer.append('photo', p.photoFile as File)
  
          try {
            await $fetch(`/teams/${createdTeamId}/players`, {
              baseURL: config.public.apiBase,
              method: 'POST',
              body: formPlayer,
              headers: { Authorization: `Bearer ${token}` }
            })
          } catch (errPlayer: any) {
            const status = getStatusCode(errPlayer)
            if (status === 413) {
              successMessage.value =
                'El equipo se creó correctamente, pero una o más fotos pesan demasiado y no se pudieron subir. ' +
                'Usa fotos más ligeras y súbelas después desde "Mi equipo".'
              errorMessage.value = ''
              break
            } else {
              console.error('Error creando jugador', errPlayer)
            }
          }
        }
      }
  
      await fetchMyTeams()
      clearProgress()
  
      successMessage.value = `Equipo "${createdTeamName}" registrado correctamente.`
      errorMessage.value = ''
  
      if (createdTeamId) await router.push(`/teams/${createdTeamId}`)
    } catch (err: any) {
      console.error('Error al enviar registro:', err)
      const status = getStatusCode(err)
  
      const rawMessage: string | undefined =
        err?.data?.message ?? err?.response?._data?.message ?? err?.message
  
      if (rawMessage && rawMessage.includes('uq_team_league_name')) {
        errorMessage.value =
          'Ya existe un equipo con ese nombre en esta liga. Elige otro nombre o contacta al administrador.'
      } else if (status === 413) {
        errorMessage.value =
          'La información enviada (logo o fotos) supera el tamaño máximo permitido. Intenta con archivos más ligeros.'
      } else {
        // OJO: si aquí sigue saliendo 500, es back/BD (como tu error de team_enrollment)
        errorMessage.value =
          'Ocurrió un error al subir la información. Si ves 500, revisa los logs del back/BD.'
      }
    } finally {
      submitting.value = false
    }
  }
  
  // ================== CICLO DE VIDA ==================
  onMounted(async () => {
    loadDraft()
  
    if (!selectedLeagueId.value) selectedLeagueId.value = leagues.value[0]?.id ?? 0
    if (!selectedSeasonId.value) selectedSeasonId.value = seasons.value[0]?.id ?? 0
  
    await fetchCategories()
  
    if (isAuthenticated.value) {
      fetchMyTeams()
    }
  })
  
  watch(
    () => isAuthenticated.value,
    (value) => {
      if (value) fetchMyTeams()
      else myTeams.value = null
    }
  )
  </script>
  
  <template>
    <main class="bg-[#F3F4FF] text-slate-900 min-h-screen pt-24 md:pt-28 lg:pt-32">
      <div class="max-w-5xl mx-auto container-pad px-6 pb-16">
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
          Registro de equipo
        </h1>
        <p class="text-sm text-slate-600 mb-6">
          Completa la información de tu equipo. Puedes registrar el equipo aunque aún no cargues integrantes.
        </p>
  
        <!-- Login -->
        <div
          v-if="!isAuthenticated"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h2 class="font-semibold text-slate-900 mb-1">
              Inicia sesión para registrar tu equipo
            </h2>
            <p class="text-sm text-slate-600">
              Necesitas entrar con tu cuenta para ligar el equipo a tu usuario de Keycloak.
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
  
        <!-- BLOQUE PARA USUARIOS AUTENTICADOS -->
        <div v-else class="mt-6 space-y-4">
          <div
            v-if="captainLoading"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
          >
            Validando que tengas permisos para registrar un equipo...
          </div>
  
          <div
            v-else-if="captainError"
            class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"
          >
            {{ captainError }}
          </div>
  
          <div
            v-else-if="myTeams && !myTeams.hasCaptainPrivileges"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
          >
            <p class="font-semibold text-slate-900 mb-1">
              Tu usuario no tiene rol de capitán.
            </p>
            <p class="text-sm text-slate-600">
              Solo los usuarios con rol de <strong>capitán</strong> pueden registrar equipos.
            </p>
          </div>
  
          <div
            v-else-if="myTeams && !myTeams.canCreateTeam"
            class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p class="font-semibold mb-1">Ya alcanzaste el límite de equipos registrados.</p>
              <p class="text-sm">
                Tienes <strong>{{ myTeams.currentTeams }}</strong> de
                <strong>{{ myTeams.maxTeamsAllowed }}</strong> equipo(s) permitidos.
              </p>
            </div>
            <NuxtLink
              :to="mainTeamLink"
              class="inline-flex items-center rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Ver mi equipo
            </NuxtLink>
          </div>
  
          <section
            v-if="canRegisterTeam"
            class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
          >
            <div class="px-6 py-4 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] flex items-center justify-between">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">
                  registro de capitán
                </p>
                <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Datos del equipo e integrantes
                </h2>
              </div>
            </div>
  
            <form class="px-6 py-8 space-y-8" @submit.prevent="onSubmit">
              <!-- Datos del equipo -->
              <div class="space-y-4">
                <h3 class="font-semibold text-slate-900 text-lg">Datos del equipo</h3>
  
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre del equipo
                    </label>
                    <input
                      v-model="teamName"
                      type="text"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                      placeholder="Ej. Tigres del Norte"
                    />
                  </div>
  
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre corto
                    </label>
                    <input
                      v-model="teamShortName"
                      type="text"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                      placeholder="Ej. TIG"
                    />
                  </div>
                </div>
  
                <div class="grid md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Liga</label>
                    <select
                      v-model.number="selectedLeagueId"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                    >
                      <option :value="0" disabled>Selecciona liga</option>
                      <option v-for="league in leagues" :key="league.id" :value="league.id">
                        {{ league.name }}
                      </option>
                    </select>
                  </div>
  
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Temporada</label>
                    <select
                      v-model.number="selectedSeasonId"
                      :disabled="!selectedLeagueId"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option :value="0" disabled>
                        {{ selectedLeagueId ? 'Selecciona temporada' : 'Primero elige una liga' }}
                      </option>
                      <option v-for="season in availableSeasons" :key="season.id" :value="season.id">
                        {{ season.name }}
                      </option>
                    </select>
                  </div>
  
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                    <select
                      v-model="selectedGender"
                      :disabled="categoriesLoading || !selectedLeagueId"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="" disabled>
                        {{ categoriesLoading ? 'Cargando…' : 'Selecciona categoría' }}
                      </option>
                      <option v-for="g in genderOptions" :key="g.value" :value="g.value">
                        {{ g.label }}
                      </option>
                    </select>
                    <p v-if="categoriesError" class="mt-1 text-[11px] text-red-600">
                      {{ categoriesError }}
                    </p>
                  </div>
  
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Rama</label>
                    <select
                      v-model="selectedRama"
                      :disabled="!selectedGender"
                      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="" disabled>
                        {{ selectedGender ? 'Selecciona rama' : 'Primero elige categoría' }}
                      </option>
                      <option v-for="r in ramaOptions" :key="r.value" :value="r.value">
                        {{ r.label }}
                      </option>
                    </select>
                  </div>
                </div>
  
                <div v-if="selectedCategory" class="mt-2 text-[11px] text-slate-500">
                  Seleccionaste: <span class="font-semibold">{{ selectedCategory.name }}</span>
                </div>
  
                <div class="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Color primario</label>
                    <div class="flex items-center gap-3">
                      <input v-model="colorPrimary" type="color" class="h-9 w-9 rounded-lg border border-slate-300 bg-white cursor-pointer" />
                      <input
                        v-model="colorPrimary"
                        type="text"
                        class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        placeholder="#1D4ED8"
                      />
                    </div>
                  </div>
  
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Color secundario</label>
                    <div class="flex items-center gap-3">
                      <input v-model="colorSecondary" type="color" class="h-9 w-9 rounded-lg border border-slate-300 bg-white cursor-pointer" />
                      <input
                        v-model="colorSecondary"
                        type="text"
                        class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>
  
                <div class="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start mt-2">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Logo del equipo</label>
                    <p class="text-[11px] text-slate-500 mb-2">
                      Sube el logo oficial (JPG o PNG).
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                      @change="onLogoChange"
                    />
                  </div>
  
                  <div class="flex justify-center md:justify-end">
                    <div class="w-28 h-28 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                      <img v-if="logoPreview" :src="logoPreview" alt="Logo del equipo" class="w-full h-full object-contain" />
                      <span v-else class="text-[11px] text-slate-400 text-center px-2">Previsualización</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Integrantes -->
              <div class="space-y-4 mt-8">
                <div class="flex items-center justify-between gap-2">
                  <div>
                    <h3 class="font-semibold text-slate-900 text-lg">Integrantes del equipo</h3>
                    <p class="text-xs text-slate-500">
                      Solo se registrarán los integrantes que tengan <strong>Nombre + CURP + Foto</strong>.
                      Los incompletos <strong>se ignoran</strong>. El jersey es opcional.
                    </p>
                    <p class="mt-1 text-[11px] text-slate-500">
                      Se enviarán: <strong>{{ sendablePlayers.length }}</strong> / {{ players.length }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    @click="addPlayer"
                  >
                    + Agregar integrante
                  </button>
                </div>
  
                <div v-if="players.length === 0" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  No has agregado integrantes. Puedes registrar el equipo así y después subirlos en “Mi equipo”.
                </div>
  
                <div v-else class="space-y-3">
                  <div
                    v-for="(player, index) in players"
                    :key="player.id"
                    class="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-5 sm:py-4"
                  >
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <div class="flex items-center gap-2 text-xs text-slate-500">
                        <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                          {{ index + 1 }}
                        </span>
                        <span>Integrante</span>
                      </div>
                      <button
                        type="button"
                        class="text-[11px] text-slate-500 hover:text-red-500"
                        @click="removePlayer(index)"
                      >
                        Eliminar
                      </button>
                    </div>
  
                    <div class="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 items-start">
                      <div class="space-y-3">
                        <div>
                          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
                            Nombre completo (solo si lo vas a registrar)
                          </label>
                          <input
                            v-model="player.fullName"
                            type="text"
                            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                            placeholder="Ej. María López"
                          />
                        </div>
  
                        <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
                          <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">
                              CURP (solo si lo vas a registrar)
                            </label>
                            <input
                              v-model="player.curp"
                              type="text"
                              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 uppercase tracking-[0.08em] focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                              placeholder="CURP"
                            />
                          </div>
  
                          <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">
                              # Jersey (opcional)
                            </label>
                            <input
                              v-model.number="player.jerseyNumber"
                              type="number"
                              min="0"
                              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                              placeholder="Ej. 10"
                            />
                          </div>
                        </div>
                      </div>
  
                      <div class="space-y-2">
                        <label class="block text-[11px] font-semibold text-slate-700 mb-1">
                          Foto (solo si lo vas a registrar)
                        </label>
                        <p class="text-[11px] text-slate-500">
                          Si no hay foto, este integrante no se enviará.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          class="block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                          @change="onPlayerPhotoChange(index, $event)"
                        />
  
                        <div class="mt-2 w-full h-24 rounded-2xl border border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden">
                          <img v-if="player.photoPreview" :src="player.photoPreview" alt="Foto del jugador" class="w-full h-full object-cover" />
                          <span v-else class="text-[11px] text-slate-400 px-2 text-center">
                            Previsualización de la foto
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <p class="text-[11px] text-slate-500">
                  Puedes agregar más integrantes después desde <strong>"Mi equipo"</strong>.
                </p>
              </div>
  
              <!-- Mensajes -->
              <div
                v-if="successMessage"
                class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800"
              >
                {{ successMessage }}
              </div>
              <div
                v-if="errorMessage"
                class="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700"
              >
                {{ errorMessage }}
              </div>
  
              <!-- Botones -->
              <div class="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  class="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="saveDraft"
                >
                  Guardar cambios
                </button>
  
                <button
                  type="button"
                  class="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                  @click="clearProgress"
                >
                  Borrar progreso
                </button>
  
                <button
                  type="submit"
                  class="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="submitting || !canRegisterTeam"
                >
                  <span v-if="submitting">Subiendo información…</span>
                  <span v-else>Registrar equipo</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  </template>
  