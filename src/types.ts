export type VerifyStatus = 'idle' | 'scanning' | 'success' | 'error';

export interface VerifyResponse {
  status: 'ok' | 'error';
  message?: string;
}
