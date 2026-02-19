export function createSuccessResponse(data, meta) {
  return {
    success: true,
    data,
    meta: meta ? {
      total: meta.total,
      limit: meta.limit,
      page: meta.page,
      totalPages: meta.totalPages
    } : void 0
  };
}
export function createErrorResponse(code, message, details) {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}
export function getPaginationMeta(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}
