import type { ShapeImage } from '../../../../shared/types/whiteboard'

const imageCache = new Map<string, HTMLImageElement>()

export function renderImage(ctx: CanvasRenderingContext2D, shape: ShapeImage) {
  let img = imageCache.get(shape.src)
  if (!img) {
    img = new Image()
    img.src = shape.src
    imageCache.set(shape.src, img)
    // Note: The image might not be loaded on the first frame.
    // A more robust solution would involve a mechanism to re-render once the image is loaded.
  }

  if (img.complete) {
    ctx.drawImage(img, shape.x, shape.y, shape.w, shape.h)
  } else {
    // Optionally, draw a placeholder while the image is loading
    ctx.save()
    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 1
    ctx.strokeRect(shape.x, shape.y, shape.w, shape.h)
    ctx.restore()
  }
}
