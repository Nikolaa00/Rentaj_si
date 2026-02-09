export type UserRole = 'DEALER' | 'RENTER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  location: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: string;
}