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
        <!-- TOP BREADCRUMB & BACK LINK -->
        <header class="top-nav-bar">
          <a routerLink="/" class="back-link" title="Return to 2NOMADS Studio Website">
            <svg class="back-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Return to Studio</span>
          </a>

          <div class="breadcrumb-trail">
            <span class="bc-item">2NOMADS</span>
            <span class="bc-sep">/</span>
            <span class="bc-item">Academy</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Season 01 Admissions</span>
          </div>

          <div class="status-pill">
            <span class="live-dot"></span>
            <span>Admissions Active · Pune Studio</span>
          </div>
        </header>

        <!-- PAGE HERO HEADER -->
        <div class="admissions-hero">
          <div class="hero-kicker">2NOMADS ACADEMY · ADMISSIONS</div>
          <h1 class="hero-headline">Studio Bench Application</h1>
          <p class="hero-sub">
            Reserve your seat for hands-on automotive clay modelling, Class-A surfacing, and vehicle prototyping in Pune. Mentored directly by senior OEM styling designers.
          </p>

          <!-- META INFO PILLS -->
          <div class="meta-pills">
            <div class="meta-pill">
              <span class="pill-dot"></span>
              <span>Limited to 12 Benches</span>
            </div>
            <div class="meta-pill">
              <span>Bhosari Studio, Pune</span>
            </div>
            <div class="meta-pill">
              <span>Evening &amp; Weekend Batches</span>
            </div>
          </div>
        </div>

        <!-- MAIN REGISTRATION APPLICATION FORM -->
        <main class="form-wrapper">
          <app-registration></app-registration>
        </main>
      </div>

      <!-- PAGE FOOTER -->
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
      background: #070709;
      background-image: 
        radial-gradient(ellipse at 50% 0%, rgba(255, 77, 28, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(20, 21, 26, 0.6) 0%, transparent 60%);
      padding-top: 100px;
      padding-bottom: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #f5f5f7;
      font-family: 'Neurial Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .content-wrapper {
      max-width: 1080px;
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
      margin-bottom: 36px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      flex-wrap: wrap;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .back-link:hover {
      color: #ffffff;
      border-color: rgba(255, 77, 28, 0.4);
      background: rgba(255, 77, 28, 0.1);
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
      color: rgba(255, 255, 255, 0.4);
    }
    .bc-sep {
      color: rgba(255, 255, 255, 0.2);
    }
    .bc-active {
      color: #ff4d1c;
      font-weight: 600;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #ff4d1c;
      background: rgba(255, 77, 28, 0.08);
      border: 1px solid rgba(255, 77, 28, 0.22);
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

    /* ADMISSIONS HERO */
    .admissions-hero {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 40px;
    }
    .hero-kicker {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #ff4d1c;
      margin-bottom: 12px;
    }
    .hero-headline {
      font-size: clamp(30px, 4vw, 42px);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: #ffffff;
      margin: 0 0 14px;
    }
    .hero-sub {
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 20px;
    }

    .meta-pills {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 5px 12px;
      border-radius: 9999px;
    }
    .pill-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ff4d1c;
    }

    .form-wrapper {
      width: 100%;
    }

    /* FOOTER */
    .page-footer {
      max-width: 1080px;
      width: 100%;
      margin: 48px auto 0;
      padding: 24px 4vw 0;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
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
      color: #ff4d1c;
      text-decoration: none;
      font-weight: 600;
    }
    .admin-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .breadcrumb-trail {
        display: none;
      }
    }
  `],
})
export class RegisterPageComponent {}
