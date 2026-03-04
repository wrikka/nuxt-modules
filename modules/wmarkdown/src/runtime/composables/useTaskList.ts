import { ref } from 'vue'

interface TaskItem {
  id: string
  text: string
  checked: boolean
  level: number
}

export function useTaskList() {
  const tasks = ref<TaskItem[]>([])

  const parseTaskList = (markdown: string): { content: string; tasks: TaskItem[] } => {
    const taskRegex = /^(\s*)- \[([ x])\] (.+)$/gm
    const tasks: TaskItem[] = []
    let match

    let content = markdown.replace(taskRegex, (match, indent, checked, text) => {
      const id = generateId()
      const level = Math.floor(indent.length / 2)

      tasks.push({
        id,
        text: text.trim(),
        checked: checked === 'x',
        level
      })

      return `<div class="task-list-item" data-task-id="${id}" data-checked="${checked === 'x'}">
  <input type="checkbox" ${checked === 'x' ? 'checked' : ''} class="task-checkbox" />
  <span class="task-text">${text.trim()}</span>
</div>`
    })

    // Wrap consecutive task items in a task list container
    content = content.replace(
      /(<div class="task-list-item"[^>]*>[\s\S]*?<\/div>\n?)+/g,
      '<div class="task-list">$&</div>'
    )

    return { content, tasks }
  }

  const getTaskMarkdown = (text: string, checked = false): string => {
    return `- [${checked ? 'x' : ' '}] ${text}`
  }

  const toggleTask = (id: string) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.checked = !task.checked
    }
  }

  const addTask = (text: string, checked = false, level = 0): string => {
    const id = generateId()
    const indent = '  '.repeat(level)

    tasks.value.push({ id, text, checked, level })

    return `${indent}- [${checked ? 'x' : ' '}] ${text}`
  }

  const getCheckedCount = computed(() => {
    return tasks.value.filter(t => t.checked).length
  })

  const getTotalCount = computed(() => {
    return tasks.value.length
  })

  const getProgress = computed(() => {
    if (tasks.value.length === 0) return 0
    return Math.round((tasks.value.filter(t => t.checked).length / tasks.value.length) * 100)
  })

  const reset = () => {
    tasks.value = []
  }

  return {
    tasks,
    parseTaskList,
    getTaskMarkdown,
    toggleTask,
    addTask,
    getCheckedCount,
    getTotalCount,
    getProgress,
    reset
  }
}

import { computed } from 'vue'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
