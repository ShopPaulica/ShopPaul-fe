export type AuthToken = string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  token?: string;
}

export const LS_TOKEN_KEY = 'auth_token';
