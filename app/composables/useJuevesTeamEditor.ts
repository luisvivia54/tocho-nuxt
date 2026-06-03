import { computed, ref, type Ref, unref } from 'vue'
import { useAuthz } from '~/composables/useAuthz'
import { useAuthedFetch } from '~/composables/useAuthedFetch'
import { useNuxtApp, useState } from '#imports'

type HeadersMap = Record<string, string>

export type JuevesCategory = {
  id: number
  name: string
  code: string
  gender: string
}

export type JuevesPlayerDraft = {
  id: string
  playerId: number | null
  fullName: string
  curp: string
  jerseyNumber: string
  photoFile: File | null
  photoPreview: string | null
  markedForDeletion: boolean
  isNew: boolean
}

export type JuevesTeamDraft = {
  id: number | null
  name: string
  shortName: string
  categoryId: number
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  players: JuevesPlayerDraft[]
}

type UploadResponse = {
  publicUrl?: string
  message?: string
  error?: string
}

type ApiErrorLike = {
  status?: number
  statusCode?: number
  message?: string
  response?: {
    status?: number
    _data?: { status?: number; message?: string }
  }
  data?: {
    message?: string
  }
}

type LooseRecord = Record<string, unknown>

const LEAGUE_ID = 2
const SEASON_ID = 3

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 8)}-${Date.now().toString(16).slice(2)}`
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

function normalizeUrl(value?: string | null) {
  const normalized = String(value || '').trim()
  if (!normalized || normalized === 'NULL') return ''
  return normalized
}

function readStatus(err: unknown): number | undefined {
  const e = err as ApiErrorLike
  return e?.statusCode ?? e?.status ?? e?.response?.status ?? e?.response?._data?.status
}

function readMessage(err: unknown) {
  const e = err as ApiErrorLike
  return e?.data?.message ?? e?.response?._data?.message ?? e?.message ?? ''
}

function createEmptyPlayer(): JuevesPlayerDraft {
  return {
    id: uid('pl'),
    playerId: null,
    fullName: '',
    curp: '',
    jerseyNumber: '',
    photoFile: null,
    photoPreview: null,
    markedForDeletion: false,
    isNew: true,
  }
}

function createEmptyTeam(): JuevesTeamDraft {
  return {
    id: null,
    name: '',
    shortName: '',
    categoryId: 0,
    primaryColor: '#F97316',
    secondaryColor: '#FFFFFF',
    logoUrl: '',
    players: [],
  }
}

function niceGender(g: string) {
  const x = String(g || '').toUpperCase()
  if (x === 'VARONIL') return 'Varonil'
  if (x === 'FEMENIL') return 'Femenil'
  if (x === 'MIXTO') return 'Mixto'
  return g || '—'
}

export function useJuevesTeamEditor(teamIdInput: number | Ref<number>) {
  const nuxtApp = useNuxtApp()
  const { authedFetch } = useAuthedFetch()
  const kcReady = useState<boolean>('kcReady', () => false)
  const authz = useAuthz() as { isAuthenticated?: boolean | Ref<boolean> }

  const API_BASE = '/api/t5'
  const ASSET_UPLOAD_ENDPOINT = `${API_BASE}/assets/upload`

  const teamId = computed(() => Number(unref(teamIdInput)) || 0)

  const isAuthenticated = computed<boolean>(() => {
    const raw = authz?.isAuthenticated
    if (typeof raw === 'boolean') return raw
    if (raw && typeof raw === 'object' && 'value' in raw) return !!raw.value
    const kc = (nuxtApp as { $kc?: { authenticated?: boolean } }).$kc
    return !!kc?.authenticated
  })

  const authReady = computed(() => kcReady.value && isAuthenticated.value)
  const loading = ref(false)
  const saving = ref(false)
  const uploading = ref(false)
  const deleting = ref(false)
  const loadError = ref('')
  const successMessage = ref('')
  const errorMessage = ref('')

  const categories = ref<JuevesCategory[]>([])
  const categoriesLoading = ref(false)
  const team = ref<JuevesTeamDraft>(createEmptyTeam())
  const serverSnapshot = ref<JuevesTeamDraft>(createEmptyTeam())

  const selectedCategory = computed<JuevesCategory | null>(() =>
    categories.value.find((item) => item.id === team.value.categoryId) || null
  )

  const validPlayers = computed(() =>
    team.value.players.filter((player) => player.fullName.trim() && player.curp.trim() && (player.photoFile || player.photoPreview))
  )

  const teamDisplayName = computed(() => team.value.name.trim() || 'Equipo')

  async function getAccessToken(): Promise<string | null> {
    const app = nuxtApp as unknown as {
      $kc?: { updateToken?: (seconds: number) => Promise<boolean>; token?: string | null }
      $kcGetToken?: () => Promise<string | undefined>
      $getToken?: () => Promise<string | undefined>
    }

    try {
      await app.$kc?.updateToken?.(30)
    } catch (err) {
      console.warn('No se pudo refrescar token de jueves:', err)
    }

    if (typeof app.$kc?.token === 'string' && app.$kc.token.length > 20) return app.$kc.token

    if (typeof app.$kcGetToken === 'function') {
      try {
        const token = await app.$kcGetToken()
        if (typeof token === 'string' && token.length > 20) return token
      } catch (err) {
        console.warn('No se pudo obtener token con $kcGetToken:', err)
      }
    }

    if (typeof app.$getToken === 'function') {
      try {
        const token = await app.$getToken()
        if (typeof token === 'string' && token.length > 20) return token
      } catch (err) {
        console.warn('No se pudo obtener token con $getToken:', err)
      }
    }

    return null
  }

  async function authHeaders(json = false): Promise<HeadersMap> {
    const token = await getAccessToken()
    const headers: HeadersMap = {}
    if (json) headers['Content-Type'] = 'application/json'
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  function revokeAllPlayerPreviews() {
    for (const player of team.value.players) {
      if (player.photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(player.photoPreview)
      }
    }
  }

  function cleanupPreviews() {
    revokeAllPlayerPreviews()
  }

  function normalizeTeamFromApi(raw: LooseRecord): JuevesTeamDraft {
    const teamRaw =
      raw.team && typeof raw.team === 'object'
        ? (raw.team as LooseRecord)
        : raw

    const category =
      teamRaw.category && typeof teamRaw.category === 'object'
        ? (teamRaw.category as LooseRecord)
        : {}

    const rosterRaw = Array.isArray(raw?.players)
      ? (raw.players as LooseRecord[])
      : Array.isArray(teamRaw?.players)
        ? (teamRaw.players as LooseRecord[])
        : Array.isArray(raw?.members)
          ? (raw.members as LooseRecord[])
          : Array.isArray(teamRaw?.members)
            ? (teamRaw.members as LooseRecord[])
            : Array.isArray(raw?.roster)
              ? (raw.roster as LooseRecord[])
              : Array.isArray(teamRaw?.roster)
                ? (teamRaw.roster as LooseRecord[])
                : []

    return {
      id: Number(teamRaw?.id ?? teamRaw?.teamId ?? teamRaw?.team_id ?? 0) || null,
      name: String(teamRaw?.name ?? teamRaw?.teamName ?? ''),
      shortName: String(teamRaw?.shortName ?? teamRaw?.short_name ?? teamRaw?.abbr ?? ''),
      categoryId: Number(teamRaw?.categoryId ?? teamRaw?.category_id ?? category.id ?? 0) || 0,
      primaryColor: String(teamRaw?.colorPrimary ?? teamRaw?.primaryColor ?? teamRaw?.primary_color ?? '#F97316'),
      secondaryColor: String(teamRaw?.colorSecondary ?? teamRaw?.secondaryColor ?? teamRaw?.secondary_color ?? '#FFFFFF'),
      logoUrl: normalizeUrl(String(teamRaw?.logoUrl ?? teamRaw?.logo_url ?? teamRaw?.photoUrl ?? teamRaw?.photo_url ?? '')),
      players: rosterRaw.map((player) => ({
        id: uid('pl'),
        playerId: Number(player?.playerId ?? player?.id ?? 0) || null,
        fullName: String(player?.fullName ?? player?.full_name ?? player?.name ?? ''),
        curp: String(player?.curp ?? player?.CURP ?? ''),
        jerseyNumber: String(player?.jerseyNumber ?? player?.jersey_number ?? player?.number ?? ''),
        photoFile: null,
        photoPreview: normalizeUrl(String(player?.photoUrl ?? player?.photo_url ?? '')),
        markedForDeletion: false,
        isNew: false,
      })),
    }
  }

  async function fetchCategories() {
    categoriesLoading.value = true

    try {
      const response = await fetch(`${API_BASE}/categories?leagueId=${LEAGUE_ID}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const raw = await response.json()
      const arr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.content)
          ? raw.content
          : Array.isArray(raw?.items)
            ? raw.items
            : Array.isArray(raw?.data)
              ? raw.data
              : []

      categories.value = arr
        .map((item: LooseRecord) => ({
          id: Number(item?.id ?? item?.categoryId ?? 0) || 0,
          name: String(item?.name ?? '').trim(),
          code: String(item?.code ?? '').trim(),
          gender: String(item?.gender ?? '').trim(),
        }))
        .filter((item: JuevesCategory) => item.id > 0 && !!item.name)
    } catch (err) {
      console.error('Error cargando categorías:', err)
      categories.value = []
    } finally {
      categoriesLoading.value = false
    }
  }

  async function fetchExistingTeam(id = teamId.value) {
    const headers = await authHeaders(false)
    loadError.value = ''

    try {
      const response = await fetch(`${API_BASE}/teams/${id}/detail`, {
        headers: headers.Authorization ? { Authorization: headers.Authorization } : {},
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const normalized = normalizeTeamFromApi(data)
      revokeAllPlayerPreviews()
      team.value = clone(normalized)
      serverSnapshot.value = clone(normalized)
      successMessage.value = ''
      errorMessage.value = ''
    } catch (err) {
      console.error('Error cargando equipo de jueves:', err)
      loadError.value = readMessage(err) || 'No se pudo cargar el equipo.'
      throw err
    }
  }

  async function loadForEdit() {
    loading.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
      await Promise.all([fetchCategories(), fetchExistingTeam()])
    } finally {
      loading.value = false
    }
  }

  async function uploadAsset(folder: string, file: File) {
    const token = await getAccessToken()
    if (!token) throw new Error('No hay sesión activa.')

    const formData = new FormData()
    formData.append('folder', folder)
    formData.append('file', file)

    const response = await fetch(ASSET_UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const text = await response.text().catch(() => '')
    let json: UploadResponse | null = null

    try {
      json = text ? JSON.parse(text) : null
    } catch (err) {
      console.warn('Respuesta no JSON al subir asset de jueves:', err)
    }

    if (!response.ok) throw new Error(json?.message || json?.error || `${response.status} ${response.statusText}`)
    return json
  }

  async function onLogoChange(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    uploading.value = true
    errorMessage.value = ''
    successMessage.value = 'Subiendo logo…'

    try {
      const response = await uploadAsset('site/jueves/teams/logos', file)
      const publicUrl = String(response?.publicUrl || '')
      if (!publicUrl) throw new Error('La API no regresó publicUrl.')
      team.value.logoUrl = publicUrl
      successMessage.value = 'Logo subido correctamente.'
    } catch (err) {
      errorMessage.value = readMessage(err) || 'No se pudo subir el logo.'
      successMessage.value = ''
    } finally {
      uploading.value = false
    }
  }

  function onPlayerPhotoChange(index: number, event: Event) {
    const player = team.value.players[index]
    if (!player) return

    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null

    if (player.photoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(player.photoPreview)
    }

    player.photoFile = file
    player.photoPreview = file ? URL.createObjectURL(file) : player.isNew ? null : player.photoPreview
  }

  function addPlayer() {
    team.value.players.push(createEmptyPlayer())
  }

  function removePlayer(index: number) {
    const player = team.value.players[index]
    if (!player) return

    if (player.isNew && !player.playerId) {
      if (player.photoPreview?.startsWith('blob:')) URL.revokeObjectURL(player.photoPreview)
      team.value.players.splice(index, 1)
      return
    }

    player.markedForDeletion = !player.markedForDeletion
  }

  function buildTeamPayload() {
    return {
      id: team.value.id,
      teamId: team.value.id,
      name: team.value.name.trim(),
      teamName: team.value.name.trim(),
      shortName: team.value.shortName.trim(),
      short_name: team.value.shortName.trim(),
      categoryId: team.value.categoryId,
      category_id: team.value.categoryId,
      seasonId: SEASON_ID,
      season_id: SEASON_ID,
      leagueId: LEAGUE_ID,
      league_id: LEAGUE_ID,
      colorPrimary: team.value.primaryColor.trim(),
      colorSecondary: team.value.secondaryColor.trim(),
      primaryColor: team.value.primaryColor.trim(),
      primary_color: team.value.primaryColor.trim(),
      secondaryColor: team.value.secondaryColor.trim(),
      secondary_color: team.value.secondaryColor.trim(),
      logoUrl: team.value.logoUrl.trim(),
      logo_url: team.value.logoUrl.trim(),
    }
  }

  function validateTeam() {
    if (!team.value.name.trim()) return 'Escribe el nombre del equipo.'
    if (!team.value.shortName.trim()) return 'Escribe el nombre corto.'
    if (!team.value.categoryId) return 'Selecciona una categoría.'
    return ''
  }

  function validateRoster() {
    const activePlayers = team.value.players.filter((player) => !player.markedForDeletion)

    for (const [index, player] of activePlayers.entries()) {
      const missing: string[] = []

      if (!player.fullName.trim()) missing.push('nombre')
      if (!player.curp.trim()) missing.push('CURP')
      if (!player.photoFile && !player.photoPreview) missing.push('foto')

      if (!missing.length) continue

      const label = player.fullName.trim() ? `El jugador "${player.fullName.trim()}"` : `El jugador #${index + 1}`
      return `${label} debe tener ${missing.join(', ')} antes de guardar el roster.`
    }

    return ''
  }

  async function saveTeamDetails() {
    errorMessage.value = ''
    successMessage.value = ''

    const validation = validateTeam()
    if (validation) {
      errorMessage.value = validation
      return false
    }

    saving.value = true

    try {
      const headers = await authHeaders(true)
      if (!headers.Authorization) throw new Error('No hay sesión activa.')

      const url = `${API_BASE}/teams/${teamId.value}`

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(buildTeamPayload()),
        })

        if (!response.ok) throw new Error(await response.text())
      } catch {
        const response = await fetch(url, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(buildTeamPayload()),
        })

        if (!response.ok) {
          const raw = await response.text().catch(() => '')
          throw new Error(raw || `Error ${response.status}`)
        }
      }

      serverSnapshot.value = clone(team.value)
      successMessage.value = 'Equipo actualizado correctamente.'
      return true
    } catch (err) {
      errorMessage.value = readMessage(err) || 'No se pudo guardar el equipo.'
      return false
    } finally {
      saving.value = false
    }
  }

  async function saveRoster() {
    errorMessage.value = ''
    successMessage.value = ''

    const validation = validateRoster()
    if (validation) {
      errorMessage.value = validation
      return false
    }

    saving.value = true

    try {
      for (const player of team.value.players) {
        if (!player.playerId || !player.markedForDeletion) continue

        try {
          await authedFetch(`${API_BASE}/teams/${teamId.value}/players/${player.playerId}`, {
            method: 'DELETE',
          })
        } catch (err) {
          const status = readStatus(err)
          if (status === 401 || status === 403) throw err
          // 404 = ya no existe en el servidor, continuar
        }
      }

      for (const player of team.value.players) {
        if (player.markedForDeletion) continue

        const formData = new FormData()
        formData.append('fullName', player.fullName.trim())
        formData.append('curp', player.curp.trim().toUpperCase())
        if (player.jerseyNumber.trim()) formData.append('jerseyNumber', player.jerseyNumber.trim())
        if (player.photoFile) {
          formData.append('photo', player.photoFile)
        }

        if (player.playerId && !player.isNew) {
          await authedFetch(`${API_BASE}/teams/${teamId.value}/players/${player.playerId}`, {
            method: 'PUT',
            body: formData,
          })
        } else {
          await authedFetch(`${API_BASE}/teams/${teamId.value}/players`, {
            method: 'POST',
            body: formData,
          })
        }
      }

      await fetchExistingTeam()
      successMessage.value = 'Roster actualizado correctamente.'
      return true
    } catch (err) {
      errorMessage.value = readMessage(err) || 'No se pudo guardar el roster.'
      return false
    } finally {
      saving.value = false
    }
  }

  async function deactivateTeam() {
    deleting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const token = await getAccessToken()
      if (!token) throw new Error('No hay sesión activa. Vuelve a iniciar sesión.')

      const urls = [
        `${API_BASE}/teams/${encodeURIComponent(String(teamId.value))}/active`,
        `${API_BASE}/teams/${encodeURIComponent(String(teamId.value))}`,
      ]

      let lastError: unknown = null
      let ok = false

      for (const url of urls) {
        try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ isActive: false }),
          })

          if (!response.ok) {
            const message = await response.text().catch(() => '')
            const error = new Error(message || `${response.status} ${response.statusText}`) as Error & { status?: number }
            error.status = response.status
            throw error
          }

          ok = true
          break
        } catch (err) {
          lastError = err
          if (readStatus(err) !== 404) throw err
        }
      }

      if (!ok && lastError) throw lastError

      successMessage.value = `Equipo "${teamDisplayName.value}" desactivado correctamente.`
      return true
    } catch (err) {
      const status = readStatus(err)
      if (status === 404) errorMessage.value = 'No se encontró endpoint de soft delete para este equipo.'
      else if (status === 401) errorMessage.value = 'Tu sesión expiró. Vuelve a iniciar sesión.'
      else if (status === 403) errorMessage.value = 'No autorizado para desactivar este equipo.'
      else if (status === 409) errorMessage.value = 'No se pudo desactivar el equipo porque tiene relaciones activas.'
      else errorMessage.value = readMessage(err) || 'No se pudo desactivar el equipo.'
      return false
    } finally {
      deleting.value = false
    }
  }

  return {
    addPlayer,
    authReady,
    categories,
    categoriesLoading,
    cleanupPreviews,
    deactivateTeam,
    deleting,
    errorMessage,
    fetchCategories,
    isAuthenticated,
    loadError,
    loadForEdit,
    loading,
    niceGender,
    onLogoChange,
    onPlayerPhotoChange,
    removePlayer,
    saveRoster,
    saveTeamDetails,
    saving,
    selectedCategory,
    serverSnapshot,
    successMessage,
    team,
    teamDisplayName,
    uploading,
    validPlayers,
  }
}
