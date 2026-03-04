<script setup lang="ts">
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  oldNumber?: number
  newNumber?: number
  content: string
}

interface DiffFile {
  oldPath: string
  newPath: string
  lines: DiffLine[]
  stats: {
    additions: number
    deletions: number
  }
}

const props = defineProps<{
  diff: string
  filename?: string
  showLineNumbers?: boolean
  highlightSyntax?: boolean
}>()

const expanded = ref(true)
const search = ref('')

const parseDiff = (diff: string): DiffFile[] => {
  const files: DiffFile[] = []
  let currentFile: DiffFile | null = null
  let oldLine = 0
  let newLine = 0
  
  diff.split('\n').forEach(line => {
    if (line.startsWith('diff --git')) {
      if (currentFile) files.push(currentFile)
      currentFile = {
        oldPath: '',
        newPath: '',
        lines: [],
        stats: { additions: 0, deletions: 0 }
      }
    } else if (line.startsWith('--- ')) {
      if (currentFile) currentFile.oldPath = line.slice(4)
    } else if (line.startsWith('+++ ')) {
      if (currentFile) currentFile.newPath = line.slice(4)
    } else if (line.startsWith('@@')) {
      const match = line.match(/@@ -(\d+).*\+(\d+)/)
      if (match) {
        oldLine = parseInt(match[1])
        newLine = parseInt(match[2])
      }
    } else if (currentFile && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
      const type = line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'unchanged'
      const content = line.slice(1)
      
      currentFile.lines.push({
        type,
        oldNumber: type !== 'added' ? oldLine++ : undefined,
        newNumber: type !== 'removed' ? newLine++ : undefined,
        content
      })
      
      if (type === 'added') currentFile.stats.additions++
      if (type === 'removed') currentFile.stats.deletions++
    }
  })
  
  if (currentFile) files.push(currentFile)
  return files
}

const files = computed(() => parseDiff(props.diff))
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white overflow-hidden font-mono text-sm">
    <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
      <div class="flex items-center gap-2">
        <span class="i-lucide-git-commit size-4" />
        <span class="font-medium">{{ filename || 'Changes' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-green-600">+{{ files.reduce((a, f) => a + f.stats.additions, 0) }}</span>
        <span class="text-red-600">-{{ files.reduce((a, f) => a + f.stats.deletions, 0) }}</span>
        <button class="rounded p-1 hover:bg-gray-200" @click="expanded = !expanded">
          <span :class="expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" class="size-4" />
        </button>
      </div>
    </div>
    
    <div v-if="expanded" class="overflow-x-auto">
      <table class="w-full">
        <tbody>
          <tr
            v-for="(line, i) in files[0]?.lines"
            :key="i"
            class="hover:bg-gray-50"
            :class="{
              'bg-green-50': line.type === 'added',
              'bg-red-50': line.type === 'removed'
            }"
          >
            <td v-if="showLineNumbers" class="w-12 select-none border-r border-gray-200 px-2 text-right text-gray-400">
              {{ line.oldNumber || '' }}
            </td>
            <td v-if="showLineNumbers" class="w-12 select-none border-r border-gray-200 px-2 text-right text-gray-400">
              {{ line.newNumber || '' }}
            </td>
            <td class="w-4 select-none px-2 text-center font-bold" :class="{
              'text-green-600': line.type === 'added',
              'text-red-600': line.type === 'removed'
            }">
              {{ line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ' }}
            </td>
            <td class="whitespace-pre px-2 py-0.5">{{ line.content }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
