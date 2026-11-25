import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { InquiryComponent } from '../../components/inquiry/inquiry.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, InquiryComponent],
  template: `
    <app-header></app-header>
    
    <div class="page-container">
      <div class="content-wrap">
        <!-- TOP BREADCRUMB & RETURN TO WEBSITE ACTION BAR -->
        <div class="top-nav-bar">
          <a routerLink="/" class="back-link" title="Return to 2NOMADS Studio Website">
            <svg class="back-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Return to Studio Website</span>
          </a>

          <div class="portal-badge">
            <span class="live-dot"></span>
            <span>Studio Desk · Pune</span>
          </div>
        </div>

        <app-inquiry></app-inquiry>
      </div>

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
      background: #09090b;
      padding-top: 100px;
      padding-bottom: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .content-wrap {
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      padding: 20px 5vw;
    }
    .top-nav-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: all 0.2s ease;
      padding: 8px 14px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .back-link:hover {
      color: #fff;
      background: rgba(255, 77, 28, 0.16);
      border-color: rgba(255, 77, 28, 0.45);
      transform: translateX(-3px);
    }
    .back-icon {
      transition: transform 0.2s ease;
    }
    .back-link:hover .back-icon {
      transform: translateX(-2px);
    }
    .portal-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #ff4d1c;
      background: rgba(255, 77, 28, 0.1);
      border: 1px solid rgba(255, 77, 28, 0.25);
      padding: 6px 14px;
      border-radius: 9999px;
    }
    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    }
    .page-footer {
      max-width: 800px;
      width: 100%;
      margin: 40px auto 0;
      padding: 24px 5vw 0;
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
      color: rgba(255, 255, 255, 0.65);
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
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
    .admin-link:hover {
      text-decoration: underline;
    }
  `],
})
export class ContactPageComponent {}
