export interface UploadTask {
  id: string
  file: File
  priority: number
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error'
  progress: number
  error?: Error
  result?: any
  abortController?: AbortController
  startTime?: number
  endTime?: number
}

export interface QueueOptions {
  maxConcurrent?: number
  autoStart?: boolean
  onTaskStart?: (task: UploadTask) => void
  onTaskProgress?: (task: UploadTask, progress: number) => void
  onTaskComplete?: (task: UploadTask, result: any) => void
  onTaskError?: (task: UploadTask, error: Error) => void
  onQueueComplete?: () => void
}

export class UploadQueueManager {
  private tasks: UploadTask[] = []
  private running = false
  private options: QueueOptions
  private activeUploads = 0

  constructor(options: QueueOptions = {}) {
    this.options = {
      maxConcurrent: 3,
      autoStart: true,
      ...options
    }
  }

  addTask(file: File, priority = 0): UploadTask {
    const task: UploadTask = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      priority,
      status: 'pending',
      progress: 0
    }

    this.tasks.push(task)
    this.sortTasks()

    if (this.options.autoStart && !this.running) {
      this.processQueue()
    }

    return task
  }

  addTasks(files: File[], priority = 0): UploadTask[] {
    return files.map(file => this.addTask(file, priority))
  }

  private sortTasks(): void {
    this.tasks.sort((a, b) => {
      // Sort by status (pending first), then by priority (higher first), then by add time
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (b.status === 'pending' && a.status !== 'pending') return 1
      if (a.status === 'paused' && b.status === 'uploading') return -1
      return b.priority - a.priority || parseInt(a.id.split('_')[0]) - parseInt(b.id.split('_')[0])
    })
  }

  async processQueue(): Promise<void> {
    if (this.running) return
    this.running = true

    while (this.hasPendingTasks() && this.activeUploads < (this.options.maxConcurrent || 3)) {
      const task = this.getNextPendingTask()
      if (task) {
        this.processTask(task)
      }
    }

    this.running = false

    if (!this.hasActiveTasks() && this.options.onQueueComplete) {
      this.options.onQueueComplete()
    }
  }

  private getNextPendingTask(): UploadTask | undefined {
    return this.tasks.find(t => t.status === 'pending')
  }

  private hasPendingTasks(): boolean {
    return this.tasks.some(t => t.status === 'pending')
  }

  private hasActiveTasks(): boolean {
    return this.tasks.some(t => t.status === 'uploading')
  }

  private async processTask(task: UploadTask): Promise<void> {
    task.status = 'uploading'
    task.startTime = Date.now()
    task.abortController = new AbortController()
    this.activeUploads++

    this.options.onTaskStart?.(task)

    try {
      // This would be replaced with actual upload logic
      // For now, it's a placeholder that resolves after a simulated upload
      const result = await this.executeUpload(task)
      task.status = 'completed'
      task.progress = 100
      task.endTime = Date.now()
      task.result = result
      this.options.onTaskComplete?.(task, result)
    } catch (error) {
      task.status = 'error'
      task.error = error as Error
      task.endTime = Date.now()
      this.options.onTaskError?.(task, error as Error)
    } finally {
      this.activeUploads--
      // Process next tasks
      if (this.hasPendingTasks()) {
        this.processQueue()
      } else if (!this.hasActiveTasks() && this.options.onQueueComplete) {
        this.options.onQueueComplete()
      }
    }
  }

  private async executeUpload(task: UploadTask): Promise<any> {
    // Placeholder - actual implementation would use upload function
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (task.abortController?.signal.aborted) {
          clearInterval(interval)
          reject(new Error('Upload aborted'))
          return
        }

        task.progress = Math.min(task.progress + 10, 100)
        this.options.onTaskProgress?.(task, task.progress)

        if (task.progress >= 100) {
          clearInterval(interval)
          resolve({ success: true, fileId: task.id })
        }
      }, 200)
    })
  }

  pauseTask(taskId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId)
    if (task && task.status === 'uploading') {
      task.status = 'paused'
      task.abortController?.abort()
      this.activeUploads--
      this.processQueue()
      return true
    }
    return false
  }

  resumeTask(taskId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId)
    if (task && task.status === 'paused') {
      task.status = 'pending'
      task.progress = 0
      this.sortTasks()
      this.processQueue()
      return true
    }
    return false
  }

  pauseAll(): void {
    this.tasks.filter(t => t.status === 'uploading').forEach(t => {
      t.status = 'paused'
      t.abortController?.abort()
    })
    this.activeUploads = 0
  }

  resumeAll(): void {
    this.tasks.filter(t => t.status === 'paused').forEach(t => {
      t.status = 'pending'
      t.progress = 0
    })
    this.sortTasks()
    this.processQueue()
  }

  cancelTask(taskId: string): boolean {
    const index = this.tasks.findIndex(t => t.id === taskId)
    if (index >= 0) {
      const task = this.tasks[index]
      if (task.status === 'uploading') {
        task.abortController?.abort()
        this.activeUploads--
      }
      this.tasks.splice(index, 1)
      this.processQueue()
      return true
    }
    return false
  }

  cancelAll(): void {
    this.tasks.filter(t => t.status === 'uploading').forEach(t => {
      t.abortController?.abort()
    })
    this.tasks = []
    this.activeUploads = 0
    this.running = false
  }

  removeCompleted(): void {
    this.tasks = this.tasks.filter(t => t.status !== 'completed')
  }

  getTasks(): UploadTask[] {
    return [...this.tasks]
  }

  getStats() {
    const total = this.tasks.length
    const pending = this.tasks.filter(t => t.status === 'pending').length
    const uploading = this.tasks.filter(t => t.status === 'uploading').length
    const paused = this.tasks.filter(t => t.status === 'paused').length
    const completed = this.tasks.filter(t => t.status === 'completed').length
    const errors = this.tasks.filter(t => t.status === 'error').length

    return {
      total,
      pending,
      uploading,
      paused,
      completed,
      errors,
      progress: total > 0 ? (completed / total) * 100 : 0
    }
  }

  clear(): void {
    this.cancelAll()
  }
}

export function createUploadQueue(options: QueueOptions = {}): UploadQueueManager {
  return new UploadQueueManager(options)
}
