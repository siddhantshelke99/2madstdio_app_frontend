import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/course.model';
import { StudentRegistrationPayload } from '../../models/student.model';

const DEFAULT_COURSES: Course[] = [
  {
    id: '484296ae-092f-4095-844f-afd6b915d644',
    title: 'Master Classes Season 01: Concept to Prototype',
    slug: 'masterclasses-season-01',
    description: '1:1 scale clay model, Class-A digital surfaces, and running Oneaxi EV prototype.',
    duration: '16 Weeks',
    mode: 'hybrid',
    fee: 120000,
    syllabus: [],
    isPublished: true,
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
  },
  {
    id: '8aa68545-b7de-4c0b-b236-613227f065bd',
    title: 'Transportation Design',
    slug: 'transportation-design',
    description: 'Vehicle architecture, proportion sketching, digital rendering, and OEM portfolio decks.',
    duration: '12 Weeks',
    mode: 'hybrid',
    fee: 65000,
    syllabus: [],
    isPublished: true,
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
  },
  {
    id: '06866321-6add-4bbe-8837-40285566f250',
    title: 'Clay Modelling',
    slug: 'clay-modelling',
    description: 'Studio tools, armatures, tape layout, surfacing, and highlight reading under studio neon.',
    duration: '8 Weeks',
    mode: 'offline',
    fee: 75000,
    syllabus: [],
    isPublished: true,
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
  },
  {
    id: '53d043ce-848d-4599-9820-ee60e434576c',
    title: 'Digital Sculpting',
    slug: 'digital-sculpting',
    description: 'Class-A surfacing in Autodesk Alias, NURBS theory, SubD, and 5-axis CNC mill data prep.',
    duration: '10 Weeks',
    mode: 'hybrid',
    fee: 60000,
    syllabus: [],
    isPublished: true,
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
  },
  {
    id: '75eb2b8b-da28-411d-a3f7-60e482d87db7',
    title: '3D Scanning & Reverse Engineering',
    slug: 'scanning',
    description: 'Optical and laser coordinate scanning, point cloud alignment, mesh clean-up, and reverse CAD.',
    duration: '4 Weeks',
    mode: 'offline',
    fee: 45000,
    syllabus: [],
    isPublished: true,
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
  },
  {
    id: '90ccda8a-b29b-46a0-a106-874ed094157d',
    title: 'Prototype — Show & Working',
    slug: 'prototype',
    description: 'Tooling, molds, FRP/carbon composite layup, EV powertrain packaging, and automotive paint.',
    duration: '12 Weeks',
    mode: 'offline',
    fee: 85000,
    syllabus: [],
    isPublished: true,
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
  },
];

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="registration-container">
      @if (success()) {
        <!-- SUCCESS SCREEN -->
        <div class="success-card">
          <div class="success-icon-wrap">
            <svg class="success-check-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="success-badge">Application Received · Season 01</div>
          <h2 class="success-title">Seat Application Confirmed</h2>
          <p class="success-text">
            Thank you, <strong>{{ successName() }}</strong>. Your registration for <strong>{{ successCourse() }}</strong> has been officially logged in our studio admissions portal.
          </p>

          <div class="receipt-box">
            <div class="receipt-row">
              <span class="r-label">Reference ID</span>
              <span class="r-val r-code">{{ confirmationRef() }}</span>
            </div>
            <div class="receipt-row">
              <span class="r-label">Selected Course</span>
              <span class="r-val r-highlight">{{ successCourse() }}</span>
            </div>
            <div class="receipt-row">
              <span class="r-label">Batch Slot</span>
              <span class="r-val">{{ successBatch() }}</span>
            </div>
            <div class="receipt-row">
              <span class="r-label">Studio Venue</span>
              <span class="r-val">2NOMADS Transportation Studio · Bhosari, Pune</span>
            </div>
          </div>

          <div class="onboarding-steps">
            <div class="ob-item">
              <span class="ob-num">01</span>
              <div>
                <div class="ob-title">Automated Onboarding Dispatch</div>
                <div class="ob-desc">Course syllabus &amp; studio prep details have been sent to your Email &amp; WhatsApp.</div>
              </div>
            </div>
            <div class="ob-item">
              <span class="ob-num">02</span>
              <div>
                <div class="ob-title">Bench Allocation Review</div>
                <div class="ob-desc">Our design faculty reviews applicant background and contacts you within 24 hours.</div>
              </div>
            </div>
          </div>

          <div class="success-actions">
            <a
              [href]="'https://wa.me/919158228037?text=Hello%202NOMADS!%20I%20have%20submitted%20application%20(' + confirmationRef() + ')%20for%20' + successCourse() + '.'"
              target="_blank"
              rel="noopener"
              class="btn-wa">
              <span>Connect with Admissions Desk on WhatsApp →</span>
            </a>
            
            <div class="sub-actions">
              <button type="button" class="btn-secondary" (click)="resetForm()">Register Another Student</button>
              <a routerLink="/" class="btn-secondary">Return to Studio Website</a>
            </div>
          </div>
        </div>
      } @else {
        <!-- STREAMLINED APPLICATION FORM -->
        <div class="form-card">
          @if (error()) {
            <div class="alert-error">
              <span class="alert-dot"></span>
              <span>{{ error() }}</span>
            </div>
          }

          <form [formGroup]="regForm" (ngSubmit)="onSubmit()" novalidate>
            <!-- SECTION 1: PROGRAM & SCHEDULE -->
            <div class="form-section">
              <div class="section-header">
                <span class="section-num">01</span>
                <div>
                  <h3 class="section-title">Program &amp; Schedule</h3>
                  <p class="section-sub">Choose your academy course and preferred studio timing.</p>
                </div>
              </div>

              <!-- COURSE SELECTOR -->
              <div class="field-block">
                <label class="field-label">Select Course <span class="req">*</span></label>
                <div class="course-grid">
                  @for (c of courses(); track c.id) {
                    <div
                      class="course-card"
                      [class.active]="f['courseId'].value === c.id"
                      (click)="selectCourse(c.id)">
                      <div class="course-card-top">
                        <span class="course-badge">{{ c.duration }}</span>
                        <span class="course-mode">{{ c.mode === 'offline' ? 'Offline Studio' : 'Hybrid' }}</span>
                      </div>
                      <div class="course-title">{{ c.title }}</div>
                      <div class="course-desc">{{ c.description }}</div>
                    </div>
                  }
                </div>
                @if (f['courseId'].touched && f['courseId'].invalid) {
                  <span class="error-msg">Please select a course</span>
                }
              </div>

              <!-- PREFERRED BATCH -->
              <div class="field-block mt-5">
                <label class="field-label">Preferred Batch Timing <span class="req">*</span></label>
                <div class="batch-grid">
                  <div
                    class="batch-tile"
                    [class.active]="f['preferredBatch'].value === 'Weekday Evening (6:30 PM - 10:00 PM)'"
                    (click)="selectBatch('Weekday Evening (6:30 PM - 10:00 PM)')">
                    <div class="batch-radio"></div>
                    <div>
                      <div class="batch-name">Weekday Evening Batch</div>
                      <div class="batch-time">Monday – Friday · 6:30 PM – 10:00 PM</div>
                    </div>
                  </div>

                  <div
                    class="batch-tile"
                    [class.active]="f['preferredBatch'].value === 'Sunday Intensive (11:00 AM - 8:00 PM)'"
                    (click)="selectBatch('Sunday Intensive (11:00 AM - 8:00 PM)')">
                    <div class="batch-radio"></div>
                    <div>
                      <div class="batch-name">Sunday Intensive Batch</div>
                      <div class="batch-time">Every Sunday · 11:00 AM – 8:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 2: PERSONAL & BACKGROUND -->
            <div class="form-section">
              <div class="section-header">
                <span class="section-num">02</span>
                <div>
                  <h3 class="section-title">Candidate Details</h3>
                  <p class="section-sub">Your personal contact details and current background.</p>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="field-block">
                  <label class="field-label">Full Name <span class="req">*</span></label>
                  <input formControlName="fullName" type="text" placeholder="e.g. Siddhant Shelke" class="text-input" [class.input-error]="f['fullName'].touched && f['fullName'].invalid">
                  @if (f['fullName'].touched && f['fullName'].invalid) {
                    <span class="error-msg">Please enter your full name (minimum 2 characters)</span>
                  }
                </div>

                <div class="field-block">
                  <label class="field-label">Email Address <span class="req">*</span></label>
                  <input formControlName="email" type="email" placeholder="name@domain.com" class="text-input" [class.input-error]="f['email'].touched && f['email'].invalid">
                  @if (f['email'].touched && f['email'].invalid) {
                    <span class="error-msg">Valid email address is required</span>
                  }
                </div>
              </div>

              <div class="form-grid-2 mt-4">
                <div class="field-block">
                  <label class="field-label">Phone Number <span class="req">*</span></label>
                  <input formControlName="phone" type="tel" placeholder="+91 98765 43210" class="text-input" [class.input-error]="f['phone'].touched && f['phone'].invalid">
                  @if (f['phone'].touched && f['phone'].invalid) {
                    <span class="error-msg">Valid phone number is required</span>
                  }
                </div>

                <div class="field-block">
                  <div class="flex-between">
                    <label class="field-label">WhatsApp Number</label>
                    <button type="button" class="btn-copy-phone" (click)="copyPhoneToWhatsApp()">Same as phone</button>
                  </div>
                  <input formControlName="whatsappNumber" type="tel" placeholder="+91 98765 43210" class="text-input">
                </div>
              </div>

              <div class="form-grid-2 mt-4">
                <div class="field-block">
                  <label class="field-label">Current City</label>
                  <input formControlName="city" type="text" placeholder="e.g. Pune / Mumbai / International" class="text-input">
                </div>

                <div class="field-block">
                  <label class="field-label">Portfolio / Behance / LinkedIn (Optional)</label>
                  <input formControlName="portfolioLink" type="url" placeholder="https://..." class="text-input">
                </div>
              </div>

              <!-- OCCUPATION SELECTOR -->
              <div class="field-block mt-5">
                <label class="field-label">Current Profile <span class="req">*</span></label>
                <div class="pill-selector">
                  <button
                    type="button"
                    class="pill-btn"
                    [class.active]="f['occupation'].value === 'student'"
                    (click)="selectOccupation('student')">
                    Student
                  </button>
                  <button
                    type="button"
                    class="pill-btn"
                    [class.active]="f['occupation'].value === 'working'"
                    (click)="selectOccupation('working')">
                    Working Professional
                  </button>
                  <button
                    type="button"
                    class="pill-btn"
                    [class.active]="f['occupation'].value === 'freelancer'"
                    (click)="selectOccupation('freelancer')">
                    Freelancer / Designer
                  </button>
                  <button
                    type="button"
                    class="pill-btn"
                    [class.active]="f['occupation'].value === 'other'"
                    (click)="selectOccupation('other')">
                    Other Enthusiast
                  </button>
                </div>
              </div>

              <!-- CONDITIONAL SUB-FIELDS -->
              @if (f['occupation'].value === 'student') {
                <div class="sub-fields-box mt-4">
                  <div class="form-grid-2">
                    <div class="field-block">
                      <label class="field-label">College / University Name <span class="req">*</span></label>
                      <input formControlName="collegeName" type="text" placeholder="e.g. MIT Institute of Design, Pune" class="text-input" [class.input-error]="f['collegeName'].touched && f['collegeName'].invalid">
                      @if (f['collegeName'].touched && f['collegeName'].invalid) {
                        <span class="error-msg">College name is required</span>
                      }
                    </div>

                    <div class="field-block">
                      <label class="field-label">Degree / Branch <span class="req">*</span></label>
                      <input formControlName="degreeBranch" type="text" placeholder="e.g. B.Des Industrial Design" class="text-input" [class.input-error]="f['degreeBranch'].touched && f['degreeBranch'].invalid">
                      @if (f['degreeBranch'].touched && f['degreeBranch'].invalid) {
                        <span class="error-msg">Degree or department is required</span>
                      }
                    </div>
                  </div>

                  <div class="field-block mt-3">
                    <label class="field-label">Year of Study</label>
                    <select formControlName="yearOfStudy" class="text-input select-input">
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                </div>
              }

              @if (f['occupation'].value === 'working') {
                <div class="sub-fields-box mt-4">
                  <div class="form-grid-2">
                    <div class="field-block">
                      <label class="field-label">Company / Studio Name <span class="req">*</span></label>
                      <input formControlName="companyName" type="text" placeholder="e.g. Tata Motors / Mahindra" class="text-input" [class.input-error]="f['companyName'].touched && f['companyName'].invalid">
                      @if (f['companyName'].touched && f['companyName'].invalid) {
                        <span class="error-msg">Company name is required</span>
                      }
                    </div>

                    <div class="field-block">
                      <label class="field-label">Designation / Role <span class="req">*</span></label>
                      <input formControlName="jobTitle" type="text" placeholder="e.g. CAD Modeller / Product Designer" class="text-input" [class.input-error]="f['jobTitle'].touched && f['jobTitle'].invalid">
                      @if (f['jobTitle'].touched && f['jobTitle'].invalid) {
                        <span class="error-msg">Job title is required</span>
                      }
                    </div>
                  </div>

                  <div class="field-block mt-3">
                    <label class="field-label">Years of Experience</label>
                    <select formControlName="yearsExperience" class="text-input select-input">
                      <option value="0-1 years">0 – 1 years</option>
                      <option value="1-3 years">1 – 3 years</option>
                      <option value="3-5 years">3 – 5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>
              }

              @if (f['occupation'].value === 'freelancer' || f['occupation'].value === 'other') {
                <div class="sub-fields-box mt-4">
                  <div class="field-block">
                    <label class="field-label">Design Tools Known (Optional)</label>
                    <input formControlName="designTools" type="text" placeholder="e.g. Alias, Blender, Rhino, Photoshop" class="text-input">
                  </div>
                </div>
              }
            </div>

            <!-- SECTION 3: STATEMENT & SUBMIT -->
            <div class="form-section">
              <div class="section-header">
                <span class="section-num">03</span>
                <div>
                  <h3 class="section-title">Statement &amp; Submission</h3>
                  <p class="section-sub">Briefly share your motivation and submit your reservation.</p>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label">Why do you want to join 2NOMADS Academy? <span class="req">*</span></label>
                <textarea
                  formControlName="whyJoin"
                  rows="3"
                  placeholder="Tell us what you hope to build, sculpt, or learn, your passion for transportation design, and your career goals..."
                  class="text-input textarea-input"
                  [class.input-error]="f['whyJoin'].touched && f['whyJoin'].invalid"></textarea>
                @if (f['whyJoin'].touched && f['whyJoin'].invalid) {
                  <span class="error-msg">Please write at least 10 characters explaining your interest</span>
                }
              </div>

              <div class="field-block mt-4">
                <label class="field-label">Special Requests or Accommodation Notes (Optional)</label>
                <input
                  formControlName="additionalNotes"
                  type="text"
                  placeholder="e.g. Outstation accommodation in Pune, prior clay tool experience..."
                  class="text-input">
              </div>

              <!-- SUBMIT BUTTON -->
              <div class="submit-wrap mt-8">
                <button type="submit" class="btn-submit" [disabled]="loading()">
                  @if (loading()) {
                    <span class="spinner"></span>
                    <span>Submitting Application...</span>
                  } @else {
                    <span>Submit Season 01 Application →</span>
                  }
                </button>
                <div class="privacy-note">
                  🔒 Your details are reviewed strictly by 2NOMADS studio mentors. No spam.
                </div>
              </div>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .registration-container {
      width: 100%;
      max-width: 860px;
      margin: 0 auto;
      font-family: 'Neurial Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f5f5f7;
    }

    /* FORM CARD */
    .form-card {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    }

    .form-section {
      padding-bottom: 36px;
      margin-bottom: 36px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .form-section:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }
    .section-num {
      font-size: 13px;
      font-weight: 700;
      color: #ff4d1c;
      background: rgba(255, 77, 28, 0.1);
      border: 1px solid rgba(255, 77, 28, 0.2);
      padding: 3px 10px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .section-sub {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    /* FIELDS */
    .field-block {
      display: flex;
      flex-direction: column;
    }
    .field-label {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 8px;
    }
    .req {
      color: #ff4d1c;
    }

    .text-input {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 14px;
      color: #ffffff;
      outline: none;
      transition: all 0.2s ease;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }
    .text-input:focus {
      border-color: #ff4d1c;
      box-shadow: 0 0 0 2px rgba(255, 77, 28, 0.2);
      background: #171820;
    }
    .text-input::placeholder {
      color: rgba(255, 255, 255, 0.28);
    }
    .input-error {
      border-color: #ef4444 !important;
    }
    .textarea-input {
      resize: vertical;
      min-height: 90px;
      line-height: 1.5;
    }
    .select-input {
      cursor: pointer;
    }

    .error-msg {
      font-size: 11px;
      color: #ef4444;
      margin-top: 5px;
      font-weight: 500;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .btn-copy-phone {
      background: none;
      border: none;
      color: #ff4d1c;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }
    .btn-copy-phone:hover {
      color: #ff6b3d;
    }

    /* COURSE GRID */
    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
    }
    .course-card {
      background: #131418;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .course-card:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: #17181f;
    }
    .course-card.active {
      border-color: #ff4d1c;
      background: rgba(255, 77, 28, 0.06);
      box-shadow: 0 0 16px rgba(255, 77, 28, 0.15);
    }
    .course-card-top {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }
    .course-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.7);
      padding: 3px 8px;
      border-radius: 4px;
    }
    .course-mode {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(255, 77, 28, 0.12);
      color: #ff4d1c;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .course-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
      margin-bottom: 6px;
    }
    .course-desc {
      font-size: 12px;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.5);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* BATCH TILES */
    .batch-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .batch-tile {
      background: #131418;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 14px;
      transition: all 0.2s ease;
    }
    .batch-tile:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }
    .batch-tile.active {
      border-color: #ff4d1c;
      background: rgba(255, 77, 28, 0.06);
    }
    .batch-radio {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .batch-tile.active .batch-radio {
      border-color: #ff4d1c;
      background: #ff4d1c;
      box-shadow: inset 0 0 0 3px #131418;
    }
    .batch-name {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .batch-time {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    /* PILL SELECTOR */
    .pill-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .pill-btn {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .pill-btn:hover {
      border-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    .pill-btn.active {
      background: #ff4d1c;
      border-color: #ff4d1c;
      color: #ffffff;
    }

    .sub-fields-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 16px;
    }

    /* SUBMIT WRAP */
    .submit-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #ff5722 0%, #ff3b00 100%);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 16px 28px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s ease;
      box-shadow: 0 10px 30px rgba(255, 77, 28, 0.35);
      font-family: inherit;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(255, 77, 28, 0.5);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .privacy-note {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      text-align: center;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 12px 16px;
      color: #fca5a5;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
    }
    .alert-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      flex-shrink: 0;
    }

    /* SUCCESS SCREEN */
    .success-card {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 48px 40px;
      text-align: center;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    }
    .success-icon-wrap {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .success-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #ff4d1c;
      background: rgba(255, 77, 28, 0.1);
      border: 1px solid rgba(255, 77, 28, 0.2);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .success-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin: 0 0 10px;
    }
    .success-text {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.65);
      max-width: 540px;
      margin: 0 auto 32px;
    }

    .receipt-box {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
      max-width: 540px;
      margin: 0 auto 32px;
      text-align: left;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 13px;
    }
    .receipt-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .r-label {
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
    }
    .r-val {
      color: #ffffff;
      font-weight: 600;
      text-align: right;
    }
    .r-code {
      font-family: 'JetBrains Mono', monospace;
      color: #ff4d1c;
    }
    .r-highlight {
      color: #ff4d1c;
    }

    .onboarding-steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 540px;
      margin: 0 auto 32px;
      text-align: left;
    }
    .ob-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 12px 16px;
    }
    .ob-num {
      font-size: 12px;
      font-weight: 700;
      color: #ff4d1c;
      font-family: 'JetBrains Mono', monospace;
    }
    .ob-title {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .ob-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.4;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      max-width: 540px;
      margin: 0 auto;
    }
    .btn-wa {
      width: 100%;
      background: #22c55e;
      color: #ffffff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 24px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
      transition: all 0.2s ease;
    }
    .btn-wa:hover {
      background: #16a34a;
      box-shadow: 0 12px 30px rgba(34, 197, 94, 0.45);
      transform: translateY(-2px);
    }
    .sub-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      font-weight: 600;
      padding: 8px 18px;
      border-radius: 9999px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.12);
    }

    /* RESPONSIVE */
    @media (max-width: 640px) {
      .form-card, .success-card {
        padding: 24px 18px;
      }
      .form-grid-2, .batch-grid {
        grid-template-columns: 1fr;
      }
      .section-title {
        font-size: 18px;
      }
    }
  `],
})
export class RegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>(DEFAULT_COURSES);
  loading = signal(false);
  success = signal(false);
  successName = signal('');
  successCourse = signal('');
  successBatch = signal('');
  confirmationRef = signal('');
  error = signal<string | null>(null);

  regForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    whatsappNumber: [''],
    city: [''],
    courseId: [DEFAULT_COURSES[0].id, Validators.required],
    occupation: ['student', Validators.required],
    collegeName: [''],
    degreeBranch: [''],
    yearOfStudy: ['2nd Year'],
    companyName: [''],
    jobTitle: [''],
    yearsExperience: ['1-3 years'],
    designTools: [''],
    portfolioLink: [''],
    whyJoin: ['', [Validators.required, Validators.minLength(10)]],
    preferredBatch: ['Weekday Evening (6:30 PM - 10:00 PM)', Validators.required],
    additionalNotes: [''],
  });

  get f() {
    return this.regForm.controls;
  }

  ngOnInit(): void {
    this.loadCourses();

    this.f['occupation'].valueChanges.subscribe((occ) => {
      if (occ === 'student') {
        this.f['collegeName'].setValidators([Validators.required]);
        this.f['degreeBranch'].setValidators([Validators.required]);
        this.f['companyName'].clearValidators();
        this.f['jobTitle'].clearValidators();
      } else if (occ === 'working') {
        this.f['companyName'].setValidators([Validators.required]);
        this.f['jobTitle'].setValidators([Validators.required]);
        this.f['collegeName'].clearValidators();
        this.f['degreeBranch'].clearValidators();
      } else {
        this.f['collegeName'].clearValidators();
        this.f['degreeBranch'].clearValidators();
        this.f['companyName'].clearValidators();
        this.f['jobTitle'].clearValidators();
      }
      this.f['collegeName'].updateValueAndValidity();
      this.f['degreeBranch'].updateValueAndValidity();
      this.f['companyName'].updateValueAndValidity();
      this.f['jobTitle'].updateValueAndValidity();
    });

    // Initialize validators for default 'student'
    this.f['collegeName'].setValidators([Validators.required]);
    this.f['degreeBranch'].setValidators([Validators.required]);
    this.f['collegeName'].updateValueAndValidity();
    this.f['degreeBranch'].updateValueAndValidity();
  }

  private loadCourses(): void {
    this.api.getCourses().subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.length > 0) {
          this.courses.set(res.data);
          const paramCourseId = this.route.snapshot.queryParamMap.get('courseId');
          if (paramCourseId) {
            const found = res.data.find((c) => c.id === paramCourseId || c.slug === paramCourseId);
            if (found) {
              this.regForm.patchValue({ courseId: found.id });
            }
          } else if (!this.regForm.get('courseId')?.value) {
            this.regForm.patchValue({ courseId: res.data[0].id });
          }
        }
      },
      error: () => {
        // Keeps DEFAULT_COURSES
      },
    });
  }

  selectCourse(courseId: string): void {
    this.regForm.patchValue({ courseId });
  }

  selectBatch(preferredBatch: string): void {
    this.regForm.patchValue({ preferredBatch });
  }

  selectOccupation(occupation: string): void {
    this.regForm.patchValue({ occupation });
  }

  copyPhoneToWhatsApp(): void {
    const ph = this.regForm.get('phone')?.value;
    if (ph) {
      this.regForm.patchValue({ whatsappNumber: ph });
    }
  }

  onSubmit(): void {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      this.error.set('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const val = this.regForm.value;
    const selectedCourse = this.courses().find((c) => c.id === val.courseId);

    const payload: StudentRegistrationPayload = {
      fullName: val.fullName,
      email: val.email,
      phone: val.phone,
      whatsappNumber: val.whatsappNumber || null,
      courseId: val.courseId,
      city: val.city || null,
      occupation: val.occupation || null,
      collegeName: val.collegeName || null,
      degreeBranch: val.degreeBranch || null,
      yearOfStudy: val.yearOfStudy || null,
      companyName: val.companyName || null,
      jobTitle: val.jobTitle || null,
      yearsExperience: val.yearsExperience || null,
      designTools: val.designTools || null,
      portfolioLink: val.portfolioLink || null,
      preferredBatch: val.preferredBatch || null,
      whyJoin: val.whyJoin || null,
      notes: val.additionalNotes || null,
    };

    this.api.registerStudent(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set(true);
          this.successName.set(val.fullName);
          this.successCourse.set(selectedCourse?.title || 'Selected Course');
          this.successBatch.set(val.preferredBatch);
          const randNum = Math.floor(1000 + Math.random() * 9000);
          this.confirmationRef.set(`2NOMADS-S01-${randNum}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.error.set(res.message || 'Registration failed.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to submit registration. Please verify your details.');
      },
    });
  }

  resetForm(): void {
    this.success.set(false);
    this.error.set(null);
    this.regForm.reset({
      courseId: this.courses()[0]?.id,
      occupation: 'student',
      yearOfStudy: '2nd Year',
      yearsExperience: '1-3 years',
      preferredBatch: 'Weekday Evening (6:30 PM - 10:00 PM)',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
