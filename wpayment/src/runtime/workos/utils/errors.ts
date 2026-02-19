export class WorkOSClientError extends Error {
	constructor(message: string, public code?: string) {
		super(message)
		this.name = "WorkOSClientError"
	}
}

export class WorkOSServerError extends Error {
	constructor(message: string, public code?: string, public statusCode?: number) {
		super(message)
		this.name = "WorkOSServerError"
	}
}

export const createErrorHandler = (error: unknown) => {
	if (error instanceof WorkOSClientError || error instanceof WorkOSServerError) {
		return error
	}

	if (error instanceof Error) {
		return new WorkOSClientError(error.message)
	}

	return new WorkOSClientError("Unknown error occurred")
}
