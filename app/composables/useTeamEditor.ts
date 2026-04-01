import { computed, ref, unref, type Ref } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'
import { useAuthz } from '@/composables/useAuthz'

interface TeamDetail {
  teamId?: number
  id?: number
  name: string
  shortName: string | null
  logoUrl: string | null
  leagueId?: number
  colorPrimary?: string | null
  colorSecondary?: string | null
  seasonId?: number
  categoryId?: number
  league?: { name?: string | null } | null
  season?: { name?: string | null } | null
  category?: { name?: string | null; code?: string | null } | null
  leagueName?: string | null
  seasonName?: string | null
  categoryName?: string | null
}

interface PlayerApi {
  playerId: number
  fullName: string
  curp: string
  jerseyNumber: number | null
  photoUrl: string | null
}

export interface PlayerForm {
  localId: number
  playerId?: number
  fullName: string
  curp: string
  jerseyNumber: number | null
  photoFile: File | null
  photoPreview: string | null
  markedForDeletion: boolean
  isNew: boolean
}

interface TeamPhotoApi {
  id: number
  photoUrl: string
  sortOrder: number
}

interface TeamDetailResponse {
  team: TeamDetail
  players: PlayerApi[]
  gallery: TeamPhotoApi[]
}

export interface PhotoForm {
  localId: number
  photoId?: number
  sortOrder: number | null
  currentUrl: string | null
  newFile: File | null
  newPreview: string | null
  markedForDeletion: boolean
  isNew: boolean
}

interface ApiErrorPayload {
  status?: number
  message?: string
}

interface ApiErrorResponse {
  status?: number
  _data?: ApiErrorPayload
}

interface ApiErrorLike {
  statusCode?: number
  message?: string
  data?: ApiErrorPayload
  response?: ApiErrorResponse
}

interface NuxtAppAuthHelpers {
  $kc?: {
    login: (options: { redirectUri: string }) => void
  }
  $kcGetToken?: () => Promise<string | undefined>
}

function revokePreview(url?: string | null) {
  if (!url || !url.startsWith('blob:')) return

  try {
    URL.revokeObjectURL(url)
  } catch {
    // No necesitamos interrumpir el flujo por una previsualización.
  }
}

function cssColorToHex(input: string, fallback = '#1D4ED8'): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback

  const el = document.createElement('div')
  el.style.color = input
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)

  const rgb = getComputedStyle(el).color
  document.body.removeChild(el)

  const parts = rgb.match(/\d+/g)
  if (!parts || parts.length < 3) return fallback

  const r = Number.parseInt(parts[0] || '0', 10)
  const g = Number.parseInt(parts[1] || '0', 10)
  const b = Number.parseInt(parts[2] || '0', 10)

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return fallback

  return (
    '#' +
    [r, g, b]
      .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
      .join('')
  )
}

