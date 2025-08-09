export interface ApiResponse<T = any> {
  success: boolean;
  errorCode?: string;
  message: string;
  data?: T;
  stack?: string;
}
