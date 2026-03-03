import { defineEventHandler, readBody } from "h3"
import type { Attachment } from "~/shared/types/features"

const mockAttachments: Attachment[] = [
	{
		id: "attach-1",
		taskId: "task-1",
		filename: "requirements.pdf",
		size: 1024000,
		mimeType: "application/pdf",
		url: "/files/requirements.pdf",
		uploadedBy: "user-1",
		uploadedAt: new Date().toISOString(),
		version: 1,
	},
]

export default defineEventHandler(async (event) => {
	const taskId = event.context.params?.taskId as string
	const method = event.node.req.method

	if (method === "GET") {
		return mockAttachments.filter(a => a.taskId === taskId)
	}

	if (method === "POST") {
		const body = await readBody(event)
		const newAttachment: Attachment = {
			id: `attach-${Date.now()}`,
			taskId,
			...body,
			uploadedBy: "user-1",
			uploadedAt: new Date().toISOString(),
			version: 1,
		}
		mockAttachments.push(newAttachment)
		return newAttachment
	}

	return mockAttachments.filter(a => a.taskId === taskId)
})
