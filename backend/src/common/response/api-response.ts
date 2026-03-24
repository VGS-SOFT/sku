/**
 * Standard API response wrapper.
 * All controllers return this shape so frontend always knows what to expect.
 * When adding pagination, extend this with meta: PaginationMeta
 */
export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
  timestamp: string;

  constructor(partial: Partial<ApiResponse<T>>) {
    this.success = partial.success ?? true;
    this.message = partial.message ?? 'Success';
    this.data = partial.data ?? null;
    this.error = partial.error ?? null;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse({ success: true, message, data });
  }

  static error<T>(error: string, message = 'Error'): ApiResponse<T> {
    return new ApiResponse({ success: false, message, data: null, error });
  }
}
