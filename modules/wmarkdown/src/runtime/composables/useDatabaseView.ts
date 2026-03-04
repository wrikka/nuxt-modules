import { ref, computed } from 'vue'

type ViewType = 'table' | 'list' | 'kanban' | 'gallery' | 'calendar'

interface DatabaseRecord {
  id: string
  [key: string]: unknown
}

interface DatabaseColumn {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'relation'
  options?: string[]
  width?: number
  sortable?: boolean
  filterable?: boolean
}

interface DatabaseView {
  id: string
  name: string
  type: ViewType
  columns: string[]
  filters: Array<{ column: string; operator: string; value: unknown }>
  sorts: Array<{ column: string; direction: 'asc' | 'desc' }>
  groupBy?: string
}

interface DatabaseOptions {
  views?: DatabaseView[]
  columns?: DatabaseColumn[]
}

export function useDatabaseView(records: DatabaseRecord[], options: DatabaseOptions = {}) {
  const columns = ref<DatabaseColumn[]>(options.columns || [])
  const views = ref<DatabaseView[]>(options.views || [])
  const currentViewId = ref<string | null>(null)
  const searchQuery = ref('')

  const currentView = computed(() => {
    return views.value.find(v => v.id === currentViewId.value) || views.value[0] || null
  })

  const filteredRecords = computed(() => {
    let result = [...records]
    const view = currentView.value

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(record =>
        Object.values(record).some(val =>
          String(val).toLowerCase().includes(query)
        )
      )
    }

    // Apply filters
    if (view?.filters?.length) {
      view.filters.forEach(filter => {
        result = result.filter(record => {
          const value = record[filter.column]
          switch (filter.operator) {
            case 'equals':
              return value === filter.value
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())
            case 'greater':
              return Number(value) > Number(filter.value)
            case 'less':
              return Number(value) < Number(filter.value)
            case 'empty':
              return !value || String(value).trim() === ''
            case 'notEmpty':
              return !!value && String(value).trim() !== ''
            default:
              return true
          }
        })
      })
    }

    // Apply sorts
    if (view?.sorts?.length) {
      view.sorts.forEach(sort => {
        result.sort((a, b) => {
          const aVal = a[sort.column]
          const bVal = b[sort.column]
          const direction = sort.direction === 'asc' ? 1 : -1

          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * direction
          }

          return String(aVal).localeCompare(String(bVal)) * direction
        })
      })
    }

    return result
  })

  const groupedRecords = computed(() => {
    const view = currentView.value
    if (!view?.groupBy) {
      return { '': filteredRecords.value }
    }

    const groups: Record<string, DatabaseRecord[]> = {}

    filteredRecords.value.forEach(record => {
      const groupValue = String(record[view.groupBy!] || 'Ungrouped')
      if (!groups[groupValue]) {
        groups[groupValue] = []
      }
      groups[groupValue].push(record)
    })

    return groups
  })

  const kanbanColumns = computed(() => {
    const view = currentView.value
    if (!view?.groupBy || view.type !== 'kanban') return []

    const columnKey = view.groupBy
    const uniqueValues = [...new Set(records.map(r => String(r[columnKey] || 'Ungrouped')))]

    return uniqueValues.map(value => ({
      id: value,
      title: value,
      records: filteredRecords.value.filter(r => String(r[columnKey]) === value)
    }))
  })

  const addView = (name: string, type: ViewType): DatabaseView => {
    const view: DatabaseView = {
      id: generateId(),
      name,
      type,
      columns: columns.value.map(c => c.key),
      filters: [],
      sorts: []
    }
    views.value.push(view)
    return view
  }

  const removeView = (viewId: string): boolean => {
    const index = views.value.findIndex(v => v.id === viewId)
    if (index === -1) return false

    views.value.splice(index, 1)
    if (currentViewId.value === viewId) {
      currentViewId.value = views.value[0]?.id || null
    }
    return true
  }

  const addFilter = (column: string, operator: string, value: unknown): boolean => {
    const view = currentView.value
    if (!view) return false

    view.filters.push({ column, operator, value })
    return true
  }

  const removeFilter = (index: number): boolean => {
    const view = currentView.value
    if (!view || index < 0 || index >= view.filters.length) return false

    view.filters.splice(index, 1)
    return true
  }

  const addSort = (column: string, direction: 'asc' | 'desc'): boolean => {
    const view = currentView.value
    if (!view) return false

    view.sorts.push({ column, direction })
    return true
  }

  const removeSort = (index: number): boolean => {
    const view = currentView.value
    if (!view || index < 0 || index >= view.sorts.length) return false

    view.sorts.splice(index, 1)
    return true
  }

  const setGroupBy = (column: string | undefined): boolean => {
    const view = currentView.value
    if (!view) return false

    view.groupBy = column
    return true
  }

  const switchView = (viewId: string) => {
    if (views.value.some(v => v.id === viewId)) {
      currentViewId.value = viewId
      return true
    }
    return false
  }

  return {
    columns,
    views,
    currentView,
    currentViewId,
    searchQuery,
    filteredRecords,
    groupedRecords,
    kanbanColumns,
    addView,
    removeView,
    addFilter,
    removeFilter,
    addSort,
    removeSort,
    setGroupBy,
    switchView
  }
}

function generateId(): string {
  return 'db-' + Math.random().toString(36).substr(2, 9)
}
