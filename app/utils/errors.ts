/**
 * Create a custom error for the application
 */
export function createAppError(
  message: string,
  statusCode: number = 404,
  fatal: boolean = true
) {
  return createError({ statusCode, message, fatal })
}
