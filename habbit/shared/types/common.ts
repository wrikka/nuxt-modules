export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P]
}

export type Id = string
export type Timestamp = number
export type DateString = string

export interface Entity {
  id: Id
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectGroup {
  label: string
  options: SelectOption[]
}

export type SortOrder = 'asc' | 'desc'
export type SortField = string

export interface SortConfig {
  field: SortField
  order: SortOrder
}

export interface FilterConfig {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith'
  value: unknown
}
