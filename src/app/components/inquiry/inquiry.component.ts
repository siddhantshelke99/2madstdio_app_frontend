import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="inquiry-wrapper">
      <form class="e-form inq-form-card" [formGroup]="inquiryForm" (ngSubmit)="onSubmit()">
        <div class="form-header">
          <div class="form-kicker">Studio &amp; OEM Inquiries</div>
          <h3 class="form-title">Send a Project Brief</h3>
          <p class="form-subtitle">
            Connect directly with R Donshong Koren and the 2NOMADS engineering team regarding scale clay models, prototype fabrication, or academy consultations.
          </p>
        </div>

        @if (success()) {
          <div class="alert-box alert-success">
            <div class="alert-icon">✓</div>
            <div>
              <strong class="alert-heading">Inquiry Dispatched Successfully!</strong>
              <p class="alert-text">
                Thank you for reaching out. Your project inquiry has been received by our studio director. We will review your requirements and respond via email or phone within 24 business hours.
              </p>
              <button type="button" class="btn-reset" (click)="resetForm()">Send Another Inquiry</button>
            </div>
          </div>
        }

        @if (error()) {
          <div class="alert-box alert-danger">
            <div class="alert-icon">!</div>
            <div>
              <strong class="alert-heading">Submission Error</strong>
              <p class="alert-text">{{ error() }}</p>
            </div>
          </div>
        }

        @if (!success()) {
          <div class="grid-2">
            <label>Your Name / Organization <span class="req">*</span>
              <input formControlName="name" placeholder="e.g. Anand Mahindra / Studio X" autocomplete="name">
              @if (f['name'].touched && f['name'].invalid) {
                <span class="field-error">Please enter your name or company</span>
              }
            </label>

            <label>Email Address <span class="req">*</span>
              <input formControlName="email" type="email" placeholder="contact@company.com" autocomplete="email">
              @if (f['email'].touched && f['email'].invalid) {
                <span class="field-error">Valid email address is required</span>
              }
            </label>
          </div>

          <div class="grid-2">
            <label>Phone / WhatsApp Number <span class="req">*</span>
              <input formControlName="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel">
              @if (f['phone'].touched && f['phone'].invalid) {
                <span class="field-error">Valid phone number is required</span>
              }
            </label>

            <label>Inquiry Classification <span class="req">*</span>
              <select formControlName="type">
                <option value="studio_project">Studio Project — Clay Model &amp; Prototype</option>
                <option value="academy_general">Academy &amp; Masterclass Inquiry</option>
              </select>
            </label>
          </div>

          <label>Project Scope or Requirements <span class="req">*</span>
            <textarea
              formControlName="message"
              rows="5"
              placeholder="Tell us about your vehicle program, scale (1:4, 1:1), target timeline, or specific styling questions..."></textarea>
            @if (f['message'].touched && f['message'].invalid) {
              <span class="field-error">Please provide a brief description (at least 5 characters)</span>
            }
          </label>

          <button type="submit" class="btn btn-submit" [disabled]="loading()">
            @if (loading()) {
              <span>Transmitting Brief...</span>
            } @else {
              <span>Send Studio Inquiry →</span>
            }
          </button>
        }
      </form>
    </div>
  `,
  styles: [`
    .inquiry-wrapper {
      width: 100%;
    }
    .inq-form-card {
      background: rgba(14, 15, 18, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 36px 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
      color: #f5f5f7;
    }
    @media (max-width: 600px) {
      .inq-form-card {
        padding: 24px 18px;
      }
    }
    .form-header {
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 18px;
    }
    .form-kicker {
      font-size: 11px;
      font-family: var(--body);
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .form-title {
      font-family: var(--display);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #fff;
      margin: 0 0 8px;
    }
    .form-subtitle {
      font-size: 13.5px;
      color: rgba(245, 245, 247, 0.65);
      line-height: 1.55;
      margin: 0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      font-family: var(--body);
      font-weight: 500;
      letter-spacing: 0.04em;
      color: rgba(245, 245, 247, 0.85);
      margin-bottom: 16px;
    }
    .req {
      color: var(--accent);
    }
    input, select, textarea {
      width: 100%;
      background: #09090b;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: #fff;
      padding: 12px 14px;
      font-family: var(--body);
      font-size: 13.5px;
      transition: border-color 0.25s, box-shadow 0.25s;
      outline: none;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(255, 77, 28, 0.2);
    }
    .field-error {
      color: #fca5a5;
      font-size: 11px;
      font-weight: 400;
      margin-top: 2px;
    }
    .btn-submit {
      width: 100%;
      padding: 16px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 8px;
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
      opacity: 0.6;
      cursor: not-allowed;
    }
    .alert-box {
      display: flex;
      gap: 16px;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 24px;
    }
    .alert-success {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #a7f3d0;
    }
    .alert-danger {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }
    .alert-icon {
      font-size: 20px;
      font-weight: 800;
    }
    .alert-heading {
      font-size: 15px;
      color: #fff;
      display: block;
      margin-bottom: 4px;
    }
    .alert-text {
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
    .btn-reset {
      margin-top: 12px;
      background: var(--accent);
      border: none;
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
  `],
})
export class InquiryComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  inquiryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    type: ['studio_project', Validators.required],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  get f() {
    return this.inquiryForm.controls;
  }

  onSubmit(): void {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const val = this.inquiryForm.value;
    this.api.submitInquiry(val).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set(true);
        } else {
          this.error.set(res.message || 'Submission failed.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to submit inquiry.');
      },
    });
  }

  resetForm(): void {
    this.success.set(false);
    this.inquiryForm.reset({
      type: 'studio_project',
    });
  }
}
