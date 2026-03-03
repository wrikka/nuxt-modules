// d:/wshop/app/composables/useHtmlRenderer.ts

import html2canvas from "html2canvas"
import { ref } from "vue"

export function useHtmlRenderer() {
	const loading = ref(false)
	const error = ref<string | null>(null)

	const printElement = async (elementId: string) => {
		loading.value = true
		error.value = null
		try {
			const element = document.getElementById(elementId)
			if (!element) throw new Error("Element not found")

			const printWindow = window.open("", "_blank")
			if (!printWindow) throw new Error("Failed to open print window")

			const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>ใบเสร็จ</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; margin: 0; font-size: 12px; line-height: 1.4; }
              /* ... (rest of the print styles) ... */
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `

			printWindow.document.write(printHTML)
			printWindow.document.close()

			setTimeout(() => {
				printWindow.print()
				printWindow.close()
			}, 250)
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to print"
			throw err
		} finally {
			loading.value = false
		}
	}

	const generateImage = async (elementId: string) => {
		loading.value = true
		error.value = null
		try {
			const element = document.getElementById(elementId)
			if (!element) throw new Error("Element not found")

			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true,
				backgroundColor: "#ffffff",
			})

			const imageData = canvas.toDataURL("image/png")

			const link = document.createElement("a")
			link.href = imageData
			link.download = `receipt-${Date.now()}.png`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			return imageData
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate image"
			throw err
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		error,
		printElement,
		generateImage,
	}
}
