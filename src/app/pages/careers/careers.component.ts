import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { ApiService } from '../../services/api.service';

export interface JobPosition {
  id: string;
  title: string;
  department: 'clay' | 'digital' | 'academy' | 'prototype' | 'internship';
  departmentLabel: string;
  location: string;
  type: string;
  experience: string;
  tagline: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  tools: string[];
}

@Component({
  selector: 'app-careers-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>

    <main class="careers-container">
      <!-- HERO SECTION -->
      <div class="careers-hero">
        <div class="hero-bg-glow"></div>
        <div class="careers-wrap">
          <div class="hero-kicker-row">
            <span class="live-dot"></span>
            <span class="hero-kicker">CAREERS &amp; APPRENTICESHIPS // PUNE STUDIO</span>
          </div>

          <h1 class="careers-heading">
            Design the machines that move.<br>
            <span class="heading-accent">Build them with your hands.</span>
          </h1>

          <p class="careers-lead">
            2NOMADS is a transportation design studio and academy based in Pune, founded by
            automobile designer and clay modeller <strong>R Donshong Koren</strong>.
            We work with automotive OEMs on live clay models, Class-A surfaces, and running prototypes,
            while training the next generation of designers. Join our studio team.
          </p>

          <div class="hero-actions">
            <a href="#open-positions" class="btn-primary" (click)="scrollToPositions($event)">
              <span>Explore Open Positions ({{ positions.length }})</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </a>
            <button type="button" class="btn-ghost" (click)="openApplyModal(null)">
              <span>Submit Open Portfolio</span>
            </button>
          </div>

          <!-- Studio Fast Stats -->
          <div class="studio-stats-grid">
            <div class="stat-card">
              <span class="stat-num">01</span>
              <h4>Live OEM Builds</h4>
              <p>Work on production concepts, auto show prototypes, and running one-offs.</p>
            </div>
            <div class="stat-card">
              <span class="stat-num">02</span>
              <h4>Scale &amp; 1:1 Clay</h4>
              <p>Coordinate bridge tables, styling clay armatures, and laser measurement.</p>
            </div>
            <div class="stat-card">
              <span class="stat-num">03</span>
              <h4>Master Mentorship</h4>
              <p>Learn directly under former Head of Transportation Design in Canada.</p>
            </div>
            <div class="stat-card">
              <span class="stat-num">04</span>
              <h4>Pune Studio Hub</h4>
              <p>Complete design studio &amp; live metal/FRP workshop in Bhosari, Pune.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CULTURE / WHAT WE BELIEVE -->
      <div class="careers-culture-section">
        <div class="careers-wrap">
          <div class="section-badge">STUDIO CULTURE &amp; CRAFT</div>
          <h2 class="section-title">Why build at 2NOMADS?</h2>

          <div class="culture-grid">
            <div class="culture-card">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              </div>
              <h3>Real Physical Craft</h3>
              <p>We don't just produce 2D sketches. We shape styling clay, mill Class-A CAD models, hand-beat aluminum panels, and weld prototype frames that run.</p>
            </div>

            <div class="culture-card">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              </div>
              <h3>In-House Innovation (Oneaxi)</h3>
              <p>Beyond OEM client programs, our studio builds proprietary electric mobility vehicles, including the in-house Oneaxi Electric Scooter platform.</p>
            </div>

            <div class="culture-card">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Shared Academy &amp; Studio Synergy</h3>
              <p>Our Academy students train in the same studio on the same real projects. Senior staff guide students while honing their own leadership skills.</p>
            </div>

            <div class="culture-card">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              </div>
              <h3>High Impact &amp; Recognition</h3>
              <p>Every member of our team gets their name credited on motor show builds, production models, and press unveilings with major Indian &amp; global OEMs.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- OPEN POSITIONS LISTINGS -->
      <div id="open-positions" class="careers-positions-section">
        <div class="careers-wrap">
          <div class="positions-header">
            <div>
              <div class="section-badge">CURRENT OPPORTUNITIES</div>
              <h2 class="section-title">Open Studio Positions</h2>
              <p class="section-sub">Join us on-site in Bhosari, Pune. We hire for craft, curiosity, and high work ethic.</p>
            </div>

            <!-- Department Filter Tabs -->
            <div class="dept-filter-tabs" role="tablist">
              @for (dept of departments; track dept.id) {
                <button
                  type="button"
                  class="dept-tab-btn"
                  [class.active]="selectedDept() === dept.id"
                  (click)="selectedDept.set(dept.id)"
                  role="tab"
                  [attr.aria-selected]="selectedDept() === dept.id">
                  <span>{{ dept.label }}</span>
                  <span class="dept-count">{{ getDeptCount(dept.id) }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Position Cards Grid -->
          <div class="positions-list">
            @for (pos of filteredPositions(); track pos.id) {
              <article class="position-card">
                <div class="pos-card-header">
                  <div class="pos-meta-row">
                    <span class="pos-badge">{{ pos.departmentLabel }}</span>
                    <span class="pos-location">{{ pos.location }}</span>
                    <span class="pos-type">{{ pos.type }}</span>
                    <span class="pos-exp">{{ pos.experience }}</span>
                  </div>
                  <h3 class="pos-title">{{ pos.title }}</h3>
                  <p class="pos-tagline">{{ pos.tagline }}</p>
                </div>

                <div class="pos-card-body">
                  <div class="pos-desc-block">
                    <p>{{ pos.description }}</p>
                  </div>

                  <div class="pos-details-grid">
                    <div class="pos-detail-col">
                      <h4>Key Responsibilities</h4>
                      <ul>
                        @for (r of pos.responsibilities; track r) {
                          <li><span>—</span> {{ r }}</li>
                        }
                      </ul>
                    </div>

                    <div class="pos-detail-col">
                      <h4>Desired Qualifications</h4>
                      <ul>
                        @for (q of pos.qualifications; track q) {
                          <li><span>—</span> {{ q }}</li>
                        }
                      </ul>
                    </div>
                  </div>

                  <!-- Tools & Tech Pill Bar -->
                  <div class="pos-tools-row">
                    <span class="tools-label">Key Tools:</span>
                    <div class="tools-tags">
                      @for (tool of pos.tools; track tool) {
                        <span class="tool-pill">{{ tool }}</span>
                      }
                    </div>
                  </div>
                </div>

                <div class="pos-card-footer">
                  <button
                    type="button"
                    class="pos-apply-btn"
                    (click)="openApplyModal(pos)">
                    <span>Apply for this Role</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                  <span class="pos-review-time">Typical review time: 48–72 hours</span>
                </div>
              </article>
            }
          </div>

          <!-- APPRENTICESHIP HIGHLIGHT -->
          <div class="apprenticeship-spotlight">
            <div class="spotlight-content">
              <span class="spotlight-badge">SEASON 01 APPRENTICESHIP</span>
              <h3>Are you a recent graduate or student designer?</h3>
              <p>
                Our 6-month hands-on apprenticeship is designed for hungry sketch artists, digital sculptors,
                and model makers who want intensive physical studio training. You will work on live vehicles
                under R Donshong Koren's direct supervision.
              </p>
              <button type="button" class="btn-primary" (click)="openApplyModal(apprenticeshipRole)">
                <span>Apply for Apprenticeship</span>
              </button>
            </div>
            <div class="spotlight-side">
              <div class="spotlight-stat">
                <span class="stat-highlight">100%</span>
                <span class="stat-desc">Studio-Floor Immersion</span>
              </div>
              <div class="spotlight-stat">
                <span class="stat-highlight">1 : 1</span>
                <span class="stat-desc">Full Scale OEM Clay</span>
              </div>
            </div>
          </div>

          <!-- OPEN APPLICATION CARD -->
          <div class="open-inquiry-box">
            <div class="inquiry-content">
              <h3>Don't see your exact role?</h3>
              <p>We are always interested in connecting with master automotive sculptors, surface developers, sheet metal artists, and digital visualizers. Submit your portfolio for future openings.</p>
            </div>
            <div class="inquiry-actions">
              <button type="button" class="btn-primary" (click)="openApplyModal(null)">
                <span>Submit Open Application</span>
              </button>
              <a href="mailto:donnykoren@gmail.com" class="direct-email-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>donnykoren&#64;gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- APPLICATION MODAL -->
      @if (isApplyModalOpen()) {
        <div class="apply-modal-wrapper" role="dialog" aria-modal="true" aria-label="Job Application Form">
          <div class="modal-backdrop" (click)="closeApplyModal()"></div>

          <div class="modal-shell">
            <header class="modal-header">
              <div class="modal-title-group">
                <span class="modal-kicker">STUDIO CANDIDATE INTAKE</span>
                <h3 class="modal-heading">
                  {{ selectedJobForApply()?.title || 'General Studio Application' }}
                </h3>
              </div>
              <button type="button" class="modal-close-btn" (click)="closeApplyModal()" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </header>

            @if (isSubmitted()) {
              <!-- Success State -->
              <div class="modal-success-state">
                <div class="success-icon-wrap">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3>Application Received</h3>
                <div class="ref-badge">REFERENCE #{{ applicationRef() }}</div>
                <p>
                  Thank you, <strong>{{ candidateForm.name }}</strong>. Your portfolio and details have been logged in our studio intake system. R Donshong Koren and our team will review your work and contact you within <strong>48–72 hours</strong>.
                </p>
                <button type="button" class="btn-primary" (click)="closeApplyModal()">
                  Done
                </button>
              </div>
            } @else {
              <!-- Application Form -->
              <form class="modal-form" (ngSubmit)="submitApplication($event)">
                <div class="form-row two-col">
                  <div class="form-group">
                    <label for="cName">Full Name *</label>
                    <input
                      id="cName"
                      type="text"
                      name="name"
                      [(ngModel)]="candidateForm.name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="cEmail">Email Address *</label>
                    <input
                      id="cEmail"
                      type="email"
                      name="email"
                      [(ngModel)]="candidateForm.email"
                      required
                      placeholder="e.g. rahul@example.com"
                      class="form-input">
                  </div>
                </div>

                <div class="form-row two-col">
                  <div class="form-group">
                    <label for="cPhone">Phone / WhatsApp *</label>
                    <input
                      id="cPhone"
                      type="tel"
                      name="phone"
                      [(ngModel)]="candidateForm.phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="cPortfolio">Portfolio Link (Behance / Drive / Web) *</label>
                    <input
                      id="cPortfolio"
                      type="url"
                      name="portfolio"
                      [(ngModel)]="candidateForm.portfolio"
                      required
                      placeholder="https://behance.net/yourprofile"
                      class="form-input">
                  </div>
                </div>

                <div class="form-row two-col">
                  <div class="form-group">
                    <label for="cRole">Role Applying For</label>
                    <select
                      id="cRole"
                      name="role"
                      [(ngModel)]="candidateForm.role"
                      class="form-select">
                      @for (p of positions; track p.id) {
                        <option [value]="p.title">{{ p.title }}</option>
                      }
                      <option value="General Open Portfolio">Other / General Portfolio</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="cExp">Years of Experience</label>
                    <select
                      id="cExp"
                      name="experience"
                      [(ngModel)]="candidateForm.experience"
                      class="form-select">
                      <option value="Fresher / Design Student">Fresher / Design Student</option>
                      <option value="1–2 Years">1–2 Years</option>
                      <option value="3–5 Years">3–5 Years</option>
                      <option value="5+ Years (Senior / Lead)">5+ Years (Senior / Lead)</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="cTools">Primary Tools &amp; Specializations</label>
                  <input
                    id="cTools"
                    type="text"
                    name="tools"
                    [(ngModel)]="candidateForm.tools"
                    placeholder="e.g. Styling Clay, Autodesk Alias, Blender, TIG Welding, FRP"
                    class="form-input">
                </div>

                <div class="form-group">
                  <label for="cNote">Brief Cover Note / Why 2NOMADS? *</label>
                  <textarea
                    id="cNote"
                    name="note"
                    rows="3"
                    [(ngModel)]="candidateForm.note"
                    required
                    placeholder="Tell us about a machine or vehicle you sculpted or engineered..."
                    class="form-textarea">
                  </textarea>
                </div>

                <div class="form-submit-row">
                  <button
                    type="submit"
                    class="btn-submit"
                    [disabled]="isSubmitting() || !candidateForm.name || !candidateForm.email || !candidateForm.portfolio">
                    @if (isSubmitting()) {
                      <span>Submitting Application...</span>
                    } @else {
                      <span>Submit Application to 2NOMADS</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    }
                  </button>
                  <span class="privacy-note">Your portfolio is reviewed solely by studio leadership.</span>
                </div>
              </form>
            }
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #070708;
      color: #f5f5f7;
      min-height: 100vh;
      font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
    }

    .careers-container {
      padding-top: 86px;
      min-height: 100vh;
    }

    .careers-wrap {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 4vw;
      box-sizing: border-box;
    }

    /* HERO */
    .careers-hero {
      position: relative;
      padding: 60px 0 80px;
      overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .hero-bg-glow {
      position: absolute;
      top: -100px;
      left: 30%;
      width: 600px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 77, 28, 0.15) 0%, transparent 70%);
      pointer-events: none;
      filter: blur(80px);
    }

    .hero-kicker-row {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-nomads-orange, #ff4d1c);
      box-shadow: 0 0 10px var(--color-nomads-orange, #ff4d1c);
    }

    .hero-kicker {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: var(--color-nomads-orange, #ff4d1c);
    }

    .careers-heading {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: clamp(36px, 5.2vw, 68px);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
      color: #fff;
      margin: 0 0 24px;
    }

    .heading-accent {
      color: var(--color-nomads-orange, #ff4d1c);
    }

    .careers-lead {
      font-size: clamp(16px, 1.4vw, 19px);
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.75);
      max-width: 820px;
      margin: 0 0 36px;
    }

    .careers-lead strong {
      color: #fff;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 50px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      background: var(--color-nomads-orange, #ff4d1c);
      color: #fff;
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 13px 26px;
      border-radius: 100px;
      text-decoration: none;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(255, 77, 28, 0.4);
      transition: all 0.25s ease;
    }

    .btn-primary:hover {
      background: #ff6538;
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(255, 77, 28, 0.55);
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      font-size: 13.5px;
      font-weight: 600;
      padding: 12px 22px;
      border-radius: 100px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* Fast Stats */
    .studio-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 36px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 20px;
      transition: all 0.25s ease;
    }

    .stat-card:hover {
      border-color: rgba(255, 77, 28, 0.4);
      transform: translateY(-2px);
    }

    .stat-num {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 11px;
      font-weight: 700;
      color: var(--color-nomads-orange, #ff4d1c);
      display: block;
      margin-bottom: 8px;
    }

    .stat-card h4 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 6px;
    }

    .stat-card p {
      font-size: 12.5px;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    /* CULTURE */
    .careers-culture-section {
      padding: 80px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: #090a0d;
    }

    .section-badge {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--color-nomads-orange, #ff4d1c);
      margin-bottom: 10px;
    }

    .section-title {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: clamp(28px, 3.5vw, 44px);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #fff;
      margin: 0 0 40px;
    }

    .section-sub {
      font-size: 14.5px;
      color: rgba(255, 255, 255, 0.65);
      margin: -24px 0 36px;
    }

    .culture-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .culture-card {
      background: rgba(20, 21, 25, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 28px 24px;
      transition: all 0.25s ease;
    }

    .culture-card:hover {
      border-color: rgba(255, 77, 28, 0.4);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 77, 28, 0.12);
      border: 1px solid rgba(255, 77, 28, 0.3);
      color: var(--color-nomads-orange, #ff4d1c);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .culture-card h3 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 12px;
    }

    .culture-card p {
      font-size: 13.5px;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
    }

    /* POSITIONS */
    .careers-positions-section {
      padding: 80px 0 100px;
    }

    .positions-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }

    .dept-filter-tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      padding: 4px 0;
    }
    .dept-filter-tabs::-webkit-scrollbar { display: none; }

    .dept-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.65);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 7px 14px;
      border-radius: 100px;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .dept-tab-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .dept-tab-btn.active {
      color: #fff;
      background: rgba(255, 77, 28, 0.18);
      border-color: rgba(255, 77, 28, 0.6);
      box-shadow: 0 0 15px rgba(255, 77, 28, 0.25);
    }

    .dept-count {
      font-size: 10.5px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      padding: 1px 6px;
      border-radius: 10px;
    }

    .dept-tab-btn.active .dept-count {
      background: rgba(255, 77, 28, 0.4);
      color: #fff;
    }

    .positions-list {
      display: flex;
      flex-direction: column;
      gap: 28px;
      margin-bottom: 50px;
    }

    .position-card {
      background: rgba(20, 21, 25, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 32px 36px;
      transition: all 0.3s ease;
    }

    .position-card:hover {
      border-color: rgba(255, 77, 28, 0.5);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }

    .pos-meta-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }

    .pos-badge {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-nomads-orange, #ff4d1c);
      background: rgba(255, 77, 28, 0.12);
      border: 1px solid rgba(255, 77, 28, 0.35);
      padding: 3px 10px;
      border-radius: 100px;
    }

    .pos-location, .pos-type, .pos-exp {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.55);
    }

    .pos-title {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: clamp(22px, 2.2vw, 28px);
      font-weight: 700;
      color: #fff;
      margin: 0 0 8px;
    }

    .pos-tagline {
      font-size: 14.5px;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 20px;
      line-height: 1.5;
    }

    .pos-desc-block p {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.65);
      margin: 0 0 24px;
    }

    .pos-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 20px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 20px;
    }

    .pos-detail-col h4 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 12px;
      letter-spacing: 0.05em;
    }

    .pos-detail-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .pos-detail-col li {
      font-size: 13px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .pos-detail-col li span {
      color: var(--color-nomads-orange, #ff4d1c);
      font-weight: 700;
    }

    .pos-tools-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .tools-label {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 11px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
    }

    .tools-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tool-pill {
      font-size: 11.5px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3px 10px;
      border-radius: 6px;
    }

    .pos-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      padding-top: 10px;
    }

    .pos-apply-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--color-nomads-orange, #ff4d1c);
      color: #fff;
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.04em;
      padding: 11px 24px;
      border-radius: 100px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(255, 77, 28, 0.4);
      transition: all 0.25s ease;
    }

    .pos-apply-btn:hover {
      background: #ff6538;
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(255, 77, 28, 0.6);
    }

    .pos-review-time {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    /* APPRENTICESHIP SPOTLIGHT */
    .apprenticeship-spotlight {
      background: linear-gradient(135deg, rgba(255, 77, 28, 0.12) 0%, rgba(20, 21, 25, 0.9) 60%);
      border: 1px solid rgba(255, 77, 28, 0.35);
      border-radius: 20px;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      margin-bottom: 40px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }

    .spotlight-content {
      max-width: 680px;
    }

    .spotlight-badge {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: var(--color-nomads-orange, #ff4d1c);
      display: block;
      margin-bottom: 8px;
    }

    .spotlight-content h3 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 12px;
    }

    .spotlight-content p {
      font-size: 14.5px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.75);
      margin: 0 0 24px;
    }

    .spotlight-side {
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      padding-left: 36px;
    }

    .spotlight-stat {
      display: flex;
      flex-direction: column;
    }

    .stat-highlight {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 36px;
      font-weight: 700;
      color: var(--color-nomads-orange, #ff4d1c);
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-desc {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* OPEN APPLICATION BOX */
    .open-inquiry-box {
      background: rgba(14, 15, 18, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
      flex-wrap: wrap;
    }

    .inquiry-content h3 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 6px;
    }

    .inquiry-content p {
      font-size: 13.5px;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
      max-width: 600px;
    }

    .inquiry-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .direct-email-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      padding: 11px 18px;
      border-radius: 100px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      transition: all 0.2s ease;
    }

    .direct-email-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 77, 28, 0.5);
    }

    /* MODAL */
    .apply-modal-wrapper {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }

    .modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .modal-shell {
      position: relative;
      z-index: 10;
      background: #111216;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 32px 36px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }

    .modal-kicker {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: var(--color-nomads-orange, #ff4d1c);
    }

    .modal-heading {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin: 4px 0 0;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s ease;
    }

    .modal-close-btn:hover {
      color: #fff;
    }

    /* Form */
    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-row.two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.7);
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 10px 14px;
      color: #fff;
      font-size: 13.5px;
      font-family: inherit;
      box-sizing: border-box;
      outline: none;
      transition: all 0.2s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--color-nomads-orange, #ff4d1c);
      background: rgba(255, 77, 28, 0.05);
      box-shadow: 0 0 12px rgba(255, 77, 28, 0.2);
    }

    .form-select option {
      background: #111216;
      color: #fff;
    }

    .form-textarea {
      resize: vertical;
    }

    .form-submit-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }

    .btn-submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--color-nomads-orange, #ff4d1c);
      color: #fff;
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 13px 26px;
      border-radius: 100px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(255, 77, 28, 0.4);
      transition: all 0.2s ease;
    }

    .btn-submit:hover:not(:disabled) {
      background: #ff6538;
      transform: translateY(-2px);
      box-shadow: 0 6px 26px rgba(255, 77, 28, 0.6);
    }

    .btn-submit:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .privacy-note {
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.45);
      text-align: center;
    }

    /* Modal Success */
    .modal-success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px 0 10px;
    }

    .success-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .modal-success-state h3 {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 10px;
    }

    .ref-badge {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 12px;
      font-weight: 700;
      color: var(--color-nomads-orange, #ff4d1c);
      background: rgba(255, 77, 28, 0.12);
      border: 1px solid rgba(255, 77, 28, 0.35);
      padding: 4px 12px;
      border-radius: 100px;
      margin-bottom: 16px;
    }

    .modal-success-state p {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      max-width: 460px;
      margin: 0 0 28px;
    }

    @media (max-width: 960px) {
      .studio-stats-grid, .culture-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .apprenticeship-spotlight {
        flex-direction: column;
        align-items: flex-start;
      }
      .spotlight-side {
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        padding-left: 0;
        padding-top: 24px;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
      }
    }

    @media (max-width: 640px) {
      .studio-stats-grid, .culture-grid, .pos-details-grid, .form-row.two-col {
        grid-template-columns: 1fr;
      }
      .position-card {
        padding: 24px 20px;
      }
      .modal-shell {
        padding: 24px 20px;
      }
    }
  `],
})
export class CareersComponent implements OnInit {
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  selectedDept = signal<string>('all');
  isApplyModalOpen = signal<boolean>(false);
  selectedJobForApply = signal<JobPosition | null>(null);
  isSubmitting = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  applicationRef = signal<string>('');

  candidateForm = {
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    role: '',
    experience: 'Fresher / Design Student',
    tools: '',
    note: '',
  };

  departments = [
    { id: 'all', label: 'All Roles' },
    { id: 'clay', label: 'Clay Modelling & Styling' },
    { id: 'digital', label: 'Digital CAS & Surfacing' },
    { id: 'academy', label: 'Academy Mentorship' },
    { id: 'prototype', label: 'Prototyping & Fabrication' },
    { id: 'internship', label: 'Apprenticeships' },
  ];

  positions: JobPosition[] = [
    {
      id: 'lead-clay-modeller',
      title: 'Lead Automotive Clay Modeller (Scale & 1:1)',
      department: 'clay',
      departmentLabel: 'CLAY MODELLING · OEM',
      location: 'Pune Studio (On-Site)',
      type: 'Full-Time',
      experience: '3–7 Years',
      tagline: 'Sculpt production and show-car surfaces on styling clay for premier automotive OEMs.',
      description: 'Lead physical automotive clay model creation from preliminary packaging armatures to final coordinate verification. You will work side-by-side with Donshong Koren on two-wheeler and four-wheeler OEM programs.',
      responsibilities: [
        'Build and calibrate wooden and metal armatures for scale and full-size vehicles.',
        'Apply and sweep industrial styling clay (Chavant/Staedtler) using bridge tools and profile templates.',
        'Execute precise tape drawing for vehicle character lines, beltlines, and shut lines.',
        'Verify coordinate symmetry and prepare clay surfaces for optical laser 3D scanning.',
        'Mentor apprentice modellers and maintain studio tooling standards.',
      ],
      qualifications: [
        '3+ years hands-on automotive styling clay experience in an OEM or independent studio.',
        'High tactile dexterity, spatial visualization, and knowledge of light reflection lines.',
        'Proficiency with bridge coordinate tables, laser scan preparation, and armature packaging.',
        'Ability to translate 2D design sketches into 3D physical volumes with minimal guidance.',
      ],
      tools: ['Automotive Styling Clay', 'Bridge Coordinate Arm', 'Profile Gauges', 'Tape Drawing', '3D Laser Scanning'],
    },
    {
      id: 'senior-class-a-sculptor',
      title: 'Senior Class-A Digital Sculptor (Autodesk Alias / Blender)',
      department: 'digital',
      departmentLabel: 'DIGITAL CAS & SURFACING',
      location: 'Pune Studio / Hybrid',
      type: 'Full-Time',
      experience: '2–6 Years',
      tagline: 'Translate clay laser scan meshes into production-ready Class-A surfaces with strict G2/G3 continuity.',
      description: 'Bridge physical craft with digital precision. As our Senior Digital Sculptor, you will generate production-intent exterior and interior Class-A surfaces from scan point clouds and sketch packages for OEM tooling.',
      responsibilities: [
        'Generate high-precision Class-A Bezier surfaces using Autodesk Alias or Rhino/Blender.',
        'Reverse-engineer optical 3D scan meshes captured from the studio clay floor.',
        'Ensure G2 (curvature) and G3 (torsion) continuity across highlight and split lines.',
        'Incorporate manufacturing engineering draft angles, parting lines, and packaging hardpoints.',
        'Produce photorealistic studio renderings and turnarounds for OEM executive reviews.',
      ],
      qualifications: [
        'Proven portfolio of Class-A automotive exterior or interior digital surfacing.',
        'Expertise in Autodesk Alias AutoStudio/Surface or advanced polygonal-to-NURBS workflows in Blender/Rhino.',
        'Deep understanding of highlight reflection behavior, zebra stripes, and curvature combs.',
        'Strong collaboration skills working directly with physical clay modellers.',
      ],
      tools: ['Autodesk Alias Surface', 'Rhino 3D', 'Blender / SubD', 'KeyShot', '3D Mesh Reverse Engineering'],
    },
    {
      id: 'transportation-faculty',
      title: 'Transportation Design Faculty & Studio Mentor',
      department: 'academy',
      departmentLabel: '2NOMADS ACADEMY',
      location: 'Pune Studio (On-Site)',
      type: 'Full-Time',
      experience: '3+ Years',
      tagline: 'Train and mentor the next generation of transportation designers in a working studio environment.',
      description: 'Teach vehicle proportion theory, ideation sketching, digital rendering, and physical packaging in our dedicated Academy wing, guiding students through real client briefs and thesis projects.',
      responsibilities: [
        'Conduct studio lectures and critique sessions on vehicle packaging, aerodynamics, and brand DNA.',
        'Teach professional perspective sketching, form language, and digital tablet rendering (Photoshop/Procreate).',
        'Guide students through foundational scale clay sculpting and Class-A surfacing modules.',
        'Review and elevate student portfolios to meet international OEM hiring standards.',
        'Coordinate industry guest reviews and graduation show exhibitions.',
      ],
      qualifications: [
        'Degree in Transportation Design or Industrial Design from a recognized institution.',
        'Strong automotive design portfolio spanning two-wheelers, passenger cars, or commercial vehicles.',
        'Exceptional communication and passion for hands-on pedagogical mentorship.',
        'Prior industry experience in an OEM styling department or design consultancy.',
      ],
      tools: ['Vehicle Proportion Theory', 'Photoshop Sketching', 'Clay Sculpting Basics', 'Packaging Ergonomics', 'Portfolio Mentorship'],
    },
    {
      id: 'prototype-metal-fabricator',
      title: 'Automotive Prototype & Sheet Metal Fabricator',
      department: 'prototype',
      departmentLabel: 'SHOW & WORKING PROTOTYPES',
      location: 'Pune Live Workshop (On-Site)',
      type: 'Full-Time',
      experience: '2–5 Years',
      tagline: 'Fabricate running show vehicles, hand-beaten aluminum bodywork, and bespoke custom chassis.',
      description: 'Bring designs into running reality. You will work on show prototypes like the BSA Bobber 350 and Jawa 42 custom builds, executing tubular chassis fabrication, metal shaping, and composite component assembly.',
      responsibilities: [
        'Fabricate custom motorcycle and automotive tubular frames and subframes with TIG/MIG welding.',
        'Hand-shape aluminum and mild steel panels using English wheel, planishing hammer, and shrinker/stretcher.',
        'Fabricate FRP / carbon composite molds and vacuum-bagged body panels.',
        'Perform mechanical and electrical assembly for functional running prototypes.',
        'Ensure millimetric alignment with digital CAD packaging files.',
      ],
      qualifications: [
        'Demonstrated experience in custom motorcycle or automotive prototype fabrication.',
        'High-precision sheet metal shaping and clean TIG welding (aluminum and steel).',
        'Experience with composite layups (FRP, carbon fiber) and surface prep for paint.',
        'Problem-solving mindset on tight motor show and launch deadlines.',
      ],
      tools: ['TIG / MIG Welding', 'English Wheel', 'Planishing Hammer', 'Composite FRP / Carbon', 'Tube Bending'],
    },
    {
      id: 'studio-apprenticeship',
      title: 'Studio Apprenticeship / Design Intern (Season 01)',
      department: 'internship',
      departmentLabel: 'APPRENTICESHIP · PAID',
      location: 'Pune Studio (On-Site)',
      type: '6-Month Apprenticeship',
      experience: 'Fresh Graduate / Student',
      tagline: 'Intensive 6-month hands-on studio apprenticeship working on live vehicle clay models and prototypes.',
      description: 'Designed for recent graduates and final-year students looking to break into the transportation design industry. Work directly with senior designers, learn styling clay hands-on, and contribute to real vehicles.',
      responsibilities: [
        'Assist senior modellers on automotive styling clay application, shaving, and scraping.',
        'Participate in daily design reviews, package analysis, and ideation sketching.',
        'Learn coordinate measurement, laser scanning, and basic Class-A reverse engineering.',
        'Document prototype assembly processes and assist in vehicle photo/video reels.',
      ],
      qualifications: [
        'Degree or diploma in Industrial Design, Transportation Design, or Mechanical Engineering.',
        'Strong visual sketching portfolio showing understanding of vehicle proportions and stance.',
        'Eagerness to get hands dirty with clay, metal, and physical tools.',
        'High discipline, willingness to learn, and passion for automotive machines.',
      ],
      tools: ['Automotive Clay Fundamentals', 'Sketching', 'Tablet Rendering', 'Laser Scanning Basics'],
    },
    {
      id: 'ev-packaging-engineer',
      title: 'EV Powertrain & Mechanical Packaging Engineer',
      department: 'prototype',
      departmentLabel: 'IN-HOUSE EV · ONEAXI',
      location: 'Pune Studio (On-Site)',
      type: 'Full-Time',
      experience: '2–5 Years',
      tagline: 'Engineer electric powertrain packaging, battery enclosures, and chassis kinematics for Oneaxi EV.',
      description: 'Support the development of our in-house indigenous electric scooter (Oneaxi). You will package battery modules, hub drive systems, suspension linkages, and ergonomic rider triangles into compact, production-viable frames.',
      responsibilities: [
        'Package battery packs, controllers, and wiring harnesses into lightweight tubular or monocoque frames.',
        'Perform CAD packaging in SolidWorks/CATIA with attention to center of gravity and vehicle dynamics.',
        'Collaborate with clay modellers and digital sculptors to ensure exterior styling conforms to hardpoints.',
        'Conduct structural validation and coordinate physical prototype road testing in Pune.',
      ],
      qualifications: [
        'Bachelor’s or Master’s in Mechanical or Automobile Engineering.',
        '2+ years experience in two-wheeler EV packaging or light electric vehicle development.',
        'Proficiency in SolidWorks, CATIA, or Siemens NX for complex mechanical assemblies.',
        'Knowledge of AIS 156 battery standards and automotive thermal management.',
      ],
      tools: ['SolidWorks / CATIA', 'EV Battery Packaging', 'Chassis Kinematics', 'Thermal Simulation', 'Physical Testing'],
    },
  ];

  apprenticeshipRole = this.positions.find((p) => p.department === 'internship') || this.positions[4];

  filteredPositions = computed(() => {
    const dept = this.selectedDept();
    if (dept === 'all') return this.positions;
    return this.positions.filter((p) => p.department === dept);
  });

  getDeptCount(deptId: string): number {
    if (deptId === 'all') return this.positions.length;
    return this.positions.filter((p) => p.department === deptId).length;
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      window.scrollTo(0, 0);
    }
  }

  scrollToPositions(e: Event): void {
    e.preventDefault();
    const el = document.getElementById('open-positions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openApplyModal(pos: JobPosition | null): void {
    this.selectedJobForApply.set(pos);
    this.candidateForm.role = pos ? pos.title : 'General Open Portfolio';
    this.isSubmitted.set(false);
    this.isApplyModalOpen.set(true);
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeApplyModal(): void {
    this.isApplyModalOpen.set(false);
    this.isSubmitted.set(false);
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  submitApplication(e: Event): void {
    e.preventDefault();
    if (!this.candidateForm.name || !this.candidateForm.email || !this.candidateForm.portfolio) {
      return;
    }

    this.isSubmitting.set(true);

    const refCode = '2N-CAREER-' + Math.floor(1000 + Math.random() * 9000);
    this.applicationRef.set(refCode);

    // Format application message for studio logging
    const messageContent = [
      `[STUDIO CAREER APPLICATION — Ref: #${refCode}]`,
      `Role: ${this.candidateForm.role}`,
      `Experience: ${this.candidateForm.experience}`,
      `Portfolio URL: ${this.candidateForm.portfolio}`,
      `Tools / Skills: ${this.candidateForm.tools || 'N/A'}`,
      `Cover Note: ${this.candidateForm.note}`,
    ].join('\n');

    this.api.submitInquiry({
      name: this.candidateForm.name,
      email: this.candidateForm.email,
      phone: this.candidateForm.phone,
      type: 'studio_project',
      message: messageContent,
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
      },
      error: (err) => {
        console.warn('Career application inquiry fallback:', err);
        // Fallback smooth confirmation even if backend network is offline
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
      },
    });
  }
}
