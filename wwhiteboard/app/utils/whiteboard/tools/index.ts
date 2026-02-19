import { select } from './select'
import { pencil } from './pencil'
import { shape } from './shape'
import { line } from './line'
import { text } from './text'
import { stickyNote } from './sticky-note'
import { pan } from './pan'
import { zoom } from './zoom'
import { eraser } from './eraser'
import { comment } from './comment'
import { connector } from './connector'
import { frame } from './frame'

export const tools = {
  select,
  pencil,
  rectangle: shape,
  ellipse: shape,
  diamond: shape,
  triangle: shape,
  star: shape,
  hexagon: shape,
  line,
  arrow: line,
  text,
  'sticky-note': stickyNote,
  pan,
  zoom,
  eraser,
  comment,
  connector,
  frame,
}