function normalizeColorForPicker(raw?: string | null, fallback = '#1D4ED8') {
  const value = String(raw || '').trim()
  if (!value) return fallback

  if (/^#([0-9a-fA-F]{6})$/.test(value)) return value

  const shortHex = /^#([0-9a-fA-F]{3})$/.exec(value)
  if (shortHex && shortHex[1]) {
    const hex = shortHex[1]
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  return cssColorToHex(value, fallback)
}

function normalizeUrl(url?: string | null): string | null {
  const value = String(url || '').trim()
  if (!value || value === 'NULL') return null
  return value
}

export function useTeamEditor(teamId: number | Ref<number>) {
  const authz = useAuthz()
  const rawIsAuthenticated = (authz as { isAuthenticated?: boolean | Ref<boolean> }).isAuthenticated

  const isAuthenticated = computed<boolean>(() => {
    const value = rawIsAuthenticated
    if (typeof value === 'boolean') return value
    if (value && typeof value === 'object' && 'value' in value) return !!value.value
    return false
  })

  const nuxtApp = useNuxtApp() as NuxtAppAuthHelpers
  const config = useRuntimeConfig()

  const currentTeamId = computed(() => Number(unref(teamId)) || 0)
  const apiBase = '/api/t5'

  const loading = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const loadError = ref<string | null>(null)
  const successMessage = ref('')
  const errorMessage = ref('')

  const teamName = ref('')
  const teamShortName = ref('')
  const logoFile = ref<File | null>(null)
  const logoPreview = ref<string | null>(null)
  const colorPrimary = ref('#1D4ED8')
  const colorSecondary = ref('#FFFFFF')

  const leagueName = ref('Liga Tochero5')
  const seasonName = ref('Temporada actual')
  const categoryName = ref('Categoría por definir')

  const players = ref<PlayerForm[]>([])
  const photos = ref<PhotoForm[]>([])

  const deletePhrase = 'ELIMINAR'
  const deleteConfirmText = ref('')
  const maxCarouselPhotos = 5

  const activePhotosCount = computed(() => photos.value.filter((photo) => !photo.markedForDeletion).length)
  const deleteTypedOk = computed(() => deleteConfirmText.value.trim().toUpperCase() === deletePhrase)
  const teamDisplayName = computed(() => teamName.value.trim() || 'Equipo')

  const toApiError = (err: unknown): ApiErrorLike => (typeof err === 'object' && err ? (err as ApiErrorLike) : {})

  const getAuthToken = async (): Promise<string | null> => {
    const tokenFn = nuxtApp.$kcGetToken
    const token = tokenFn ? ((await tokenFn()) ?? '') : ''
    return token || null
  }

  const getStatusCode = (err: unknown): number | undefined => {
    const apiError = toApiError(err)
    return apiError.statusCode ?? apiError.response?.status ?? apiError.response?._data?.status
  }

  function resetMessages() {
    successMessage.value = ''
    errorMessage.value = ''
  }

  async function loadTeam() {
    loadError.value = null

    try {
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) headers.Authorization = `Bearer ${token}`

      const data = await $fetch<TeamDetailResponse>(`/teams/${currentTeamId.value}/detail`, {
        baseURL: apiBase,
        headers,
      })

      const team = data.team

      teamName.value = team.name || ''
      teamShortName.value = team.shortName ?? ''

      if (!logoFile.value) {
        revokePreview(logoPreview.value)
        logoPreview.value = normalizeUrl(team.logoUrl)
      }

      colorPrimary.value = normalizeColorForPicker(team.colorPrimary, '#1D4ED8')
      colorSecondary.value = normalizeColorForPicker(team.colorSecondary, '#FFFFFF')
      leagueName.value = String(team.league?.name ?? team.leagueName ?? leagueName.value).trim() || 'Liga Tochero5'
      seasonName.value = String(team.season?.name ?? team.seasonName ?? seasonName.value).trim() || 'Temporada actual'
      categoryName.value =
        String(team.category?.name ?? team.category?.code ?? team.categoryName ?? categoryName.value).trim() ||
        'Categoría por definir'
    } catch (err) {
      console.error('Error cargando equipo', err)
      loadError.value = 'No se pudo cargar la información del equipo.'
    }
  }

  async function loadPlayers() {
    try {
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) headers.Authorization = `Bearer ${token}`

      const data = await $fetch<TeamDetailResponse>(`/teams/${currentTeamId.value}/detail`, {
        baseURL: apiBase,
        headers,
      })

      for (const player of players.value) {
        revokePreview(player.photoPreview)
      }

      players.value = (data.players ?? []).map((player, index) => ({
        localId: index + 1,
        playerId: player.playerId,
        fullName: player.fullName,
        curp: player.curp,
        jerseyNumber: player.jerseyNumber ?? null,
        photoFile: null,
        photoPreview: normalizeUrl(player.photoUrl),
        markedForDeletion: false,
        isNew: false,
      }))
    } catch (err) {
      console.error('Error cargando jugadores', err)
      players.value = []
    }
  }

  async function loadPhotos() {
    try {
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) headers.Authorization = `Bearer ${token}`

      const data = await $fetch<TeamDetailResponse>(`/teams/${currentTeamId.value}/detail`, {
        baseURL: apiBase,
        headers,
      })

      for (const photo of photos.value) {
        revokePreview(photo.newPreview)
      }

      photos.value = (data.gallery ?? []).map((photo, index) => ({
        localId: index + 1,
        photoId: photo.id,
        sortOrder: photo.sortOrder ?? index,
        currentUrl: normalizeUrl(photo.photoUrl),
        newFile: null,
        newPreview: null,
        markedForDeletion: false,
        isNew: false,
      }))
    } catch (err) {
      console.error('Error cargando fotos del carrusel', err)
      photos.value = []
    }
  }

  async function withLoading(task: () => Promise<void>) {
    loading.value = true
    await task()
    loading.value = false
  }

  async function loadForHub() {
    await withLoading(async () => {
      await loadTeam()
    })
  }

  async function loadForTeamEdit() {
    await withLoading(async () => {
      await Promise.all([loadTeam(), loadPhotos()])
    })
  }

  async function loadForRosterEdit() {
    await withLoading(async () => {
      await Promise.all([loadTeam(), loadPlayers()])
    })
  }

  function onLoginClick() {
    const kc = nuxtApp.$kc
    if (typeof window === 'undefined' || !kc) return
    kc.login({ redirectUri: window.location.href })
  }

  function onLogoChange(event: Event) {
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0] ?? null

    if (!file) return

    revokePreview(logoPreview.value)
    logoFile.value = file
    logoPreview.value = URL.createObjectURL(file)
  }

  function onPlayerPhotoChange(index: number, event: Event) {
    const player = players.value[index]
    if (!player) return

    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0] ?? null
    if (!file) return

    revokePreview(player.photoPreview)
    player.photoFile = file
    player.photoPreview = URL.createObjectURL(file)
  }

  function addPlayer() {
    const last = players.value[players.value.length - 1]
    const nextLocalId = last ? last.localId + 1 : 1

    players.value.push({
      localId: nextLocalId,
      fullName: '',
      curp: '',
      jerseyNumber: null,
      photoFile: null,
      photoPreview: null,
      markedForDeletion: false,
      isNew: true,
    })
  }

  function toggleRemovePlayer(index: number) {
    const player = players.value[index]
    if (!player) return
    player.markedForDeletion = !player.markedForDeletion
  }

  function removeNewPlayerCard(index: number) {
    const player = players.value[index]
    if (!player) return

    if (player.isNew && !player.playerId) {
      revokePreview(player.photoPreview)
      players.value.splice(index, 1)
      return
    }

    player.markedForDeletion = true
  }

  function addPhotoSlot() {
    if (activePhotosCount.value >= maxCarouselPhotos) {
      errorMessage.value = 'Solo puedes tener hasta 5 fotos activas en el carrusel.'
      return
    }

    const last = photos.value[photos.value.length - 1]
    const nextLocalId = last ? last.localId + 1 : 1
    const currentMaxSort = photos.value.reduce((max, photo) => {
      const value = photo.sortOrder ?? -1
      return value > max ? value : max
    }, -1)

    photos.value.push({
      localId: nextLocalId,
      photoId: undefined,
      sortOrder: currentMaxSort + 1,
      currentUrl: null,
      newFile: null,
      newPreview: null,
      markedForDeletion: false,
      isNew: true,
    })
  }

  function onCarouselPhotoChange(index: number, event: Event) {
    const photo = photos.value[index]
    if (!photo) return

    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0] ?? null
    if (!file) return

    revokePreview(photo.newPreview)
    photo.newFile = file
    photo.newPreview = URL.createObjectURL(file)
  }

  function toggleRemovePhoto(index: number) {
    const photo = photos.value[index]
    if (!photo) return
    photo.markedForDeletion = !photo.markedForDeletion
  }

  function removeNewPhotoSlot(index: number) {
    const photo = photos.value[index]
    if (!photo) return

    if (photo.isNew && !photo.photoId) {
      revokePreview(photo.newPreview)
      photos.value.splice(index, 1)
      return
    }

    photo.markedForDeletion = true
  }

  async function saveTeamDetails() {
    resetMessages()

    if (!teamName.value.trim()) {
      errorMessage.value = 'El nombre del equipo no puede estar vacío.'
      return false
    }

    try {
      saving.value = true
      const token = await getAuthToken()

      if (!token) {
        errorMessage.value = 'No se encontró token de sesión. Vuelve a iniciar sesión.'
        return false
      }

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      }

      await $fetch(`/teams/${currentTeamId.value}`, {
        baseURL: apiBase,
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: {
          name: teamName.value.trim(),
          shortName: teamShortName.value.trim() || null,
          colorPrimary: colorPrimary.value,
          colorSecondary: colorSecondary.value,
        },
      })

      if (logoFile.value) {
        const formLogo = new FormData()
        formLogo.append('logo', logoFile.value)

        await $fetch(`/teams/${currentTeamId.value}/logo`, {
          baseURL: apiBase,
          method: 'POST',
          body: formLogo,
          headers: authHeaders,
        })
      }

      for (const photo of photos.value) {
        if (!photo.photoId || !photo.markedForDeletion) continue

        try {
          await $fetch(`/teams/${currentTeamId.value}/photos/${photo.photoId}`, {
            baseURL: apiBase,
            method: 'DELETE',
            headers: authHeaders,
          })
        } catch (err) {
          console.error('Error eliminando foto de carrusel', err)
        }
      }

      for (const photo of photos.value) {
        if (!photo.photoId || photo.markedForDeletion || !photo.newFile) continue

        const formPhoto = new FormData()
        formPhoto.append('photo', photo.newFile)

        if (photo.sortOrder !== null && photo.sortOrder !== undefined) {
          formPhoto.append('positionIndex', String(photo.sortOrder))
        }

        try {
          await $fetch(`/teams/${currentTeamId.value}/photos/${photo.photoId}`, {
            baseURL: apiBase,
            method: 'PUT',
            body: formPhoto,
            headers: authHeaders,
          })
        } catch (err) {
          if (getStatusCode(err) === 413) {
            errorMessage.value = 'Una foto del carrusel pesa demasiado. Usa archivos más ligeros.'
          } else {
            console.error('Error actualizando foto de carrusel', err)
          }
        }
      }

      let remainingSlots = maxCarouselPhotos - photos.value.filter((photo) => photo.photoId && !photo.markedForDeletion).length
      if (remainingSlots < 0) remainingSlots = 0

      for (const photo of photos.value) {
        if (!photo.isNew || photo.markedForDeletion || !photo.newFile) continue

        if (remainingSlots <= 0) {
          errorMessage.value = 'Solo se permiten 5 fotos en el carrusel. Algunas nuevas no se agregaron.'
          break
        }

        const formPhoto = new FormData()
        formPhoto.append('photo', photo.newFile)

        if (photo.sortOrder !== null && photo.sortOrder !== undefined) {
          formPhoto.append('positionIndex', String(photo.sortOrder))
        }

        try {
          await $fetch(`/teams/${currentTeamId.value}/photos`, {
            baseURL: apiBase,
            method: 'POST',
            body: formPhoto,
            headers: authHeaders,
          })
          remainingSlots -= 1
        } catch (err) {
          if (getStatusCode(err) === 413) {
            errorMessage.value = 'Una foto nueva del carrusel pesa demasiado. Usa archivos más ligeros.'
          } else {
            console.error('Error creando foto de carrusel', err)
          }
        }
      }

      logoFile.value = null
      await loadForTeamEdit()
      successMessage.value = 'Los cambios del equipo se guardaron correctamente.'
      return true
    } catch (err) {
      console.error('Error guardando cambios del equipo', err)
      const status = getStatusCode(err)
      const apiError = toApiError(err)
      const rawMessage = apiError.data?.message ?? apiError.response?._data?.message ?? apiError.message

      if (rawMessage && rawMessage.includes('uq_team_league_name')) {
        errorMessage.value = 'Ya existe un equipo con ese nombre en esta liga. Elige otro nombre.'
      } else if (status === 413) {
        errorMessage.value = 'Algún archivo supera el tamaño máximo permitido. Usa archivos más ligeros.'
      } else {
        errorMessage.value = 'No se pudieron guardar los cambios del equipo. Intenta de nuevo.'
      }

      return false
    } finally {
      saving.value = false
    }
  }

  async function saveRoster() {
    resetMessages()

    const invalidExistingPlayer = players.value.find(
      (player) => !player.markedForDeletion && !player.isNew && (!player.fullName.trim() || !player.curp.trim())
    )

    if (invalidExistingPlayer) {
      errorMessage.value = 'Todos los jugadores activos deben tener nombre completo y CURP.'
      return false
    }

    try {
      saving.value = true
      const token = await getAuthToken()

      if (!token) {
        errorMessage.value = 'No se encontró token de sesión. Vuelve a iniciar sesión.'
        return false
      }

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      }

      for (const player of players.value) {
        if (!player.playerId || !player.markedForDeletion) continue

        try {
          await $fetch(`/teams/${currentTeamId.value}/players/${player.playerId}`, {
            baseURL: apiBase,
            method: 'DELETE',
            headers: authHeaders,
          })
        } catch (err) {
          console.error('Error eliminando jugador', err)
        }
      }

      for (const player of players.value) {
        if (!player.isNew || player.markedForDeletion) continue
        if (!player.fullName.trim() || !player.curp.trim()) continue

        const form = new FormData()
        form.append('fullName', player.fullName.trim())
        form.append('curp', player.curp.trim())

        if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) {
          form.append('jerseyNumber', String(player.jerseyNumber))
        }

        if (player.photoFile) form.append('photo', player.photoFile)

        try {
          await $fetch(`/teams/${currentTeamId.value}/players`, {
            baseURL: apiBase,
            method: 'POST',
            body: form,
            headers: authHeaders,
          })
        } catch (err) {
          if (getStatusCode(err) === 413) {
            errorMessage.value = 'Una foto nueva de jugador pesa demasiado. Usa archivos más ligeros.'
          } else {
            console.error('Error creando jugador', err)
          }
        }
      }

      for (const player of players.value) {
        if (!player.playerId || player.markedForDeletion) continue

        const form = new FormData()
        form.append('fullName', player.fullName.trim())
        form.append('curp', player.curp.trim())

        if (player.jerseyNumber !== null && player.jerseyNumber !== undefined) {
          form.append('jerseyNumber', String(player.jerseyNumber))
        }

        if (player.photoFile) form.append('photo', player.photoFile)

        try {
          await $fetch(`/teams/${currentTeamId.value}/players/${player.playerId}`, {
            baseURL: apiBase,
            method: 'PUT',
            body: form,
            headers: authHeaders,
          })
        } catch (err) {
          if (getStatusCode(err) === 413) {
            errorMessage.value = 'Una foto actualizada de jugador pesa demasiado. Usa archivos más ligeros.'
          } else {
            console.error('Error actualizando jugador', err)
          }
        }
      }

      await loadForRosterEdit()
      successMessage.value = 'El roster se guardó correctamente.'
      return true
    } catch (err) {
      console.error('Error guardando roster', err)
      const status = getStatusCode(err)

      if (status === 413) {
        errorMessage.value = 'Alguna foto de jugador supera el tamaño máximo permitido.'
      } else {
        errorMessage.value = 'No se pudo guardar el roster. Intenta de nuevo.'
      }

      return false
    } finally {
      saving.value = false
    }
  }

  async function deactivateTeam() {
    resetMessages()

    if (!deleteTypedOk.value) {
      errorMessage.value = `Para continuar, escribe exactamente "${deletePhrase}".`
      return false
    }

    try {
      deleting.value = true
      const token = await getAuthToken()

      if (!token) {
        errorMessage.value = 'No se encontró token de sesión. Vuelve a iniciar sesión.'
        return false
      }

      await $fetch(`/teams/${currentTeamId.value}/active`, {
        baseURL: apiBase,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { isActive: false },
      })

      successMessage.value = 'Equipo eliminado correctamente.'
      deleteConfirmText.value = ''
      return true
    } catch (err) {
      console.error('Error desactivando equipo', err)
      const status = getStatusCode(err)
      const apiError = toApiError(err)
      const rawMessage = apiError.data?.message ?? apiError.response?._data?.message ?? apiError.message

      if (status === 401) {
        errorMessage.value = 'Tu sesión expiró. Vuelve a iniciar sesión.'
      } else if (status === 403) {
        errorMessage.value = 'No tienes permisos para desactivar este equipo.'
      } else {
        errorMessage.value = rawMessage || 'No se pudo desactivar el equipo. Intenta más tarde.'
      }

      return false
    } finally {
      deleting.value = false
    }
  }

  function cleanupPreviews() {
    revokePreview(logoPreview.value)

    for (const player of players.value) {
      revokePreview(player.photoPreview)
    }

    for (const photo of photos.value) {
      revokePreview(photo.newPreview)
    }
  }

  return {
    activePhotosCount,
    addPhotoSlot,
    addPlayer,
    categoryName,
    cleanupPreviews,
    colorPrimary,
    colorSecondary,
    currentTeamId,
    deactivateTeam,
    deleteConfirmText,
    deletePhrase,
    deleteTypedOk,
    deleting,
    errorMessage,
    isAuthenticated,
    leagueName,
    loadError,
    loadForHub,
    loadForRosterEdit,
    loadForTeamEdit,
    loadPhotos,
    loadPlayers,
    loadTeam,
    loading,
    logoPreview,
    onCarouselPhotoChange,
    onLoginClick,
    onLogoChange,
    onPlayerPhotoChange,
    photos,
    players,
    removeNewPhotoSlot,
    removeNewPlayerCard,
    resetMessages,
    saveRoster,
    saveTeamDetails,
    saving,
    seasonName,
    successMessage,
    teamDisplayName,
    teamName,
    teamShortName,
    toggleRemovePhoto,
    toggleRemovePlayer,
  }
}
