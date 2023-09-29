export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  role: UserRole;
}

export interface RegisterResponse {
  status: number;
  error: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error: string[];
  token: string | null;
}

export interface JwtTokenPayload {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface DecodedJwtTokenPayload extends JwtTokenPayload {
  iat: number;
  exp: number;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  status: number;
  error: string[];
  payload: JwtTokenPayload | null;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  OWNER = 'OWNER',
}
