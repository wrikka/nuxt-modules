export const getLabelIcon = (label: string) => {
  const icons: Record<string, string> = {
    Important: 'mdi:alert-circle',
    Security: 'mdi:shield-check',
    Promotions: 'mdi:tag',
    Finance: 'mdi:finance',
    Receipt: 'mdi:receipt',
    Updates: 'mdi:update',
    Dev: 'mdi:code-tags',
    GitHub: 'mdi:github',
    Vercel: 'mdi:triangle-outline',
    Work: 'mdi:briefcase',
    Bugs: 'mdi:bug',
    Design: 'mdi:pencil',
  }
  return icons[label] || 'mdi:tag'
}

export const getLabelClasses = (label: string) => {
    const colors: Record<string, string> = {
      Important: 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-50 dark:text-red-300',
      Security: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-50 dark:text-yellow-300',
      Promotions: 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-300',
      Finance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-50 dark:text-blue-300',
      Receipt: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:bg-opacity-50 dark:text-indigo-300',
      Updates: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-50 dark:text-purple-300',
      Dev: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:bg-opacity-50 dark:text-pink-300',
      GitHub: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      Vercel: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      Work: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:bg-opacity-50 dark:text-orange-300',
      Bugs: 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-50 dark:text-red-300',
      Design: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-50 dark:text-purple-300',
    }
    return colors[label] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
