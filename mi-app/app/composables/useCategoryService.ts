// composables/useCatalogService.ts
import { cleanParams } from '@/composables/http'
import { useRuntimeConfig } from '#imports'

export type Gender = 'VARONIL' | 'FEMENIL' | 'MIXTO' | string

export interface CategoryDto {
  id: number
  leagueId: number
  name: string
  code: string
  gender: Gender | null
}

export interface ApiTeam {
  teamId: number
  leagueId: number
  name: string
  shortName: string | null
  colorPrimary: string | null
  colorSecondary: string | null
  logoUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function useCatalogService() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // ====== CATEGORIES ======
  const getCategories = (filters: { leagueId?: number; gender?: Gender } = {}) => {
    return $fetch<CategoryDto[]>('/categories', {
      baseURL,
      params: cleanParams(filters)
    })
  }

  // ====== TEAMS ======
  const getTeams = (filters: { categoryCode?: string; gender?: Gender; leagueId?: number } = {}) => {
    // OJO: tu back acepta leagueId/categoryCode/gender
    return $fetch<ApiTeam[]>('/teams', {
      baseURL,
      params: cleanParams(filters)
    })
  }

  /**
   * Filtrar por categoryId (front) aunque el back filtre por categoryCode.
   * - Mapea categoryId -> (code, gender) usando el arreglo de categorías ya cargado.
   */
  const getTeamsByCategoryId = async (categoryId: number, categories: CategoryDto[]) => {
    if (!categoryId) return getTeams() // sin filtro
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return getTeams() // fallback

    return getTeams({
      categoryCode: cat.code,
      // si tu repo usa gender para afinar, mandamos el gender de la categoría
      gender: cat.gender ?? undefined
    })
  }

  return {
    getCategories,
    getTeams,
    getTeamsByCategoryId
  }
}
