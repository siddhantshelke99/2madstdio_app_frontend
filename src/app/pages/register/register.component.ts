import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { RegistrationComponent } from '../../components/registration/registration.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, RegistrationComponent],
  template: `
    <app-header></app-header>
    
    <div class="page-container">
      <div class="content-wrapper">
        <!-- TOP COMMAND & BREADCRUMB BAR -->
        <header class="top-nav-bar">
          <a routerLink="/" class="back-link" title="Return to 2NOMADS Studio Website">
            <svg class="back-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Return to Studio Website</span>
          </a>

          <div class="breadcrumb-trail">
            <span class="bc-item">2NOMADS Studio</span>
            <span class="bc-sep">/</span>
            <span class="bc-item">Academy</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Admissions Season 01</span>
          </div>

          <div class="portal-badge">
            <span class="live-dot"></span>
            <span>Admissions Open · Limited Studio Benches</span>
          </div>
        </header>

        <!-- MAIN 2-COLUMN RESPONSIVE LAYOUT -->
        <div class="admissions-grid">
          <!-- LEFT COLUMN: STUDIO BRIEF & HIGHLIGHTS (STICKY) -->
          <aside class="sidebar-column">
            <div class="sidebar-card">
              <div class="card-kicker">2NOMADS Academy · Season 01</div>
              <h1 class="card-headline">Reserve Your Studio Bench.</h1>
              <p class="card-desc">
                Step into a working automotive styling studio. Take the real Oneaxi EV Scooter from concept sketch to 1:1 scale clay model, Class-A digital surfaces, and running prototype.
              </p>

              <!-- PROGRAM VALUE HIGHLIGHTS -->
              <div class="highlights-list">
                <div class="hl-item">
                  <div class="hl-icon">🏎️</div>
                  <div>
                    <div class="hl-title">Real OEM Vehicle Project</div>
                    <div class="hl-sub">Hands-on creation of the Oneaxi EV Scooter, not just screen exercises.</div>
                  </div>
                </div>

                <div class="hl-item">
                  <div class="hl-icon">🛠️</div>
                  <div>
                    <div class="hl-title">Physical 1:1 Scale Clay</div>
                    <div class="hl-sub">Armatures, industrial clay styling tools, highlight reading under studio neon.</div>
                  </div>
                </div>

                <div class="hl-item">
                  <div class="hl-icon">👨‍🏫</div>
                  <div>
                    <div class="hl-title">Direct Senior OEM Mentorship</div>
                    <div class="hl-sub">Guided by veteran designers from 2NOMADS and Classic Legend.</div>
                  </div>
                </div>

                <div class="hl-item">
                  <div class="hl-icon">📐</div>
                  <div>
                    <div class="hl-title">Class-A CAD &amp; Laser Scanning</div>
                    <div class="hl-sub">Bridge physical clay and digital surfaces ready for 5-axis CNC &amp; tooling.</div>
                  </div>
                </div>
              </div>

              <!-- SCHEDULE & VENUE BADGE -->
              <div class="schedule-box">
                <div class="sched-row">
                  <span class="sched-label">Venue</span>
                  <span class="sched-val">2NOMADS Studio, Bhosari, Pune</span>
                </div>
                <div class="sched-row">
                  <span class="sched-label">Timings</span>
                  <span class="sched-val">Mon–Fri 6:30–10 PM or Sun 11 AM–8 PM</span>
                </div>
                <div class="sched-note">Evening batches tailored so you never miss college or day-job commitments.</div>
              </div>

              <!-- ADMISSIONS HOTLINE & WHATSAPP SUPPORT -->
              <div class="help-box">
                <div class="help-title">Need guidance on courses or batches?</div>
                <a href="https://wa.me/919158228037?text=Hello%202NOMADS!%20I%20have%20questions%20regarding%20Season%2001%20admissions." target="_blank" rel="noopener" class="whatsapp-hotline-btn">
                  <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
                  </svg>
                  <span>Chat with Admissions Desk</span>
                </a>
              </div>
            </div>
          </aside>

          <!-- RIGHT COLUMN: INTERACTIVE APPLICATION WIZARD -->
          <main class="wizard-column">
            <app-registration></app-registration>
          </main>
        </div>
      </div>

      <!-- FOOTER -->
      <footer class="page-footer">
        <div>© 2026 2NOMADS Transportation Design Studio &amp; Academy · Pune, India</div>
        <div class="footer-links">
          <a routerLink="/" class="footer-home-link">← Return to Website</a>
          <span class="sep-dot">·</span>
          <a routerLink="/admin/login" class="admin-link">Staff &amp; Admin Portal →</a>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      min-height: 100dvh;
      background: #09090b;
      background-image: 
        radial-gradient(ellipse at 15% 10%, rgba(255, 77, 28, 0.08) 0%, transparent 45%),
        radial-gradient(ellipse at 85% 90%, rgba(20, 21, 26, 0.8) 0%, transparent 55%);
      padding-top: 96px;
      padding-bottom: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #f5f5f7;
    }

    .content-wrapper {
      max-width: 1320px;
      width: 100%;
      margin: 0 auto;
      padding: 0 4vw;
      box-sizing: border-box;
    }

    .top-nav-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: all 0.2s ease;
      padding: 8px 16px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .back-link:hover {
      color: #fff;
      background: rgba(255, 77, 28, 0.18);
      border-color: rgba(255, 77, 28, 0.5);
      transform: translateX(-2px);
    }
    .back-icon {
      transition: transform 0.2s ease;
    }
    .back-link:hover .back-icon {
      transform: translateX(-2px);
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.45);
    }
    .bc-sep {
      color: rgba(255, 255, 255, 0.2);
    }
    .bc-active {
      color: var(--accent, #ff4d1c);
      font-weight: 600;
    }

    .portal-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ff4d1c;
      background: rgba(255, 77, 28, 0.1);
      border: 1px solid rgba(255, 77, 28, 0.28);
      padding: 6px 14px;
      border-radius: 9999px;
    }
    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
    }

    /* 2-COLUMN RESPONSIVE LAYOUT */
    .admissions-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 36px;
      align-items: start;
    }

    /* SIDEBAR STYLING */
    .sidebar-column {
      position: sticky;
      top: 110px;
    }

    .sidebar-card {
      background: rgba(14, 15, 19, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px 28px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .card-kicker {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent, #ff4d1c);
      margin-bottom: 10px;
    }

    .card-headline {
      font-family: var(--display, 'Plus Jakarta Sans', sans-serif);
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: #ffffff;
      margin: 0 0 14px;
    }

    .card-desc {
      font-size: 13.5px;
      line-height: 1.6;
      color: rgba(245, 245, 247, 0.72);
      margin: 0 0 24px;
    }

    .highlights-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .hl-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .hl-icon {
      font-size: 18px;
      line-height: 1.2;
    }
    .hl-title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .hl-sub {
      font-size: 12px;
      line-height: 1.45;
      color: rgba(245, 245, 247, 0.55);
    }

    .schedule-box {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .sched-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .sched-label {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.08em;
    }
    .sched-val {
      color: #ffffff;
      font-weight: 600;
      text-align: right;
    }
    .sched-note {
      font-size: 11px;
      color: rgba(255, 77, 28, 0.85);
      margin-top: 8px;
      line-height: 1.4;
      border-top: 1px dashed rgba(255, 255, 255, 0.08);
      padding-top: 8px;
    }

    .help-box {
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .help-title {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 10px;
    }
    .whatsapp-hotline-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 10px 16px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.35);
      border-radius: 8px;
      color: #4ade80;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .whatsapp-hotline-btn:hover {
      background: #22c55e;
      color: #ffffff;
      border-color: #22c55e;
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
    }

    /* FOOTER */
    .page-footer {
      max-width: 1320px;
      width: 100%;
      margin: 48px auto 0;
      padding: 24px 4vw 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
    }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-home-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .footer-home-link:hover {
      color: #ff4d1c;
    }
    .sep-dot {
      color: rgba(255, 255, 255, 0.2);
    }
    .admin-link {
      color: var(--accent, #ff4d1c);
      text-decoration: none;
      font-weight: 600;
    }
    .admin-link:hover {
      text-decoration: underline;
    }

    /* RESPONSIVE LAYOUT */
    @media (max-width: 1080px) {
      .admissions-grid {
        grid-template-columns: 320px 1fr;
        gap: 24px;
      }
    }

    @media (max-width: 880px) {
      .admissions-grid {
        grid-template-columns: 1fr;
      }
      .sidebar-column {
        position: static;
        order: 2;
        margin-top: 32px;
      }
      .wizard-column {
        order: 1;
      }
      .breadcrumb-trail {
        display: none;
      }
    }
  `],
})
export class RegisterPageComponent {}
