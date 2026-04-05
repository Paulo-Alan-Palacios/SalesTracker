import { isAxiosError } from 'axios';

/** Safely extracts the error message from an Axios response, falling back to the provided string. */
export function extractApiError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    return data?.error ?? fallback;
  }
  return fallback;
}
