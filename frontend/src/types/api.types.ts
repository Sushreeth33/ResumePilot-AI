export type ApiErrorDetail = {
  path?: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode?: string;
  details?: ApiErrorDetail[];
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};
