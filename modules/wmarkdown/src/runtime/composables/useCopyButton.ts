import { ref } from 'vue'

export function useCopyButton() {
  const copied = ref(false)
  const error = ref<string | null>(null)

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
      return true
    } catch (err) {
      error.value = 'Failed to copy to clipboard'
      return false
    }
  }

  const addCopyButtonsToCodeBlocks = (container: HTMLElement) => {
    const codeBlocks = container.querySelectorAll('pre code')

    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement
      if (!pre || pre.querySelector('.wmarkdown-copy-button')) return

      const button = document.createElement('button')
      button.className = 'wmarkdown-copy-button'
      button.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">Copy</span>'
      button.title = 'Copy to clipboard'

      button.addEventListener('click', async () => {
        const code = codeBlock.textContent || ''
        const success = await copyToClipboard(code)

        if (success) {
          button.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>'
          button.classList.add('copied')

          setTimeout(() => {
            button.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">Copy</span>'
            button.classList.remove('copied')
          }, 2000)
        }
      })

      pre.style.position = 'relative'
      pre.appendChild(button)
    })
  }

  const createCopyButton = (onCopy: () => void) => {
    const button = document.createElement('button')
    button.className = 'wmarkdown-copy-button'
    button.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">Copy</span>'

    button.addEventListener('click', () => {
      onCopy()
      button.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>'
      button.classList.add('copied')

      setTimeout(() => {
        button.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">Copy</span>'
        button.classList.remove('copied')
      }, 2000)
    })

    return button
  }

  return {
    copied,
    error,
    copyToClipboard,
    addCopyButtonsToCodeBlocks,
    createCopyButton
  }
}
