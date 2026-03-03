// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../app/app.vue'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock the composables used in App.vue
vi.mock('~/composables/useWhiteboard', () => ({
  useWhiteboard: () => ({
    setTool: vi.fn(),
    setUiSettings: vi.fn(),
    canvasCssSize: ref({ width: 800, height: 600 }),
    engine: ref('2d'),
    mode: ref('select'),
    setMode: vi.fn(),
    autoRotate3d: ref(false),
    reset3d: vi.fn(),
    toggleAutoRotate3d: vi.fn(),
    zoomAt: vi.fn(),
    exportAsPng: vi.fn(),
    removeShape: vi.fn(),
    clearSelection: vi.fn(),
  }),
}))

vi.mock('~/composables/facade/useCommandPaletteToggle', () => ({
  useCommandPaletteToggle: () => ({
    open: ref(false),
    close: vi.fn(),
  }),
}))

vi.mock('~/composables/facade/useChatbot', () => ({
  useChatbot: () => ({
    chatbotOpen: ref(false),
    toggleChatbot: vi.fn(),
    closeChatbot: vi.fn(),
  }),
}))

vi.mock('~/composables/facade/useContextMenu', () => ({
  useContextMenu: () => ({
    ctxMenuOpen: ref(false),
    ctxMenuX: ref(0),
    ctxMenuY: ref(0),
    contextMenuItems: ref([]),
    onCanvasContextMenu: vi.fn(),
    closeContextMenu: vi.fn(),
    deleteSelected: vi.fn(),
  }),
}))

vi.mock('~/composables/facade/useAppCommands', () => ({
  useAppCommands: () => ({
    commandItems: ref([]),
  }),
}))




vi.mock('~/composables/facade/useWhiteboardPages', () => ({
  useWhiteboardPages: () => ({
    pages: ref([]),
    activePageId: ref(''),
    activeTitle: ref(''),
    switchToPage: vi.fn(),
    addPage: vi.fn(),
    renameActivePage: vi.fn(),
  }),
}))

describe('App', () => {
  beforeAll(() => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ pages: [], activePageId: '' }),
      } as Response),
    )
  })
  it('renders the main canvas element', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          TopBar: { template: '<div></div>' },
          PagesSidebar: { template: '<div></div>' },
          RemoteCursors: { template: '<div></div>' },
          TextEditor: { template: '<div></div>' },
          CommentThread: { template: '<div></div>' },
          CanvasContextMenu: { template: '<div></div>' },
          CommandPalette: { template: '<div></div>' },
          ToolBar: { template: '<div></div>' },
          Minimap: { template: '<div></div>' },
          ChatbotPanel: { template: '<div></div>' },
          Icon: { template: '<div></div>' },
          NuxtLayout: { template: '<div><slot /></div>' },
        },
      },
    });

    expect(wrapper.find('#whiteboard-canvas').exists()).toBe(true)
  })
})
