/**
 * Login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login endpoint response.
 */
export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

/**
 * Register request payload.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Represents an authenticated or listed user.
 */
export interface User {
  id: string;
  userName: string;
  name: string;
  role: string;
}
