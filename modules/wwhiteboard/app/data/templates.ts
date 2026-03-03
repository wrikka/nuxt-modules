import type { WhiteboardDoc } from '../../shared/types/whiteboard'

export type Template = {
  id: string
  name: string
  doc: WhiteboardDoc
}

export const templates: Template[] = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    doc: {
      shapes: {
        'shape-1': {
          id: 'shape-1',
          type: 'rectangle',
          x: 100,
          y: 100,
          w: 120,
          h: 60,
          stroke: '#000000',
          fill: '#ffffff',
          strokeWidth: 2,
        },
        'shape-2': {
          id: 'shape-2',
          type: 'diamond',
          x: 300,
          y: 85,
          w: 150,
          h: 90,
          stroke: '#000000',
          fill: '#ffffff',
          strokeWidth: 2,
        },
        'shape-3': {
          id: 'shape-3',
          type: 'arrow',
          a: { x: 220, y: 130 },
          b: { x: 300, y: 130 },
          stroke: '#000000',
          fill: null,
          strokeWidth: 2,
        },
      },
      order: ['shape-1', 'shape-2', 'shape-3'],
      comments: {},
    },
  },
  {
    id: 'brainstorming',
    name: 'Brainstorming',
    doc: {
      shapes: {
        'note-1': {
          id: 'note-1',
          type: 'sticky-note',
          x: 100,
          y: 100,
          w: 200,
          h: 200,
          text: 'Idea 1',
          fontSize: 24,
          stroke: '#111827',
          fill: '#facc15',
          strokeWidth: 2,
        },
        'note-2': {
          id: 'note-2',
          type: 'sticky-note',
          x: 400,
          y: 200,
          w: 200,
          h: 200,
          text: 'Idea 2',
          fontSize: 24,
          stroke: '#111827',
          fill: '#a7f3d0',
          strokeWidth: 2,
        },
      },
      order: ['note-1', 'note-2'],
      comments: {},
    },
  },
]
