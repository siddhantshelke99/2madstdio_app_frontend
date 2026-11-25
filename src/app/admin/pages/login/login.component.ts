import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page">
      <!-- TOP NAV BAR -->
      <header class="login-topbar">
        <a routerLink="/" class="brand-logo">
          2<b>NOMADS</b>
          <span class="brand-sub">Admin Desk</span>
        </a>

        <a routerLink="/" class="back-link">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Return to Studio Website</span>
        </a>
      </header>

      <!-- AMBIENT GLOW & GRID -->
      <div class="glow-bg"></div>

      <!-- MAIN CONTAINER -->
      <div class="card-wrap">
        <div class="login-card">
          <!-- CARD HEADER -->
          <div class="card-header">
            <div class="status-badge">
              <span class="status-dot"></span>
              <span>Restricted Studio Access</span>
            </div>

            <h1 class="login-title">Admin Portal</h1>
            <p class="login-subtitle">
              Sign in to manage student admissions, client inquiries, studio courses, and communications.
            </p>
          </div>

          <!-- SESSION EXPIRED ALERT -->
          @if (sessionExpired()) {
            <div class="alert-box alert-warning">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>Your session expired. Please sign in again.</span>
            </div>
          }

          <!-- ERROR ALERT -->
          @if (errorMessage()) {
            <div class="alert-box alert-danger">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- FORM -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <!-- EMAIL FIELD -->
            <div class="form-group">
              <label for="adminEmail">Admin Email</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                <input
                  id="adminEmail"
                  type="email"
                  formControlName="email"
                  placeholder="admin@2nomads.design"
                  autocomplete="username" />
              </div>
              @if (isFieldInvalid('email')) {
                <span class="error-msg">Valid admin email is required.</span>
              }
            </div>

            <!-- PASSWORD FIELD -->
            <div class="form-group">
              <label for="adminPassword">Password</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  id="adminPassword"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••••••"
                  autocomplete="current-password" />
                <button
                  type="button"
                  class="btn-eye"
                  (click)="toggleShowPassword()"
                  aria-label="Toggle password visibility">
                  @if (showPassword()) {
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                    </svg>
                  } @else {
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
              @if (isFieldInvalid('password')) {
                <span class="error-msg">Password must be at least 6 characters.</span>
              }
            </div>

            <!-- SUBMIT BUTTON -->
            <button type="submit" class="btn-submit" [disabled]="isLoading()">
              @if (isLoading()) {
                <span class="spinner"></span>
                <span>Authenticating...</span>
              } @else {
                <span>Sign In to Dashboard →</span>
              }
            </button>
          </form>

          <!-- DEMO SEED CREDENTIALS CALLOUT -->
          <div class="demo-box">
            <div class="demo-header">
              <span class="demo-badge">SEED CREDENTIALS</span>
              <button type="button" class="btn-autofill" (click)="fillDemoCredentials()">
                1-Click Autofill
              </button>
            </div>
            <div class="demo-credentials">
              <div>Email: <b>admin&#64;2nomads.design</b></div>
              <div>Pass: <b>AdminPassword123!</b></div>
            </div>
          </div>

          <!-- SECURITY FOOTER -->
          <div class="card-footer">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>256-Bit Encrypted TLS Session · 2NOMADS Studio Pune</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: #09090b;
      position: relative;
      display: flex;
      flex-direction: column;
      color: #f5f5f7;
      font-family: var(--body);
      overflow-x: hidden;
    }

    .login-topbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      padding: 0 5vw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 20;
      background: rgba(9, 9, 11, 0.6);
      backdrop-filter: blur(16px);
    }

    .brand-logo {
      font-family: var(--display);
      font-size: 20px;
      font-weight: 700;
      text-decoration: none;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo b {
      color: var(--accent);
    }

    .brand-sub {
      font-size: 10px;
      font-family: var(--body);
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
      padding-left: 10px;
      border-left: 1px solid rgba(255, 255, 255, 0.15);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--accent);
    }

    .glow-bg {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 450px;
      background: radial-gradient(circle at 50% 0%, rgba(255, 77, 28, 0.18) 0%, rgba(9, 9, 11, 0) 70%);
      pointer-events: none;
      z-index: 1;
    }

    .card-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 100px 20px 40px;
      position: relative;
      z-index: 10;
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      background: rgba(14, 15, 19, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 38px 34px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(255, 77, 28, 0.08);
      backdrop-filter: blur(24px);
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 28px 20px;
      }
    }

    .card-header {
      text-align: center;
      margin-bottom: 26px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(255, 77, 28, 0.12);
      border: 1px solid rgba(255, 77, 28, 0.35);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
    }

    .login-title {
      font-family: var(--display);
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
      margin: 0 0 8px;
    }

    .login-subtitle {
      font-size: 13px;
      line-height: 1.5;
      color: rgba(245, 245, 247, 0.6);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
    }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: rgba(255, 255, 255, 0.35);
      display: flex;
      align-items: center;
      pointer-events: none;
    }

    .input-wrap input {
      width: 100%;
      background: #09090b;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      color: #fff;
      padding: 12px 40px 12px 38px;
      font-family: var(--body);
      font-size: 13.5px;
      outline: none;
      transition: all 0.25s;
    }

    .input-wrap input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(255, 77, 28, 0.22);
    }

    .btn-eye {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      transition: color 0.2s;
    }

    .btn-eye:hover {
      color: #fff;
    }

    .error-msg {
      color: #fca5a5;
      font-size: 11px;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      margin-top: 6px;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-family: var(--body);
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(255, 77, 28, 0.35);
      transition: all 0.25s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-submit:hover:not(:disabled) {
      background: #ff6538;
      box-shadow: 0 12px 30px rgba(255, 77, 28, 0.5);
      transform: translateY(-1px);
    }

    .btn-submit:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 18px;
    }

    .alert-warning {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fcd34d;
    }

    .alert-danger {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }

    .demo-box {
      margin-top: 22px;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
    }

    .demo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .demo-badge {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--accent);
    }

    .btn-autofill {
      background: rgba(255, 77, 28, 0.15);
      border: 1px solid rgba(255, 77, 28, 0.3);
      color: #fff;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-autofill:hover {
      background: var(--accent);
    }

    .demo-credentials {
      font-family: var(--font-mono, monospace);
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .demo-credentials b {
      color: #fff;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 10.5px;
      color: rgba(255, 255, 255, 0.35);
      text-align: center;
    }
  `],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  sessionExpired = signal(false);
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['admin@2nomads.design', [Validators.required, Validators.email]],
    password: ['AdminPassword123!', [Validators.required, Validators.minLength(6)]],
  });

  private returnUrl = '/admin/dashboard';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['sessionExpired']) {
        this.sessionExpired.set(true);
      }
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  toggleShowPassword(): void {
    this.showPassword.update((val) => !val);
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@2nomads.design',
      password: 'AdminPassword123!',
    });
  }

  isFieldInvalid(name: string): boolean {
    const control = this.loginForm.get(name);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const serverMsg = err.error?.message || 'Invalid email or password.';
        this.errorMessage.set(serverMsg);
      },
    });
  }
}
