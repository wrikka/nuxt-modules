export interface DocsConfig {
  title: string
  description: string
  baseUrl: string
  github?: {
    repo: string
    branch: string
  }
  sidebar?: SidebarItem[]
  nav?: NavItem[]
}

export interface SidebarItem {
  title: string
  path?: string
  children?: SidebarItem[]
}

export interface NavItem {
  title: string
  path: string
  icon?: string
}
