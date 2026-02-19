import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'
import { useHistoryStore } from './history'
import type { ToolId, WhiteboardState, UiSettings, RemoteCursor } from '../../shared/types/whiteboard'
import { definePageActions, type WhiteboardPage } from './actions/page'
import { defineShapeActions } from './actions/shape'
import { defineCameraActions } from './actions/camera'
import { defineCommentActions } from './actions/comment'

const createEmptyDoc = (): WhiteboardState['doc'] => ({
  shapes: {},
  comments: {},
  order: [],
})

const createDefaultCamera = (): WhiteboardState['camera'] => ({
  x: 0,
  y: 0,
  zoom: 1,
})

export const useWhiteboardStore = defineStore('whiteboard', () => {
  const historyStore = useHistoryStore()
  const firstPageId = 'page-1'

  const loadInitialState = async () => {
    // For now, we'll use a hardcoded ID. In a real app, this would come from the URL.
    const whiteboardId = 'default-whiteboard';
    try {
      const response = await fetch(`/api/whiteboard/${whiteboardId}`);
      if (response.ok) {
        const data = await response.json();
        // A real implementation would be more robust
        return data.doc;
      }
    } catch (e) {
      console.error('Failed to load whiteboard data from API', e);
    }

    // Fallback to default empty state
    return {
      pages: [
        {
          id: firstPageId,
          name: 'Page 1',
          doc: createEmptyDoc(),
          camera: createDefaultCamera(),
        },
      ],
      activePageId: firstPageId,
    };
  };

  const state = reactive<WhiteboardState & { pages: WhiteboardPage[]; activePageId: string }>({
    doc: createEmptyDoc(),
    camera: createDefaultCamera(),
    pages: [],
    activePageId: '',
    ui: {
      tool: 'select',
      selectedIds: [],
      marquee: null,
      editingShapeId: null,
      presentationMode: false,
      settings: {
        stroke: '#111827',
        fill: '#3b82f6',
        strokeWidth: 2,
        fontSize: 24,
        background: '#ffffff',
        showGrid: true,
      },
    },
    cursors: {
      'mock-user-1': {
        id: 'mock-user-1',
        x: 0,
        y: 0,
        name: 'Alex',
        color: '#3b82f6',
      },
    },
  })

  const pageActions = definePageActions(state)
  const shapeActions = defineShapeActions(state)
  const cameraActions = defineCameraActions(state)
  const commentActions = defineCommentActions(state)

  function setTool(tool: ToolId) {
    state.ui.tool = tool
    if (tool !== 'select') state.ui.selectedIds = []
  }

  function loadDoc(doc: WhiteboardState['doc']) {
    state.doc = doc
    historyStore.clear()
  }

  function setUiSettings(patch: Partial<UiSettings>) {
    state.ui.settings = {
      ...state.ui.settings,
      ...patch,
    }
  }

  function togglePresentationMode() {
    state.ui.presentationMode = !state.ui.presentationMode
  }

  watch(
    () => state.doc,
    (newValue, oldValue) => {
      historyStore.push(oldValue)
    },
    { deep: true },
  )

  // Auto-save to API
  watch(
    () => ({ pages: state.pages, activePageId: state.activePageId }),
    async (valueToSave) => {
      const whiteboardId = 'default-whiteboard';
      try {
        await fetch(`/api/whiteboard/${whiteboardId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(valueToSave),
        });
      } catch (e) {
        console.error('Failed to save whiteboard data to API', e);
      }
    },
    { deep: true, immediate: false }, // Prevent saving on initial load
  )

  async function initializeStore() {
    const initialState = await loadInitialState()
    const activePage = initialState.pages.find((p: WhiteboardPage) => p.id === initialState.activePageId) ?? initialState.pages[0]
    state.doc = activePage.doc
    state.camera = activePage.camera
    state.pages = initialState.pages
    state.activePageId = initialState.activePageId
  }

  function undo() {
    const previousDoc = historyStore.undo(state.doc)
    if (previousDoc) {
      state.doc = previousDoc
    }
  }

  function redo() {
    const nextDoc = historyStore.redo(state.doc)
    if (nextDoc) {
      state.doc = nextDoc
    }
  }

  function setCursor(cursor: RemoteCursor) {
    state.cursors[cursor.id] = cursor
  }

  return {
    ...toRefs(state),
    setTool,
    setUiSettings,
    togglePresentationMode,
    loadDoc,
    ...pageActions,
    ...shapeActions,
    ...cameraActions,
    ...commentActions,
    undo,
    redo,
    setCursor,
    initializeStore,
  }
})
