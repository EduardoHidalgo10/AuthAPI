import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { User } from '../../services/auth/auth.interfaces';

/**
 * Main panel shown after login.
 */
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly authService = inject(Auth);
  private readonly router = inject(Router);

  /**
   * Users list for the Administrator section.
   */
  readonly users = signal<User[]>([]);

  /**
   * Indicates whether the users list is loading.
   */
  readonly isLoadingUsers = signal(false);

  /**
   * Error message when loading users fails.
   */
  readonly usersError = signal<string | null>(null);

  /**
   * Loads the users list when the current user is Admin.
   */
  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadUsers();
    }
  }

  /**
   * Ends the session and navigates to login.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Requests the users list from the backend.
   */
  private loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.usersError.set(null);

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoadingUsers.set(false);
      },
      error: () => {
        this.usersError.set('No se pudo cargar el listado de usuarios.');
        this.isLoadingUsers.set(false);
      },
    });
  }
}
