<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useNuxtApp, useRuntimeConfig } from '#imports'
  import { useAuthz } from '@/composables/useAuthz'
  
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
    photoFile: File | null
    photoPreview: string | null
  }
  
  // Opciones de liga / temporada / categoría (de momento estático)
  interface LeagueOption {
    id: number
    name: string
  }
  
  interface SeasonOption {
    id: number
    name: string
    leagueId: number
  }
  
  interface CategoryOption {
    id: number
    name: string
    seasonId: number
  }
  
  // ================== ESTADO BACK (teams/mine) ==================
  const myTeams = ref<MyTeamsInfo | null>(null)
  const captainLoading = ref(false)
  const captainError = ref<string | null>(null)
  
  const mainTeam = computed<MyTeamItem | null>(() => myTeams.value?.teams?.[0] ?? null)
  
  const mainTeamLink = computed(() => {
    return mainTeam.value ? `/equipos/${mainTeam.value.teamId}` : '/mi-equipo'
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      myTeams.value = resp
    } catch (err) {
      console.error('Error cargando /teams/mine', err)
      captainError.value = 'No se pudo obtener la información de tus equipos.'
    } finally {
      captainLoading.value = false
    }
  }
  
  // ================== LIGA / TEMPORADA / CATEGORÍA ==================
  // De momento estático para que funcione. Luego puedes cambiarlos
  // a llamadas reales al backend si quieres.
  const leagues = ref<LeagueOption[]>([
    { id: 1, name: 'Liga Tochero5' }
    // Agrega más ligas si lo necesitas
  ])
  
  const seasons = ref<SeasonOption[]>([
    { id: 1, name: 'Temporada Acatlán', leagueId: 1 }
    // Agrega más temporadas
  ])
  
  const categories = ref<CategoryOption[]>([
    { id: 1, name: 'Femenil U16', seasonId: 1 }
    // Agrega más categorías
  ])
  
  const selectedLeagueId = ref<number>(0)
  const selectedSeasonId = ref<number>(0)
  const selectedCategoryId = ref<number>(0)
  
  const availableSeasons = computed(() =>
    seasons.value.filter((s) => !selectedLeagueId.value || s.leagueId === selectedLeagueId.value)
  )
  
  const availableCategories = computed(() =>
    categories.value.filter((c) => !selectedSeasonId.value || c.seasonId === selectedSeasonId.value)
  )
  
  watch(
    () => selectedLeagueId.value,
    () => {
      // reset cascada
      selectedSeasonId.value = 0
      selectedCategoryId.value = 0
    }
  )
  
  watch(
    () => selectedSeasonId.value,
    () => {
      selectedCategoryId.value = 0
    }
  )
  
  // ================== ESTADO FORM ==================
  const teamName = ref('')
  const teamShortName = ref('')
  const logoFile = ref<File | null>(null)
  const logoPreview = ref<string | null>(null)
  
  // Colores: SOLO de adorno, no se mandan al back
  const colorPrimary = ref('#1D4ED8') // azul
  const colorSecondary = ref('#FFFFFF') // blanco
  
  const players = ref<PlayerForm[]>([])
  
  const createEmptyPlayer = (id: number): PlayerForm => ({
    id,
    fullName: '',
    curp: '',
    photoFile: null,
    photoPreview: null
  })
  
  const initPlayers = () => {
    players.value = []
    for (let i = 0; i < 5; i++) {
      players.value.push(createEmptyPlayer(i + 1))
    }
  }
  initPlayers()
  
  // Logo
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
  
  // Foto jugador
  const onPlayerPhotoChange = (index: number, event: Event) => {
    const list = players.value
    const player = list[index]
    if (!player) return
  
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0] ?? null
  
    if (!file) {
      player.photoFile = null
      player.photoPreview = null
      return
    }
  
    player.photoFile = file
    player.photoPreview = URL.createObjectURL(file)
  }
  
  const addPlayer = () => {
    const list = players.value
    const last = list[list.length - 1]
    const nextId = last ? last.id + 1 : 1
    list.push(createEmptyPlayer(nextId))
  }
  
  const removePlayer = (index: number) => {
    const list = players.value
    if (index < 0 || index >= list.length) return
    list.splice(index, 1)
    if (list.length === 0) list.push(createEmptyPlayer(1))
  }
  
  // ================== BORRADOR LOCAL ==================
  const DRAFT_KEY = 'registroEquipoDraft'
  
  const successMessage = ref('')
  const errorMessage = ref('')
  
  interface DraftData {
    teamName?: string
    teamShortName?: string
    colorPrimary?: string
    colorSecondary?: string
    leagueId?: number
    seasonId?: number
    categoryId?: number
    players?: { id: number; fullName?: string; curp?: string }[]
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
        players: players.value.map((p) => ({
          id: p.id,
          fullName: p.fullName,
          curp: p.curp
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
      selectedCategoryId.value = draft.categoryId ?? 0
  
      const playersDraft = draft.players ?? []
      if (playersDraft.length > 0) {
        players.value = playersDraft.map((p, idx) => ({
          id: p.id ?? idx + 1,
          fullName: p.fullName ?? '',
          curp: p.curp ?? '',
          photoFile: null,
          photoPreview: null
        }))
      }
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
    logoPreview.value = null
  
    selectedLeagueId.value = 0
    selectedSeasonId.value = 0
    selectedCategoryId.value = 0
  
    initPlayers()
  
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
      errorMessage.value = 'Selecciona liga, temporada y categoría antes de registrar el equipo.'
      return
    }
  
    try {
      submitting.value = true
  
      const { $kcGetToken } = nuxtApp as any
      const tokenFn: (() => Promise<string | undefined>) | undefined = $kcGetToken
      const token = tokenFn ? ((await tokenFn()) ?? '') : ''
  
      if (!token) {
        errorMessage.value = 'No se encontró un token de sesión. Vuelve a iniciar sesión.'
        submitting.value = false
        return
      }
  
      // 1) Crear equipo (solo mandamos lo que pide el back: name, leagueId, seasonId, categoryId)
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
          categoryId: selectedCategoryId.value
        }
      })
  
      const teamId = createdTeam.teamId
  
      // 2) Subir logo (si hay)
      if (logoFile.value) {
        const formLogo = new FormData()
        formLogo.append('logo', logoFile.value)
  
        await $fetch(`/teams/${teamId}/logo`, {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: formLogo,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
  
      // 3) Crear jugadores (fullName + curp + foto; jersey/birthdate opcionales)
      for (const p of players.value) {
        if (!p.fullName.trim() || !p.curp.trim()) continue
  
        const formPlayer = new FormData()
        formPlayer.append('fullName', p.fullName)
        formPlayer.append('curp', p.curp)
        if (p.photoFile) {
          formPlayer.append('photo', p.photoFile)
        }
  
        await $fetch(`/teams/${teamId}/players`, {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: formPlayer,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
  
      successMessage.value =
        'Equipo registrado correctamente. La organización revisará los datos de tu equipo.'
      errorMessage.value = ''
      clearProgress()
      await fetchMyTeams()
    } catch (err: any) {
      console.error('Error al enviar registro:', err)
      errorMessage.value =
        'Ocurrió un error al subir la información. Verifica tus datos o inténtalo más tarde.'
    } finally {
      submitting.value = false
    }
  }
  
  // ================== CICLO DE VIDA ==================
  onMounted(() => {
    loadDraft()
    if (isAuthenticated.value) {
      fetchMyTeams()
    }
  })
  
  watch(
    () => isAuthenticated.value,
    (value) => {
      if (value) {
        fetchMyTeams()
      } else {
        myTeams.value = null
      }
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
        Completa la información de tu equipo. Esta información será visible para la organización de la liga.
      </p>

      <!-- Si NO está autenticado, pedimos login -->
      <div
        v-if="!isAuthenticated"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 class="font-semibold text-slate-900 mb-1">Inicia sesión para registrar tu equipo</h2>
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
        <!-- Estado de capitán / capacidad -->
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

        <!-- No es capitán -->
        <div
          v-else-if="myTeams && !myTeams.hasCaptainPrivileges"
          class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
        >
          <p class="font-semibold text-slate-900 mb-1">
            Tu usuario no tiene rol de capitán.
          </p>
          <p class="text-sm text-slate-600">
            Solo los usuarios con rol de <strong>capitán</strong> pueden registrar equipos. Ponte en
            contacto con la organización para que actualicen tu rol.
          </p>
        </div>

        <!-- Es capitán pero ya no puede crear más equipos -->
        <div
          v-else-if="myTeams && !myTeams.canCreateTeam"
          class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <p class="font-semibold mb-1">
              Ya alcanzaste el límite de equipos registrados.
            </p>
            <p class="text-sm">
              Tienes
              <strong>{{ myTeams.currentTeams }}</strong> de
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

        <!-- Formulario de registro SOLO si puede crear equipo -->
        <section
          v-if="canRegisterTeam"
          class="rounded-[26px] bg-white border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          <!-- Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-[#4F46E5] to-[#2563EB] flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.25em] text-blue-100 uppercase">
                registro de capitán
              </p>
              <h2 class="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                Datos del equipo e integrantes
              </h2>
            </div>
            <div class="hidden sm:block text-xs text-blue-50/85 text-right">
              <p>Guarda cambios antes de salir.</p>
              <p>Sube la información cuando esté completa.</p>
            </div>
          </div>

          <form class="px-6 py-8 space-y-8" @submit.prevent="onSubmit">
            <!-- Datos del equipo -->
            <div class="space-y-4">
              <h3 class="font-semibold text-slate-900 text-lg">Datos del equipo</h3>
              <p class="text-xs text-slate-500">
                Estos datos identifican a tu equipo dentro de la liga.
              </p>

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

              <!-- Liga / Temporada / Categoría -->
              <div class="grid md:grid-cols-3 gap-4 mt-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Liga
                  </label>
                  <select
                    v-model.number="selectedLeagueId"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                  >
                    <option :value="0" disabled>Selecciona liga</option>
                    <option v-for="league in leagues" :key="league.id" :value="league.id">
                      {{ league.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Temporada
                  </label>
                  <select
                    v-model.number="selectedSeasonId"
                    :disabled="!selectedLeagueId"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option :value="0" disabled>
                      {{ selectedLeagueId ? 'Selecciona temporada' : 'Primero elige una liga' }}
                    </option>
                    <option
                      v-for="season in availableSeasons"
                      :key="season.id"
                      :value="season.id"
                    >
                      {{ season.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    v-model.number="selectedCategoryId"
                    :disabled="!selectedSeasonId"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option :value="0" disabled>
                      {{ selectedSeasonId ? 'Selecciona categoría' : 'Primero elige temporada' }}
                    </option>
                    <option
                      v-for="category in availableCategories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Colores (solo adorno, no van al back) -->
              <div class="grid md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Color primario
                  </label>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="colorPrimary"
                      type="color"
                      class="h-9 w-9 rounded-lg border border-slate-300 bg-white cursor-pointer"
                    />
                    <input
                      v-model="colorPrimary"
                      type="text"
                      class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                      placeholder="#1D4ED8 o blue"
                    />
                  </div>
                  <p class="mt-1 text-[11px] text-slate-500">
                    Se usa para fondos y acentos principales de tu equipo.
                  </p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Color secundario
                  </label>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="colorSecondary"
                      type="color"
                      class="h-9 w-9 rounded-lg border border-slate-300 bg-white cursor-pointer"
                    />
                    <input
                      v-model="colorSecondary"
                      type="text"
                      class="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                      placeholder="#FFFFFF o white"
                    />
                  </div>
                  <p class="mt-1 text-[11px] text-slate-500">
                    Se usa para detalles, números y contrastes.
                  </p>
                </div>
              </div>

              <!-- Logo del equipo -->
              <div class="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start mt-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Logo del equipo
                  </label>
                  <p class="text-[11px] text-slate-500 mb-2">
                    Sube el logo oficial de tu equipo (JPG o PNG, recomendado 512×512px).
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    @change="onLogoChange"
                  />
                </div>

                <div class="flex justify-center md:justify-end">
                  <div
                    class="w-28 h-28 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="logoPreview"
                      :src="logoPreview"
                      alt="Logo del equipo"
                      class="w-full h-full object-contain"
                    />
                    <span v-else class="text-[11px] text-slate-400 text-center px-2">
                      Previsualización del logo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Integrantes -->
            <!-- (resto igual que ya tenías: lista de players, mensajes y botones) -->
            <!-- ... tu bloque de integrantes + mensajes + botones exactamente como lo pegaste antes ... -->

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

            <!-- Botones de acción -->
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
  