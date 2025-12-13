// composables/useCategoryDivisionFilters.ts
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

interface CategoryDto {
  id: number
  code: string          // "+35", "U-16", etc.
  name: string          // Nombre bonito a mostrar
  gender?: 'VARONIL' | 'FEMENIL' | 'MIXTO' | null
}

const defaultCategoryOptions = [
  { label: '+35', value: '+35' },
  { label: 'U-8', value: 'U-8' },
  { label: 'U-10', value: 'U-10' },
  { label: 'U-12', value: 'U-12' },
  { label: 'U-14', value: 'U-14' },
  { label: 'U-16', value: 'U-16' },
]

export const useCategoryDivisionFilters = () => {
  // 1) Traer categorías del back (ajusta el endpoint a tu back)
  const {
    data: categories,
    pending: categoriesPending,
    error: categoriesError,
  } = useApi<CategoryDto[]>('/categories')

  // 2) Estado de filtros
  const selectedCategory = ref<'all' | string>('all')
  const selectedDivision = ref<'all' | 'VARONIL' | 'FEMENIL' | 'MIXTO'>('all')

  // 3) Opciones de categorías (del back o fallback)
  const categoryOptions = computed(() => {
    const raw = categories.value
    if (!Array.isArray(raw) || raw.length === 0) {
      // Fallback: las que ya usabas
      return defaultCategoryOptions
    }

    const map = new Map<string, string>()
    for (const c of raw) {
      if (!c.code) continue
      if (!map.has(c.code)) {
        map.set(c.code, c.name || c.code)
      }
    }

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }))
  })

  // 4) Opciones de rama (gender)
  const divisionOptions = [
    { label: 'Varonil', value: 'VARONIL' as const },
    { label: 'Femenil', value: 'FEMENIL' as const },
    { label: 'Mixto', value: 'MIXTO' as const },
  ]

  // 5) Params para el back (?categoryCode=...&gender=...)
  const apiParams = computed<Record<string, string>>(() => {
    const params: Record<string, string> = {}

    if (selectedCategory.value !== 'all') {
      params.categoryCode = selectedCategory.value
    }
    if (selectedDivision.value !== 'all') {
      params.gender = selectedDivision.value
    }

    return params
  })

  return {
    // data de categorías
    categories,
    categoriesPending,
    categoriesError,

    // opciones y selección
    categoryOptions,
    divisionOptions,
    selectedCategory,
    selectedDivision,

    // params listos para el endpoint
    apiParams,
  }
}
