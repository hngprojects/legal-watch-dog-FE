// src/types/auth.ts

export interface RegisterRequest {
  organisation_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  organisation: {
    id: string;
    name: string;
    created_at: string; // ISO date string
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'ADMIN' | 'USER'; // can extend later
    organisation_id: string;
  };
  token: string; // JWT access token
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    organisation_id: string;
  };
}

export interface LogoutResponse {
  message: 'Logged out';
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string; // new access token
}