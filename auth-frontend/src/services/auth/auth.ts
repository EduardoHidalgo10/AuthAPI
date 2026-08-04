import { inject, Injectable, signal } from '@angular/core';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from './auth.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Handles authentication and user session.
 */
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7147/api/Users';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  /**
   * Current session user.
   */
  readonly currentUser = signal<User | null>(this.readStoredUser());

  /**
   * Sends credentials to the login endpoint.
   * @param request User credentials.
   * @returns Observable with the token and user data.
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  /**
   * Sends data to the register endpoint.
   * @param request New user data.
   * @returns Observable with the registered user.
   */
  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, request);
  }

  /**
   * Gets the users list (Admin only).
   * @returns Observable with the users array.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Persists the session and updates the current user signal.
   * @param token JWT received from the backend.
   * @param user Authenticated user.
   */
  setSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  /**
   * Gets the stored JWT token.
   * @returns Current token or null if missing.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Checks whether an active session exists.
   * @returns true if a token is stored.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Checks whether the current user has the Admin role.
   * @returns true if the role is Admin.
   */
  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }

  /**
   * Clears the session and resets the current user signal.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  /**
   * Reads the user stored in localStorage.
   * @returns Parsed user or null.
   */
  private readStoredUser(): User | null {
    const rawUser = localStorage.getItem(this.userKey);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as User;
    } catch {
      return null;
    }
  }
}
