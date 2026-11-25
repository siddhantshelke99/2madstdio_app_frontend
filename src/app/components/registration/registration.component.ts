import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/course.model';

const DEFAULT_COURSES: Course[] = [
  {
    id: '484296ae-092f-4095-844f-afd6b915d644',
    title: 'Master Classes Season 01: Concept to Prototype',
    slug: 'masterclasses-season-01',
    description: 'Take the real Oneaxi EV Scooter from concept sketch to 1:1 scale clay model, Class-A CAD, and running prototype.',
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
    description: 'Traditional styling tools, armatures, tape layout, surfacing, and highlight reading under studio neon.',
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
    <div class="registration-wizard-card">
      @if (success()) {
        <!-- SUCCESS / APPLICATION CONFIRMED SCREEN -->
        <div class="success-screen">
          <div class="success-icon-badge">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="success-header">
            <div class="success-kicker">Application Logged · Season 01</div>
            <h2 class="success-title">Welcome to 2NOMADS Academy!</h2>
            <p class="success-lead">
              Thank you, <strong>{{ successName() }}</strong>. Your seat reservation application for <strong>{{ successCourse() }}</strong> has been officially received.
            </p>
          </div>

          <!-- CONFIRMATION SUMMARY CARD -->
          <div class="confirmation-details-card">
            <div class="conf-row">
              <span class="conf-label">Reference ID</span>
              <span class="conf-val code-font">{{ confirmationRef() }}</span>
            </div>
            <div class="conf-row">
              <span class="conf-label">Selected Course</span>
              <span class="conf-val accent-val">{{ successCourse() }}</span>
            </div>
            <div class="conf-row">
              <span class="conf-label">Batch Preference</span>
              <span class="conf-val">{{ successBatch() }}</span>
            </div>
            <div class="conf-row">
              <span class="conf-label">Location</span>
              <span class="conf-val">2NOMADS Studio · Bhosari, Pune</span>
            </div>
          </div>

          <!-- NEXT STEPS TIMELINE -->
          <div class="next-steps-wrap">
            <div class="next-steps-title">What happens next:</div>
            <div class="timeline-list">
              <div class="tl-item">
                <div class="tl-num">1</div>
                <div>
                  <div class="tl-heading">Instant Confirmation Dispatched</div>
                  <div class="tl-desc">Automated alerts with your syllabus and onboarding brief have been sent to your Email &amp; WhatsApp.</div>
                </div>
              </div>
              <div class="tl-item">
                <div class="tl-num">2</div>
                <div>
                  <div class="tl-heading">Admissions &amp; Bench Allocation</div>
                  <div class="tl-desc">Our design faculty reviews portfolio details and contacts you within 24 hours to confirm bench schedule.</div>
                </div>
              </div>
              <div class="tl-item">
                <div class="tl-num">3</div>
                <div>
                  <div class="tl-heading">Studio Walkthrough &amp; Armature Prep</div>
                  <div class="tl-desc">Visit the Bhosari studio to inspect the 1:1 clay model armatures and meet the senior mentors.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ACTIONS -->
          <div class="success-actions">
            <a
              [href]="'https://wa.me/919158228037?text=Hello%202NOMADS!%20I%20have%20submitted%20my%20application%20(' + confirmationRef() + ')%20for%20' + successCourse() + '.'"
              target="_blank"
              rel="noopener"
              class="btn-whatsapp-chat">
              <span>💬 Verify Seat with Admissions on WhatsApp</span>
            </a>
            
            <div class="sub-actions">
              <button type="button" class="btn-ghost" (click)="resetForm()">Register Another Candidate</button>
              <a routerLink="/" class="btn-ghost">Return to Studio Website →</a>
            </div>
          </div>
        </div>
      } @else {
        <!-- STEPPER PROGRESS HEADER -->
        <div class="wizard-header">
          <div class="wizard-title-bar">
            <div>
              <div class="wizard-kicker">Candidate Admissions · Season 01</div>
              <h2 class="wizard-title">Studio Registration</h2>
            </div>
            <div class="step-counter-pill">
              Step {{ currentStep() }} of 3
            </div>
          </div>

          <!-- STEP NAVIGATION TABS -->
          <div class="stepper-nav">
            <button
              type="button"
              class="step-tab"
              [class.active]="currentStep() === 1"
              [class.completed]="currentStep() > 1"
              (click)="goToStep(1)">
              <div class="tab-indicator">
                @if (currentStep() > 1) {
                  <span>✓</span>
                } @else {
                  <span>01</span>
                }
              </div>
              <div class="tab-text">
                <div class="tab-label">Candidate &amp; Course</div>
                <div class="tab-sub">Personal Details</div>
              </div>
            </button>

            <div class="stepper-connector" [class.active]="currentStep() >= 2"></div>

            <button
              type="button"
              class="step-tab"
              [class.active]="currentStep() === 2"
              [class.completed]="currentStep() > 2"
              (click)="goToStep(2)">
              <div class="tab-indicator">
                @if (currentStep() > 2) {
                  <span>✓</span>
                } @else {
                  <span>02</span>
                }
              </div>
              <div class="tab-text">
                <div class="tab-label">Background &amp; Profile</div>
                <div class="tab-sub">Academic / Work</div>
              </div>
            </button>

            <div class="stepper-connector" [class.active]="currentStep() >= 3"></div>

            <button
              type="button"
              class="step-tab"
              [class.active]="currentStep() === 3"
              (click)="goToStep(3)">
              <div class="tab-indicator">
                <span>03</span>
              </div>
              <div class="tab-text">
                <div class="tab-label">Motivation &amp; Batch</div>
                <div class="tab-sub">Statement &amp; Review</div>
              </div>
            </button>
          </div>

          <!-- PROGRESS BAR LINE -->
          <div class="progress-track">
            <div class="progress-bar-fill" [style.width]="progressPercent() + '%'"></div>
          </div>
        </div>

        @if (error()) {
          <div class="alert-box alert-danger">
            <div class="alert-icon">!</div>
            <div>
              <strong class="alert-heading">Application Incomplete</strong>
              <p class="alert-text">{{ error() }}</p>
            </div>
          </div>
        }

        <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="wizard-form">
          <!-- ============================================================
               STEP 1: CANDIDATE INFO & COURSE SELECTION
               ============================================================ -->
          @if (currentStep() === 1) {
            <div class="step-panel step-fade-in">
              <div class="panel-intro">
                <h3 class="panel-heading">Select Your Program &amp; Personal Info</h3>
                <p class="panel-sub">Choose which specialized studio program you wish to join at 2NOMADS Academy.</p>
              </div>

              <!-- COURSE SELECTOR CARDS -->
              <div class="form-group-wrap">
                <label class="input-label mb-2">Select Academy Course <span class="req">*</span></label>
                <div class="course-cards-grid">
                  @for (c of courses(); track c.id) {
                    <div
                      class="course-select-card"
                      [class.selected]="f['courseId'].value === c.id"
                      (click)="selectCourse(c.id)">
                      <div class="card-radio-dot"></div>
                      <div class="card-body">
                        <div class="card-badges">
                          <span class="duration-badge">{{ c.duration }}</span>
                          <span class="mode-badge">{{ c.mode === 'offline' ? 'Offline Studio' : 'Hybrid' }}</span>
                        </div>
                        <div class="course-name">{{ c.title }}</div>
                        <div class="course-desc-brief">{{ c.description | slice:0:80 }}...</div>
                      </div>
                    </div>
                  }
                </div>
                @if (f['courseId'].touched && f['courseId'].invalid) {
                  <span class="field-error">Please select a course to proceed</span>
                }
              </div>

              <!-- PERSONAL CONTACT INFORMATION -->
              <div class="form-group-wrap mt-4">
                <div class="grid-2">
                  <label class="input-label">Full Name <span class="req">*</span>
                    <div class="input-wrapper">
                      <input formControlName="fullName" placeholder="e.g. Rahul Sharma" autocomplete="name">
                    </div>
                    @if (f['fullName'].touched && f['fullName'].invalid) {
                      <span class="field-error">Please provide your full name (minimum 2 letters)</span>
                    }
                  </label>

                  <label class="input-label">Email Address <span class="req">*</span>
                    <div class="input-wrapper">
                      <input formControlName="email" type="email" placeholder="rahul@example.com" autocomplete="email">
                    </div>
                    @if (f['email'].touched && f['email'].invalid) {
                      <span class="field-error">A valid email address is required</span>
                    }
                  </label>
                </div>

                <div class="grid-2">
                  <label class="input-label">Phone Number <span class="req">*</span>
                    <div class="input-wrapper">
                      <input formControlName="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel">
                    </div>
                    @if (f['phone'].touched && f['phone'].invalid) {
                      <span class="field-error">A valid phone number is required</span>
                    }
                  </label>

                  <div>
                    <label class="input-label">WhatsApp Number
                      <div class="input-wrapper">
                        <input formControlName="whatsappNumber" type="tel" placeholder="+91 98765 43210">
                      </div>
                    </label>
                    <button type="button" class="btn-sync-phone" (click)="copyPhoneToWhatsApp()">
                      ⚡ Same as phone number
                    </button>
                  </div>
                </div>

                <div class="grid-1">
                  <label class="input-label">Current City / Location
                    <div class="input-wrapper">
                      <input formControlName="city" placeholder="e.g. Pune / Mumbai / Bangalore / International">
                    </div>
                  </label>
                </div>
              </div>

              <!-- STEP 1 ACTION FOOTER -->
              <div class="wizard-actions">
                <div></div>
                <button type="button" class="btn-wizard-next" (click)="nextStep()">
                  <span>Continue to Background (Step 2) →</span>
                </button>
              </div>
            </div>
          }

          <!-- ============================================================
               STEP 2: BACKGROUND & OCCUPATION PROFILE
               ============================================================ -->
          @if (currentStep() === 2) {
            <div class="step-panel step-fade-in">
              <div class="panel-intro">
                <h3 class="panel-heading">Current Background &amp; Profile</h3>
                <p class="panel-sub">Help our mentors understand your experience and tailor your bench curriculum.</p>
              </div>

              <!-- OCCUPATION SELECTOR CARDS -->
              <div class="form-group-wrap">
                <label class="input-label mb-2">Current Occupation <span class="req">*</span></label>
                <div class="occupation-grid">
                  <div
                    class="occ-card"
                    [class.selected]="f['occupation'].value === 'student'"
                    (click)="selectOccupation('student')">
                    <div class="occ-icon">🎓</div>
                    <div class="occ-title">College Student</div>
                    <div class="occ-sub">Undergrad / Postgrad / Design &amp; Eng</div>
                  </div>

                  <div
                    class="occ-card"
                    [class.selected]="f['occupation'].value === 'working'"
                    (click)="selectOccupation('working')">
                    <div class="occ-icon">💼</div>
                    <div class="occ-title">Working Professional</div>
                    <div class="occ-sub">OEM / Studio / CAD / Engineering</div>
                  </div>

                  <div
                    class="occ-card"
                    [class.selected]="f['occupation'].value === 'freelancer'"
                    (click)="selectOccupation('freelancer')">
                    <div class="occ-icon">🎨</div>
                    <div class="occ-title">Freelancer / Independent</div>
                    <div class="occ-sub">3D Modeller / Concept Artist</div>
                  </div>

                  <div
                    class="occ-card"
                    [class.selected]="f['occupation'].value === 'other'"
                    (click)="selectOccupation('other')">
                    <div class="occ-icon">⚡</div>
                    <div class="occ-title">Other Enthusiast</div>
                    <div class="occ-sub">Career Transition / Self-Taught</div>
                  </div>
                </div>
              </div>

              <!-- CONDITIONAL: STUDENT FORM -->
              @if (f['occupation'].value === 'student') {
                <div class="conditional-card">
                  <div class="cond-card-header">
                    <span class="cond-badge">Student Details</span>
                    <span class="cond-sub">Academic Information</span>
                  </div>

                  <div class="grid-2">
                    <label class="input-label">College / University Name <span class="req">*</span>
                      <div class="input-wrapper">
                        <input formControlName="collegeName" placeholder="e.g. MIT Institute of Design, Pune">
                      </div>
                      @if (f['collegeName'].touched && f['collegeName'].invalid) {
                        <span class="field-error">Please enter your college name</span>
                      }
                    </label>

                    <label class="input-label">Degree &amp; Department / Branch <span class="req">*</span>
                      <div class="input-wrapper">
                        <input formControlName="degreeBranch" placeholder="e.g. B.Des Industrial Design / B.Tech Mechanical">
                      </div>
                      @if (f['degreeBranch'].touched && f['degreeBranch'].invalid) {
                        <span class="field-error">Please enter your degree or branch</span>
                      }
                    </label>
                  </div>

                  <div class="grid-1">
                    <label class="input-label">Year of Study
                      <div class="input-wrapper">
                        <select formControlName="yearOfStudy">
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="Final Year">Final Year</option>
                          <option value="Recent Graduate">Recent Graduate</option>
                        </select>
                      </div>
                    </label>
                  </div>
                </div>
              }

              <!-- CONDITIONAL: WORKING PROFESSIONAL -->
              @if (f['occupation'].value === 'working') {
                <div class="conditional-card">
                  <div class="cond-card-header">
                    <span class="cond-badge">Professional Details</span>
                    <span class="cond-sub">Industry &amp; Company</span>
                  </div>

                  <div class="grid-2">
                    <label class="input-label">Company / Studio Name <span class="req">*</span>
                      <div class="input-wrapper">
                        <input formControlName="companyName" placeholder="e.g. Tata Motors / Mahindra / Design Studio">
                      </div>
                      @if (f['companyName'].touched && f['companyName'].invalid) {
                        <span class="field-error">Please enter your current employer or studio</span>
                      }
                    </label>

                    <label class="input-label">Job Title / Designation <span class="req">*</span>
                      <div class="input-wrapper">
                        <input formControlName="jobTitle" placeholder="e.g. CAD Modeller / Product Designer / Engineer">
                      </div>
                      @if (f['jobTitle'].touched && f['jobTitle'].invalid) {
                        <span class="field-error">Please mention your job designation</span>
                      }
                    </label>
                  </div>

                  <div class="grid-1">
                    <label class="input-label">Years of Experience
                      <div class="input-wrapper">
                        <select formControlName="yearsExperience">
                          <option value="0-1 years">0 – 1 years</option>
                          <option value="1-3 years">1 – 3 years</option>
                          <option value="3-5 years">3 – 5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select>
                      </div>
                    </label>
                  </div>
                </div>
              }

              <!-- CONDITIONAL: FREELANCER -->
              @if (f['occupation'].value === 'freelancer') {
                <div class="conditional-card">
                  <div class="cond-card-header">
                    <span class="cond-badge">Freelance &amp; Tools</span>
                    <span class="cond-sub">Portfolio Links</span>
                  </div>

                  <div class="grid-2">
                    <label class="input-label">Design &amp; CAD Tools Known
                      <div class="input-wrapper">
                        <input formControlName="designTools" placeholder="e.g. Autodesk Alias, Blender, Rhino, Photoshop">
                      </div>
                    </label>

                    <label class="input-label">Portfolio / Behance / LinkedIn URL
                      <div class="input-wrapper">
                        <input formControlName="portfolioLink" placeholder="https://behance.net/username">
                      </div>
                    </label>
                  </div>
                </div>
              }

              <!-- STEP 2 ACTION FOOTER -->
              <div class="wizard-actions">
                <button type="button" class="btn-wizard-prev" (click)="prevStep()">
                  <span>← Back to Details</span>
                </button>
                <button type="button" class="btn-wizard-next" (click)="nextStep()">
                  <span>Continue to Motivation (Step 3) →</span>
                </button>
              </div>
            </div>
          }

          <!-- ============================================================
               STEP 3: MOTIVATION, BATCH PREFERENCE & SUBMISSION
               ============================================================ -->
          @if (currentStep() === 3) {
            <div class="step-panel step-fade-in">
              <div class="panel-intro">
                <h3 class="panel-heading">Statement of Purpose &amp; Batch</h3>
                <p class="panel-sub">Share what drives your passion for automotive styling and pick your preferred time slot.</p>
              </div>

              <!-- MOTIVATION ESSAY -->
              <div class="form-group-wrap">
                <label class="input-label">Why do you want to join 2NOMADS Academy? <span class="req">*</span>
                  <div class="prompt-chips">
                    <span class="prompt-label">💡 Mentors look for:</span>
                    <span class="prompt-chip">Motorcycle/Vehicle passion</span>
                    <span class="prompt-chip">Hands-on clay sculpting goals</span>
                    <span class="prompt-chip">Career aspiration in OEM studios</span>
                  </div>
                  <div class="input-wrapper mt-2">
                    <textarea
                      formControlName="whyJoin"
                      rows="4"
                      placeholder="Tell us what you hope to build, sculpt, or learn, your passion for transportation design, and your career goals..."></textarea>
                  </div>
                  @if (f['whyJoin'].touched && f['whyJoin'].invalid) {
                    <span class="field-error">Please share a few sentences explaining why you wish to join</span>
                  }
                </label>
              </div>

              <!-- BATCH SELECTION CARDS -->
              <div class="form-group-wrap mt-4">
                <label class="input-label mb-2">Preferred Batch Timing <span class="req">*</span></label>
                <div class="batch-cards-grid">
                  <div
                    class="batch-card"
                    [class.selected]="f['preferredBatch'].value === 'Evening (Mon-Fri 6:30–10:00 PM)'"
                    (click)="selectBatch('Evening (Mon-Fri 6:30–10:00 PM)')">
                    <div class="batch-radio-dot"></div>
                    <div>
                      <div class="batch-title">Weekday Evening Batch</div>
                      <div class="batch-time">Monday – Friday · 6:30 PM – 10:00 PM</div>
                      <div class="batch-note">Designed so you never miss college lectures or day job duties.</div>
                    </div>
                  </div>

                  <div
                    class="batch-card"
                    [class.selected]="f['preferredBatch'].value === 'Sunday Intensive (11:00 AM–8:00 PM)'"
                    (click)="selectBatch('Sunday Intensive (11:00 AM–8:00 PM)')">
                    <div class="batch-radio-dot"></div>
                    <div>
                      <div class="batch-title">Sunday Intensive Batch</div>
                      <div class="batch-time">Every Sunday · 11:00 AM – 8:00 PM</div>
                      <div class="batch-note">Comprehensive 8-hour weekend studio immersion on physical benches.</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ADDITIONAL NOTES -->
              <div class="form-group-wrap mt-3">
                <label class="input-label">Any Questions or Special Requests (Optional)
                  <div class="input-wrapper">
                    <input formControlName="additionalNotes" placeholder="Hostel/stay accommodation in Pune, prior clay tool experience, portfolio review...">
                  </div>
                </label>
              </div>

              <!-- LIVE APPLICATION SUMMARY REVIEW CARD -->
              <div class="review-summary-card mt-4">
                <div class="review-title">Application Summary Review</div>
                <div class="review-grid">
                  <div>
                    <span class="rev-label">Applicant</span>
                    <span class="rev-val">{{ f['fullName'].value || 'Candidate' }}</span>
                  </div>
                  <div>
                    <span class="rev-label">Selected Course</span>
                    <span class="rev-val accent-val">{{ selectedCourseTitle() }}</span>
                  </div>
                  <div>
                    <span class="rev-label">Batch Slot</span>
                    <span class="rev-val">{{ f['preferredBatch'].value }}</span>
                  </div>
                </div>
              </div>

              <!-- STEP 3 ACTION FOOTER -->
              <div class="wizard-actions">
                <button type="button" class="btn-wizard-prev" (click)="prevStep()">
                  <span>← Back to Profile</span>
                </button>
                <button type="submit" class="btn-wizard-submit" [disabled]="loading()">
                  @if (loading()) {
                    <span class="submit-loading-spin"></span>
                    <span>Submitting Application...</span>
                  } @else {
                    <span>Submit Season 01 Application →</span>
                  }
                </button>
              </div>
            </div>
          }
        </form>
      }
    </div>
  `,
  styles: [`
    .registration-wizard-card {
      background: rgba(14, 15, 19, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 36px 36px 40px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      color: #f5f5f7;
      box-sizing: border-box;
    }

    @media (max-width: 640px) {
      .registration-wizard-card {
        padding: 24px 18px 28px;
      }
    }

    /* WIZARD HEADER & STEPPER */
    .wizard-header {
      margin-bottom: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 22px;
    }

    .wizard-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }

    .wizard-kicker {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent, #ff4d1c);
      margin-bottom: 6px;
    }

    .wizard-title {
      font-family: var(--display, 'Plus Jakarta Sans', sans-serif);
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin: 0;
    }

    .step-counter-pill {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      padding: 6px 14px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    /* STEP NAVIGATION TABS */
    .stepper-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 18px;
    }

    .step-tab {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 4px;
      text-align: left;
      transition: all 0.2s ease;
      flex: 1;
    }

    .tab-indicator {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      transition: all 0.25s ease;
      flex-shrink: 0;
    }

    .step-tab.active .tab-indicator {
      background: var(--accent, #ff4d1c);
      border-color: var(--accent, #ff4d1c);
      color: #ffffff;
      box-shadow: 0 0 14px rgba(255, 77, 28, 0.5);
    }

    .step-tab.completed .tab-indicator {
      background: #22c55e;
      border-color: #22c55e;
      color: #ffffff;
    }

    .tab-label {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      transition: color 0.2s;
    }
    .step-tab.active .tab-label {
      color: #ffffff;
    }
    .tab-sub {
      font-size: 10.5px;
      color: rgba(255, 255, 255, 0.35);
    }

    .stepper-connector {
      height: 2px;
      width: 20px;
      background: rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
      transition: background 0.25s;
    }
    .stepper-connector.active {
      background: var(--accent, #ff4d1c);
    }

    @media (max-width: 640px) {
      .tab-text {
        display: none;
      }
      .tab-indicator {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }
    }

    /* PROGRESS TRACK */
    .progress-track {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff4d1c 0%, #ff8c42 100%);
      box-shadow: 0 0 10px rgba(255, 77, 28, 0.6);
      transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* STEP PANEL */
    .step-fade-in {
      animation: fadeInPanel 0.3s ease-out;
    }
    @keyframes fadeInPanel {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .panel-intro {
      margin-bottom: 22px;
    }
    .panel-heading {
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px;
    }
    .panel-sub {
      font-size: 13px;
      color: rgba(245, 245, 247, 0.6);
      margin: 0;
    }

    /* COURSE CARDS GRID */
    .course-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
      margin-top: 6px;
    }

    .course-select-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 14px;
      background: rgba(9, 9, 11, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .course-select-card:hover {
      background: rgba(255, 77, 28, 0.06);
      border-color: rgba(255, 77, 28, 0.4);
      transform: translateY(-1px);
    }
    .course-select-card.selected {
      background: rgba(255, 77, 28, 0.12);
      border-color: var(--accent, #ff4d1c);
      box-shadow: 0 4px 20px rgba(255, 77, 28, 0.25);
    }

    .card-radio-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      margin-top: 3px;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .course-select-card.selected .card-radio-dot {
      border-color: var(--accent, #ff4d1c);
      background: var(--accent, #ff4d1c);
      box-shadow: 0 0 8px rgba(255, 77, 28, 0.8);
    }

    .card-body {
      flex: 1;
    }
    .card-badges {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }
    .duration-badge {
      font-size: 10px;
      font-weight: 700;
      color: #ff8c42;
      background: rgba(255, 77, 28, 0.15);
      border: 1px solid rgba(255, 77, 28, 0.3);
      padding: 2px 7px;
      border-radius: 9999px;
    }
    .mode-badge {
      font-size: 10px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.65);
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 7px;
      border-radius: 9999px;
    }
    .course-name {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
      margin-bottom: 4px;
    }
    .course-desc-brief {
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.4;
    }

    /* INPUTS & LABELS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 14px;
    }
    .grid-1 {
      margin-bottom: 14px;
    }

    @media (max-width: 600px) {
      .grid-2 {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    .input-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: rgba(245, 245, 247, 0.8);
      letter-spacing: 0.02em;
    }
    .req {
      color: var(--accent, #ff4d1c);
      font-weight: bold;
    }

    .input-wrapper {
      margin-top: 6px;
    }

    input, select, textarea {
      width: 100%;
      background: #090a0d;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #ffffff;
      padding: 12px 14px;
      font-family: var(--body, 'Plus Jakarta Sans', sans-serif);
      font-size: 13.5px;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--accent, #ff4d1c);
      background: #0c0d12;
      box-shadow: 0 0 0 3px rgba(255, 77, 28, 0.22);
    }

    .btn-sync-phone {
      background: none;
      border: none;
      color: var(--accent, #ff4d1c);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 0 0;
      transition: opacity 0.2s;
    }
    .btn-sync-phone:hover {
      text-decoration: underline;
    }

    .field-error {
      display: block;
      color: #f87171;
      font-size: 11px;
      font-weight: 500;
      margin-top: 4px;
    }

    /* OCCUPATION CARDS */
    .occupation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 6px;
    }

    .occ-card {
      padding: 18px 16px;
      background: rgba(9, 9, 11, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .occ-card:hover {
      background: rgba(255, 77, 28, 0.06);
      border-color: rgba(255, 77, 28, 0.35);
      transform: translateY(-1px);
    }
    .occ-card.selected {
      background: rgba(255, 77, 28, 0.12);
      border-color: var(--accent, #ff4d1c);
      box-shadow: 0 4px 18px rgba(255, 77, 28, 0.22);
    }

    .occ-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .occ-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 3px;
    }
    .occ-sub {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.35;
    }

    /* CONDITIONAL CARDS */
    .conditional-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 12px;
      padding: 20px;
      margin-top: 18px;
      animation: fadeInPanel 0.25s ease;
    }
    .cond-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .cond-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ff4d1c;
    }
    .cond-sub {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
    }

    /* PROMPT CHIPS */
    .prompt-chips {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
      margin-bottom: 2px;
    }
    .prompt-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
    }
    .prompt-chip {
      font-size: 10.5px;
      color: rgba(245, 245, 247, 0.7);
      background: rgba(255, 255, 255, 0.06);
      padding: 3px 8px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* BATCH CARDS */
    .batch-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
      margin-top: 6px;
    }
    .batch-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: rgba(9, 9, 11, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s;
    }
    .batch-card:hover {
      background: rgba(255, 77, 28, 0.06);
      border-color: rgba(255, 77, 28, 0.35);
    }
    .batch-card.selected {
      background: rgba(255, 77, 28, 0.12);
      border-color: var(--accent, #ff4d1c);
      box-shadow: 0 4px 18px rgba(255, 77, 28, 0.22);
    }
    .batch-radio-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      margin-top: 3px;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .batch-card.selected .batch-radio-dot {
      border-color: var(--accent, #ff4d1c);
      background: var(--accent, #ff4d1c);
      box-shadow: 0 0 8px rgba(255, 77, 28, 0.8);
    }
    .batch-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .batch-time {
      font-size: 12px;
      font-weight: 600;
      color: #ff8c42;
      margin-bottom: 4px;
    }
    .batch-note {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.35;
    }

    /* REVIEW SUMMARY CARD */
    .review-summary-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 16px;
    }
    .review-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 10px;
    }
    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }
    .rev-label {
      display: block;
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 2px;
    }
    .rev-val {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
    }
    .accent-val {
      color: #ff8c42;
    }

    /* WIZARD ACTIONS */
    .wizard-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .btn-wizard-prev {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.85);
      font-size: 12.5px;
      font-weight: 600;
      padding: 12px 22px;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-wizard-prev:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      transform: translateX(-2px);
    }

    .btn-wizard-next {
      background: var(--accent, #ff4d1c);
      border: 1px solid var(--accent, #ff4d1c);
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      padding: 13px 26px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(255, 77, 28, 0.35);
      transition: all 0.25s ease;
      margin-left: auto;
    }
    .btn-wizard-next:hover {
      background: #ff6538;
      box-shadow: 0 6px 24px rgba(255, 77, 28, 0.5);
      transform: translateY(-1px);
    }

    .btn-wizard-submit {
      background: linear-gradient(135deg, #ff4d1c 0%, #e63900 100%);
      border: none;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.06em;
      padding: 14px 32px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 8px 30px rgba(255, 77, 28, 0.45);
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .btn-wizard-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #ff6538 0%, #ff4d1c 100%);
      box-shadow: 0 10px 36px rgba(255, 77, 28, 0.6);
      transform: translateY(-1px);
    }
    .btn-wizard-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .submit-loading-spin {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ALERT BOX */
    .alert-box {
      display: flex;
      gap: 14px;
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    .alert-danger {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }
    .alert-icon {
      font-size: 18px;
      font-weight: 800;
    }
    .alert-heading {
      font-size: 13.5px;
      color: #ffffff;
      display: block;
      margin-bottom: 2px;
    }
    .alert-text {
      font-size: 12.5px;
      margin: 0;
      line-height: 1.45;
    }

    /* SUCCESS SCREEN */
    .success-screen {
      text-align: center;
      padding: 20px 0 10px;
      animation: fadeInPanel 0.4s ease-out;
    }
    .success-icon-badge {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      border: 2px solid #22c55e;
      color: #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
    }
    .success-kicker {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #22c55e;
      margin-bottom: 8px;
    }
    .success-title {
      font-family: var(--display, 'Plus Jakarta Sans', sans-serif);
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 10px;
    }
    .success-lead {
      font-size: 14.5px;
      line-height: 1.6;
      color: rgba(245, 245, 247, 0.75);
      max-width: 580px;
      margin: 0 auto 26px;
    }

    .confirmation-details-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 18px 24px;
      max-width: 540px;
      margin: 0 auto 28px;
      text-align: left;
    }
    .conf-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 13px;
    }
    .conf-row:last-child {
      border-bottom: none;
    }
    .conf-label {
      color: rgba(255, 255, 255, 0.5);
    }
    .conf-val {
      color: #ffffff;
      font-weight: 600;
      text-align: right;
    }
    .code-font {
      font-family: var(--font-mono, monospace);
      color: var(--accent, #ff4d1c);
      letter-spacing: 0.08em;
    }

    .next-steps-wrap {
      max-width: 540px;
      margin: 0 auto 30px;
      text-align: left;
    }
    .next-steps-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 14px;
    }
    .timeline-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .tl-item {
      display: flex;
      gap: 12px;
    }
    .tl-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255, 77, 28, 0.15);
      border: 1px solid rgba(255, 77, 28, 0.4);
      color: #ff8c42;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .tl-heading {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .tl-desc {
      font-size: 12px;
      color: rgba(245, 245, 247, 0.55);
      line-height: 1.45;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .btn-whatsapp-chat {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: #22c55e;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-decoration: none;
      border-radius: 9999px;
      box-shadow: 0 6px 24px rgba(34, 197, 94, 0.4);
      transition: all 0.2s ease;
    }
    .btn-whatsapp-chat:hover {
      background: #16a34a;
      transform: translateY(-1px);
    }

    .sub-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn-ghost {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 9999px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.12);
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

  // Stepper state (1: Personal & Course, 2: Profile & Background, 3: Motivation & Batch)
  currentStep = signal<1 | 2 | 3>(1);

  progressPercent = computed(() => {
    switch (this.currentStep()) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 33;
    }
  });

  selectedCourseTitle = computed(() => {
    const cId = this.regForm.get('courseId')?.value;
    const found = this.courses().find((c) => c.id === cId);
    return found ? `${found.title} (${found.duration})` : 'Select a course';
  });

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
    preferredBatch: ['Evening (Mon-Fri 6:30–10:00 PM)'],
    additionalNotes: [''],
  });

  get f() {
    return this.regForm.controls;
  }

  ngOnInit(): void {
    this.loadCourses();

    // Dynamically adjust conditional validators when occupation changes
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

    // Default student validators
    this.f['collegeName'].setValidators([Validators.required]);
    this.f['degreeBranch'].setValidators([Validators.required]);
  }

  loadCourses(): void {
    this.api.getCourses().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.courses.set(res.data);
          const cParam = this.route.snapshot.queryParams['course'];
          if (cParam) {
            const found = res.data.find((c) => c.slug === cParam || c.id === cParam);
            if (found) {
              this.regForm.patchValue({ courseId: found.id });
              return;
            }
          }
          if (!this.regForm.get('courseId')?.value) {
            this.regForm.patchValue({ courseId: res.data[0].id });
          }
        }
      },
      error: (err) => console.error('Failed to load courses:', err),
    });
  }

  selectCourse(courseId: string): void {
    this.regForm.patchValue({ courseId });
  }

  selectOccupation(occupation: string): void {
    this.regForm.patchValue({ occupation });
  }

  selectBatch(preferredBatch: string): void {
    this.regForm.patchValue({ preferredBatch });
  }

  copyPhoneToWhatsApp(): void {
    const ph = this.regForm.get('phone')?.value;
    if (ph) {
      this.regForm.patchValue({ whatsappNumber: ph });
    }
  }

  goToStep(step: 1 | 2 | 3): void {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
      this.scrollToTop();
      return;
    }
    if (this.currentStep() === 1 && step > 1) {
      if (!this.validateStep1()) return;
    }
    if (this.currentStep() === 2 && step > 2) {
      if (!this.validateStep2()) return;
    }
    this.currentStep.set(step);
    this.scrollToTop();
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      if (this.validateStep1()) {
        this.currentStep.set(2);
        this.scrollToTop();
      }
    } else if (this.currentStep() === 2) {
      if (this.validateStep2()) {
        this.currentStep.set(3);
        this.scrollToTop();
      }
    }
  }

  prevStep(): void {
    this.currentStep.update((s) => (Math.max(1, s - 1) as 1 | 2 | 3));
    this.scrollToTop();
  }

  private validateStep1(): boolean {
    const fields = ['courseId', 'fullName', 'email', 'phone'];
    let valid = true;
    fields.forEach((key) => {
      const control = this.f[key];
      control.markAsTouched();
      if (control.invalid) {
        valid = false;
      }
    });
    return valid;
  }

  private validateStep2(): boolean {
    this.f['occupation'].markAsTouched();
    const occ = this.f['occupation'].value;
    let valid = true;
    if (occ === 'student') {
      ['collegeName', 'degreeBranch'].forEach((k) => {
        const c = this.f[k];
        c.markAsTouched();
        if (c.invalid) valid = false;
      });
    } else if (occ === 'working') {
      ['companyName', 'jobTitle'].forEach((k) => {
        const c = this.f[k];
        c.markAsTouched();
        if (c.invalid) valid = false;
      });
    }
    return valid;
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  }

  onSubmit(): void {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      // Navigate to the step with errors
      if (!this.validateStep1()) {
        this.currentStep.set(1);
        return;
      }
      if (!this.validateStep2()) {
        this.currentStep.set(2);
        return;
      }
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const val = this.regForm.value;
    const selectedCourse = this.courses().find((c) => c.id === val.courseId);

    this.api.registerStudent(val).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set(true);
          this.successName.set(val.fullName);
          this.successCourse.set(selectedCourse?.title || 'Selected Course');
          this.successBatch.set(val.preferredBatch);
          const randNum = Math.floor(1000 + Math.random() * 9000);
          this.confirmationRef.set(`2NOMADS-S01-${randNum}`);
          this.scrollToTop();
        } else {
          this.error.set(res.message || 'Registration failed.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to submit registration application.');
      },
    });
  }

  resetForm(): void {
    this.success.set(false);
    this.currentStep.set(1);
    this.regForm.reset({
      courseId: this.courses()[0]?.id,
      occupation: 'student',
      yearOfStudy: '2nd Year',
      yearsExperience: '1-3 years',
      preferredBatch: 'Evening (Mon-Fri 6:30–10:00 PM)',
    });
    this.scrollToTop();
  }
}
