import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth/auth';

/**
 * Login form component.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  readonly authService = inject(Auth);
  private readonly router = inject(Router);

  /**
   * Error message shown in the form.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Initializes the login form.
   */
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null),
    });
  }

  /**
   * Submits credentials and navigates to the dashboard on success.
   */
  submitLogin(): void {
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.setSession(response.token, response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Login failed. Please try again.';
        this.errorMessage.set(message);
      },
    });
  }
}
