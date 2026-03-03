export function createHighlightedText(text: MaybeRef<string>, query: MaybeRef<string>) {
  return computed(() => {
    const unrefText = unref(text)
    const unrefQuery = unref(query)
    if (!unrefQuery) return unrefText

    // Escape special characters in query for RegExp
    const escapedQuery = unrefQuery.replace(/[.*+?^${}()|[\\]]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')

    return unrefText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 rounded-md px-1">$1</mark>')
  })
}
