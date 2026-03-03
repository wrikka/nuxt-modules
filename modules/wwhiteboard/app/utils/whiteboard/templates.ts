import type { WhiteboardDoc } from '../../../shared/types/whiteboard'

export const templates: { name: string; doc: WhiteboardDoc }[] = [
  {
    name: 'Kanban Board',
    doc: {
      shapes: {
        'col-1': { id: 'col-1', type: 'rectangle', x: 100, y: 100, w: 250, h: 600, stroke: '#111827', fill: '#f3f4f6', strokeWidth: 2 },
        'col-2': { id: 'col-2', type: 'rectangle', x: 400, y: 100, w: 250, h: 600, stroke: '#111827', fill: '#f3f4f6', strokeWidth: 2 },
        'col-3': { id: 'col-3', type: 'rectangle', x: 700, y: 100, w: 250, h: 600, stroke: '#111827', fill: '#f3f4f6', strokeWidth: 2 },
        'title-1': { id: 'title-1', type: 'text', x: 120, y: 140, text: 'To Do', fontSize: 24, stroke: '#111827', fill: null, strokeWidth: 1 },
        'title-2': { id: 'title-2', type: 'text', x: 420, y: 140, text: 'In Progress', fontSize: 24, stroke: '#111827', fill: null, strokeWidth: 1 },
        'title-3': { id: 'title-3', type: 'text', x: 720, y: 140, text: 'Done', fontSize: 24, stroke: '#111827', fill: null, strokeWidth: 1 },
      },
      order: ['col-1', 'col-2', 'col-3', 'title-1', 'title-2', 'title-3'],
      comments: {},
    },
  },
  {
    name: 'Flowchart',
    doc: {
      shapes: {
        'start': { id: 'start', type: 'ellipse', x: 450, y: 100, w: 150, h: 60, stroke: '#111827', fill: '#dbeafe', strokeWidth: 2 },
        'process': { id: 'process', type: 'rectangle', x: 450, y: 250, w: 150, h: 60, stroke: '#111827', fill: '#dbeafe', strokeWidth: 2 },
        'decision': { id: 'decision', type: 'rectangle', x: 450, y: 400, w: 150, h: 60, stroke: '#111827', fill: '#dbeafe', strokeWidth: 2 }, // Note: Visually a diamond
        'end': { id: 'end', type: 'ellipse', x: 450, y: 550, w: 150, h: 60, stroke: '#111827', fill: '#dbeafe', strokeWidth: 2 },
        'arrow-1': { id: 'arrow-1', type: 'arrow', a: { x: 525, y: 160 }, b: { x: 525, y: 250 }, stroke: '#111827', fill: null, strokeWidth: 2 },
        'arrow-2': { id: 'arrow-2', type: 'arrow', a: { x: 525, y: 310 }, b: { x: 525, y: 400 }, stroke: '#111827', fill: null, strokeWidth: 2 },
        'arrow-3': { id: 'arrow-3', type: 'arrow', a: { x: 525, y: 460 }, b: { x: 525, y: 550 }, stroke: '#111827', fill: null, strokeWidth: 2 },
      },
      order: ['start', 'process', 'decision', 'end', 'arrow-1', 'arrow-2', 'arrow-3'],
      comments: {},
    },
  },
]
