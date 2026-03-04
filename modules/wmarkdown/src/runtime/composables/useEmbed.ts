import { ref } from 'vue'

type EmbedProvider = 'youtube' | 'vimeo' | 'twitter' | 'github' | 'codepen' | 'codesandbox' | 'spotify' | 'figma'

interface EmbedData {
  provider: EmbedProvider
  id: string
  url: string
  html: string
}

const embedPatterns: Record<EmbedProvider, RegExp> = {
  youtube: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  vimeo: /vimeo\.com\/(\d+)/,
  twitter: /twitter\.com\/\w+\/status\/(\d+)/,
  github: /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/,
  codepen: /codepen\.io\/([^\/]+)\/pen\/([^\/]+)/,
  codesandbox: /codesandbox\.io\/s\/([^\/]+)/,
  spotify: /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/,
  figma: /figma\.com\/file\/([^\/]+)/
}

const embedTemplates: Record<EmbedProvider, (id: string) => string> = {
  youtube: (id) => `<iframe
    width="100%"
    height="400"
    src="https://www.youtube.com/embed/${id}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    class="wmarkdown-embed wmarkdown-embed-youtube"
  ></iframe>`,
  vimeo: (id) => `<iframe
    width="100%"
    height="400"
    src="https://player.vimeo.com/video/${id}"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
    class="wmarkdown-embed wmarkdown-embed-vimeo"
  ></iframe>`,
  twitter: (id) => `<blockquote class="twitter-tweet">
    <a href="https://twitter.com/x/status/${id}"></a>
  </blockquote>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`,
  github: (path) => `<div class="wmarkdown-embed wmarkdown-embed-github">
    <a href="https://github.com/${path}" target="_blank" rel="noopener">View on GitHub</a>
  </div>`,
  codepen: (id) => `<iframe
    height="400"
    style="width: 100%;"
    scrolling="no"
    src="https://codepen.io/embed/${id}"
    frameborder="no"
    loading="lazy"
    allowfullscreen
    class="wmarkdown-embed wmarkdown-embed-codepen"
  ></iframe>`,
  codesandbox: (id) => `<iframe
    src="https://codesandbox.io/embed/${id}"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    class="wmarkdown-embed wmarkdown-embed-codesandbox"
  ></iframe>`,
  spotify: (id) => `<iframe
    style="border-radius:12px"
    src="https://open.spotify.com/embed/${id}"
    width="100%"
    height="152"
    frameborder="0"
    allowfullscreen
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    class="wmarkdown-embed wmarkdown-embed-spotify"
  ></iframe>`,
  figma: (id) => `<iframe
    style="border: 1px solid rgba(0, 0, 0, 0.1);"
    width="100%"
    height="450"
    src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${id}"
    allowfullscreen
    class="wmarkdown-embed wmarkdown-embed-figma"
  ></iframe>`
}

export function useEmbed() {
  const detectProvider = (url: string): EmbedProvider | null => {
    for (const [provider, pattern] of Object.entries(embedPatterns)) {
      if (pattern.test(url)) {
        return provider as EmbedProvider
      }
    }
    return null
  }

  const extractId = (url: string, provider: EmbedProvider): string | null => {
    const match = url.match(embedPatterns[provider])
    return match ? match[1] : null
  }

  const createEmbed = (url: string): EmbedData | null => {
    const provider = detectProvider(url)
    if (!provider) return null

    const id = extractId(url, provider)
    if (!id) return null

    return {
      provider,
      id,
      url,
      html: embedTemplates[provider](id)
    }
  }

  const parseEmbedMarkdown = (markdown: string): string => {
    // Handle ![embed](url) syntax
    return markdown.replace(
      /^!\[embed\]\((https?:\/\/[^\)]+)\)$/gm,
      (match, url) => {
        const embed = createEmbed(url)
        return embed ? embed.html : match
      }
    )
  }

  const getEmbedMarkdown = (url: string): string => {
    return `![embed](${url})`
  }

  const getSupportedProviders = (): EmbedProvider[] => {
    return Object.keys(embedPatterns) as EmbedProvider[]
  }

  return {
    detectProvider,
    extractId,
    createEmbed,
    parseEmbedMarkdown,
    getEmbedMarkdown,
    getSupportedProviders,
    embedPatterns,
    embedTemplates
  }
}
