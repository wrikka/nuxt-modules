import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface ImportJob {
  id: string
  fileName: string
  status: "pending" | "processing" | "completed" | "failed"
  totalRows: number
  processedRows: number
  successRows: number
  failedRows: number
  errors: Array<{ row: number; message: string }>
  createdAt: Date
  completedAt?: Date
}

export interface ExportJob {
  id: string
  fileName: string
  format: "csv" | "json" | "xlsx"
  status: "pending" | "processing" | "completed" | "failed"
  totalProducts: number
  filters: Record<string, unknown>
  downloadUrl?: string
  expiresAt?: Date
}

export interface ImportTemplate {
  name: string
  required: string[]
  optional: string[]
  sample: Record<string, unknown>
}

export const useProductImportExport = () => {
  const importJobs = ref<ImportJob[]>([])
  const exportJobs = ref<ExportJob[]>([])
  const currentJob = ref<ImportJob | ExportJob | null>(null)
  const loading = ref(false)
  const progress = ref(0)

  const templates: ImportTemplate[] = [
    {
      name: "Standard Product Import",
      required: ["name", "price", "sku"],
      optional: ["description", "category", "tags", "inventory", "images", "weight", "dimensions"],
      sample: {
        name: "Sample Product",
        price: 99.99,
        sku: "PROD-001",
        description: "Product description",
        category: "Electronics",
        tags: "new,featured",
        inventory: 100,
        images: "https://example.com/image1.jpg,https://example.com/image2.jpg",
      },
    },
    {
      name: "Variant Import",
      required: ["parent_sku", "variant_name", "price", "variant_sku"],
      optional: ["options", "inventory", "image"],
      sample: {
        parent_sku: "PROD-001",
        variant_name: "Red / Large",
        price: 99.99,
        variant_sku: "PROD-001-RED-LG",
        options: "color:red,size:large",
        inventory: 50,
      },
    },
  ]

  const importProducts = async (
    file: File,
    options: {
      skipHeader?: boolean
      updateExisting?: boolean
      columnMapping?: Record<string, string>
    } = {},
  ): Promise<ImportJob> => {
    loading.value = true
    progress.value = 0

    const formData = new FormData()
    formData.append("file", file)
    formData.append("options", JSON.stringify(options))

    try {
      const job = await $fetch<ImportJob>("/api/shop/import", {
        method: "POST",
        body: formData,
      })

      importJobs.value.push(job)
      currentJob.value = job

      // Start polling for progress
      pollImportProgress(job.id)

      return job
    } finally {
      loading.value = false
    }
  }

  const pollImportProgress = (jobId: string) => {
    const interval = setInterval(async () => {
      const job = await getImportStatus(jobId)
      progress.value = (job.processedRows / job.totalRows) * 100

      if (job.status === "completed" || job.status === "failed") {
        clearInterval(interval)
        progress.value = 100
      }
    }, 1000)
  }

  const getImportStatus = async (jobId: string): Promise<ImportJob> => {
    const job = await $fetch<ImportJob>(`/api/shop/import/${jobId}`)

    const index = importJobs.value.findIndex(j => j.id === jobId)
    if (index !== -1) {
      importJobs.value[index] = job
    }

    return job
  }

  const exportProducts = async (
    format: "csv" | "json" | "xlsx",
    filters?: {
      category?: string
      status?: string
      dateFrom?: Date
      dateTo?: Date
      productIds?: string[]
    },
  ): Promise<ExportJob> => {
    loading.value = true
    try {
      const job = await $fetch<ExportJob>("/api/shop/export", {
        method: "POST",
        body: { format, filters },
      })

      exportJobs.value.push(job)
      currentJob.value = job

      return job
    } finally {
      loading.value = false
    }
  }

  const getExportStatus = async (jobId: string): Promise<ExportJob> => {
    const job = await $fetch<ExportJob>(`/api/shop/export/${jobId}`)

    const index = exportJobs.value.findIndex(j => j.id === jobId)
    if (index !== -1) {
      exportJobs.value[index] = job
    }

    return job
  }

  const downloadExport = async (jobId: string): Promise<string> => {
    const result = await $fetch<{ downloadUrl: string }>(`/api/shop/export/${jobId}/download`)
    return result.downloadUrl
  }

  const validateImportFile = async (file: File): Promise<{
    valid: boolean
    totalRows: number
    errors: string[]
  }> => {
    const formData = new FormData()
    formData.append("file", file)

    return await $fetch("/api/shop/import/validate", {
      method: "POST",
      body: formData,
    })
  }

  const getImportErrors = async (jobId: string): Promise<ImportJob["errors"]> => {
    const result = await $fetch<{ errors: ImportJob["errors"] }>(`/api/shop/import/${jobId}/errors`)
    return result.errors
  }

  const downloadTemplate = (templateName: string): string => {
    const template = templates.find(t => t.name === templateName)
    if (!template) return ""

    // Generate CSV content
    const headers = [...template.required, ...template.optional]
    const values = headers.map(h => template.sample[h] || "")
    return [headers.join(","), values.join(",")].join("\n")
  }

  const cancelJob = async (jobId: string): Promise<void> => {
    await $fetch(`/api/shop/jobs/${jobId}/cancel`, {
      method: "POST",
    })

    // Update local state
    const importIndex = importJobs.value.findIndex(j => j.id === jobId)
    if (importIndex !== -1) {
      importJobs.value[importIndex].status = "failed"
    }

    const exportIndex = exportJobs.value.findIndex(j => j.id === jobId)
    if (exportIndex !== -1) {
      exportJobs.value[exportIndex].status = "failed"
    }
  }

  const recentImports = computed(() =>
    importJobs.value.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ).slice(0, 10),
  )

  const recentExports = computed(() =>
    exportJobs.value.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ).slice(0, 10),
  )

  const hasActiveJob = computed(() =>
    importJobs.value.some(j => j.status === "processing") ||
    exportJobs.value.some(j => j.status === "processing"),
  )

  return {
    importJobs: computed(() => importJobs.value),
    exportJobs: computed(() => exportJobs.value),
    currentJob: computed(() => currentJob.value),
    loading: computed(() => loading.value),
    progress: computed(() => progress.value),
    templates,
    recentImports,
    recentExports,
    hasActiveJob,
    importProducts,
    getImportStatus,
    exportProducts,
    getExportStatus,
    downloadExport,
    validateImportFile,
    getImportErrors,
    downloadTemplate,
    cancelJob,
  }
}
