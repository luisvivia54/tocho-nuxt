<script setup lang="ts">
  import { ref, computed, onMounted, watch, type Ref } from 'vue'
  import { useNuxtApp, useRuntimeConfig } from '#imports'
  import { useAuthz } from '@/composables/useAuthz'
  
  const authz = useAuthz()
  // Forzamos a TS a tratar isAuthenticated como Ref<boolean>
  const isAuthenticated = authz.isAuthenticated as Ref<boolean>
  
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
    colorPrimary?: string | null
    colorSecondary?: string | null
    logoUrl?: string | null
  }
  
  interface PlayerForm {
    id: number
    fullName: string
    curp: string
    photoFile: File | null
    photoPreview: string | null
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
  
  // ================== ESTADO FORM ==================
  const teamName = ref('')
  const teamShortName = ref('')
  const logoFile = ref<File | null>(null)
  const logoPreview = ref<string | null>(null)
  
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
  
  // Foto jugador (arreglando "objeto posiblemente undefined")
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
    players?: { id: number; fullName?: string; curp?: string }[]
  }
  
  const saveDraft = () => {
    try {
      const draft: DraftData = {
        teamName: teamName.value,
        teamShortName: teamShortName.value,
        colorPrimary: colorPrimary.value,
        colorSecondary: colorSecondary.value,
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
  
      // 1) Crear equipo
      const createdTeam = await $fetch<CreatedTeam>('/teams/mine', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: teamName.value,
          shortName: teamShortName.value || null,
          colorPrimary: colorPrimary.value,
          colorSecondary: colorSecondary.value
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
  
      // 3) Crear jugadores
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
  