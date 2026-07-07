import axios from 'axios';
import type { ApiErrorResponse } from '../types/api.types';

export type FormErrors = Record<string, string>;

export function parseApiError(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error) || !error.response?.data) {
    return {
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }

  const data = error.response.data;
  const fieldErrors: FormErrors = {};

  data.details?.forEach((detail) => {
    if (detail.path) {
      fieldErrors[detail.path] = detail.message;
    }
  });

  return {
    message: data.message || 'Something went wrong. Please try again.',
    fieldErrors,
  };
}
