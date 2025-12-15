// app/composables/useMyTeam.ts
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export interface MyTeamSummary {
  userId: number
  role: 'USER' | 'CAPTAIN' | 'ADMIN'
  maxTeamsAllowed: number
  currentTeams: number
  hasCaptainPrivileges: boolean
  canCreateTeam: boolean
  teams: any[]
}

const summary = ref<MyTeamSummary | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useMyTeam() {
  const nuxtApp = useNuxtApp()
  const { $kcGetToken } = nuxtApp as any

  const loadMyTeam = async () => {
    loading.value = true
    error.value = null

    try {
      const token: string = (await $kcGetToken?.()) ?? ''
      if (!token) {
        console.warn('No hay token, no se puede llamar /api/teams/mine')
        loading.value = false
        return
      }

      const data = await $fetch<MyTeamSummary>('https://tocho5-api.tochero5.mx/api/teams/mine', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      summary.value = data
    } catch (err: any) {
      console.error('Error cargando /api/teams/mine:', err)
      error.value = String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    summary,
    loading,
    error,
    loadMyTeam,
  }
}
