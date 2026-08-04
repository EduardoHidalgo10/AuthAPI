import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth/auth';

/**
 * User registration form component.
 */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  readonly authService = inject(Auth);
  private readonly router = inject(Router);

  /**
   * Error message shown in the form.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Initializes the register form.
   */
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
    });
  }

  /**
   * Submits registration and navigates to login on success.
   */
  submitRegister(): void {
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const message =
          error?.error?.message ?? 'Registration failed. Please try again.';
        this.errorMessage.set(message);
      },
    });
  }
}
