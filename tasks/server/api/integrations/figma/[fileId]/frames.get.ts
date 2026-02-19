import { defineEventHandler, getRouterParam } from "h3"

export default defineEventHandler(async (event) => {
	const fileId = getRouterParam(event, "fileId")

	// TODO: Fetch from Figma API
	return [
		{
			id: "frame-1",
			name: "Desktop - Home",
			thumbnailUrl: `https://www.figma.com/file/${fileId}/frame-1/thumbnail`,
			url: `https://www.figma.com/file/${fileId}?node-id=1%3A2`,
			lastModified: new Date().toISOString(),
		},
	]
})
