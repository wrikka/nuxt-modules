import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { fileId, token } = body

	// TODO: Fetch from Figma API
	return {
		id: fileId,
		name: "Figma File",
		thumbnailUrl: `https://www.figma.com/file/${fileId}/thumbnail`,
		url: `https://www.figma.com/file/${fileId}`,
		frames: [],
		linkedAt: new Date().toISOString(),
	}
})
