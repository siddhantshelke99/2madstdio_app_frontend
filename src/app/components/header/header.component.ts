import { Component, AfterViewInit, OnDestroy, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header id="hdr" [class.solid]="isScrolled()">
      <a class="logo" (click)="scrollTo('#home')" [routerLink]="['/']" style="cursor: pointer;">2<b>NOMADS</b></a>

      <nav class="top">
        <div class="item" data-nav="who-we-are">
          <a (click)="scrollTo('#who-we-are')" style="cursor: pointer;">Who We Are</a>
        </div>
        <i class="sep"></i>

        <div class="item" data-nav="academy" [class.open]="openDropdown() === 'academy'">
          <button type="button" (click)="toggleDropdown('academy', $event)">
            Academy <i class="caret"></i>
          </button>
          <div class="drop">
            <a (click)="scrollTo('#transportation-design')" style="cursor: pointer;">Transportation Design</a>
            <a (click)="scrollTo('#clay-modelling')" style="cursor: pointer;">Clay Modelling</a>
            <a (click)="scrollTo('#digital-sculpting')" style="cursor: pointer;">Digital Sculpting</a>
            <a (click)="scrollTo('#scanning')" style="cursor: pointer;">Scanning</a>
            <a (click)="scrollTo('#prototype')" style="cursor: pointer;">Prototype — Show &amp; Working</a>
            <a routerLink="/register" (click)="openDropdown.set(null)" class="drop-cta">Register Online — Season 01 →</a>
          </div>
        </div>
        <i class="sep"></i>

        <div class="item" data-nav="studio" [class.open]="openDropdown() === 'studio'">
          <button type="button" (click)="toggleDropdown('studio', $event)">
            Studio <i class="caret"></i>
          </button>
          <div class="drop">
            <a routerLink="/studio" (click)="openDropdown.set(null)" class="drop-cta" style="margin-bottom: 6px; font-weight: 700;">
              Studio &amp; Services Overview →
            </a>
            <a (click)="scrollTo('#clay-service')" style="cursor: pointer;">Clay Service (Home)</a>
            <a (click)="scrollTo('#prototype-service')" style="cursor: pointer;">Prototype Service (Home)</a>
            <a routerLink="/studio" [fragment]="'equipment'" (click)="openDropdown.set(null)" style="color: var(--accent); font-weight: 600; border-top: 1px solid rgba(0,0,0,0.08); margin-top: 4px; padding-top: 6px;">
              Studio Equipments Directory →
            </a>
            <a routerLink="/studio" [fragment]="'inquiry'" (click)="openDropdown.set(null)" style="color: var(--accent); font-weight: 600;">
              Client &amp; OEM Inquiry Form →
            </a>
          </div>
        </div>
        <i class="sep"></i>

        <div class="item" data-nav="gallery">
          <a routerLink="/gallery" style="cursor: pointer;">Gallery</a>
        </div>
        <i class="sep"></i>

        <div class="item" data-nav="careers">
          <a routerLink="/careers" style="cursor: pointer;">Careers</a>
        </div>
        <i class="sep"></i>

        <div class="item" data-nav="testimony">
          <a (click)="scrollTo('#testimony')" style="cursor: pointer;">Testimony</a>
        </div>

        <!-- REGISTER BUTTON ROUTING DIRECTLY TO /register -->
        <div class="item" data-nav="register">
          <a routerLink="/register" class="nav-cta" title="Register for Academy Season 01">Register</a>
        </div>

        <!-- PROVISION FOR ADMIN LOGIN -->
        <!-- <div class="item admin-item">
          <a routerLink="/admin/login" class="nav-admin-btn" title="Admin Portal Login">
            <svg class="admin-icon" width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span>Admin</span>
          </a>
        </div> -->

        <div class="nav-indicator" id="navIndicator" aria-hidden="true"></div>
      </nav>

      <div class="header-right-actions">
        <a routerLink="/register" class="mobile-header-register" title="Register Online">Register</a>
        <button
          class="burger"
          id="burger"
          [class.x]="isMenuOpen()"
          (click)="toggleMenu()"
          type="button"
          aria-label="Menu"
          title="Open Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <!-- FULLSCREEN MOBILE MENU DRAWER -->
    <div class="overlay" id="overlay" [class.on]="isMenuOpen()">
      <div class="big">
        <a (click)="menuNavigate('#who-we-are')">Who We Are</a>
        
        <button type="button" (click)="toggleSubMenu('m-academy')">Academy {{ subMenuOpen() === 'm-academy' ? '−' : '+' }}</button>
        <div class="sub" [class.on]="subMenuOpen() === 'm-academy'">
          <a (click)="menuNavigate('#transportation-design')">Transportation Design</a><br>
          <a (click)="menuNavigate('#clay-modelling')">Clay Modelling</a><br>
          <a (click)="menuNavigate('#digital-sculpting')">Digital Sculpting</a><br>
          <a (click)="menuNavigate('#scanning')">Scanning</a><br>
          <a (click)="menuNavigate('#prototype')">Prototype — Show &amp; Working</a>
        </div>

        <button type="button" (click)="toggleSubMenu('m-studio')">Studio {{ subMenuOpen() === 'm-studio' ? '−' : '+' }}</button>
        <div class="sub" [class.on]="subMenuOpen() === 'm-studio'">
          <a routerLink="/studio" (click)="closeMenu()" style="color: var(--accent); font-weight: 700;">Studio &amp; Services Page →</a><br>
          <a routerLink="/studio" [fragment]="'equipment'" (click)="closeMenu()">Studio Equipments Directory</a><br>
          <a routerLink="/studio" [fragment]="'inquiry'" (click)="closeMenu()">Client &amp; OEM Inquiry Form</a><br>
          <a (click)="menuNavigate('#clay-service')">Clay Service (Home)</a><br>
          <a (click)="menuNavigate('#prototype-service')">Prototype Service (Home)</a>
        </div>

        <a routerLink="/gallery" (click)="isMenuOpen.set(false)">Gallery</a>
        <a routerLink="/careers" (click)="isMenuOpen.set(false)">Careers</a>
        <a routerLink="/register" (click)="isMenuOpen.set(false)" style="color: var(--accent); font-weight: 800;">Register Online →</a>
        <a (click)="menuNavigate('#testimony')">Testimony</a>
        <a (click)="menuNavigate('#contact')">Contact</a>

        <!-- PROVISION FOR ADMIN LOGIN IN MOBILE MENU -->
        <div class="mobile-admin-wrap">
          <a routerLink="/admin/login" (click)="isMenuOpen.set(false)" class="overlay-admin-link">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span>Staff &amp; Admin Portal →</span>
          </a>
        </div>
      </div>

      <div class="side">
        <h4>Studio</h4>
        <p>MSEI, Plot No. T-153/1<br>Bhosari, Pune 411026</p>
        <h4>Email</h4>
        <p><a href="mailto:donnykoren@gmail.com">donnykoren&#64;gmail.com</a></p>
        <h4>Phone</h4>
        <p><a href="tel:+919158228037">+91 91582 28037</a></p>
        <h4>Studio Hours</h4>
        <p>Mon – Fri · from 11:00 AM<br>Classes: Mon – Fri 6:30–10 PM, Sun 11 AM–8 PM<br>Saturday closed</p>

        <div class="side-admin-footer">
          <a routerLink="/admin/login" (click)="isMenuOpen.set(false)" class="side-admin-btn">
            Admin Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logo {
      cursor: pointer !important;
    }
    nav.top > .item > a,
    nav.top > .item > button {
      cursor: pointer !important;
    }
    .drop a {
      cursor: pointer !important;
    }
    .nav-admin-btn {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 8px 14px !important;
      border-radius: 9999px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      color: rgba(255, 255, 255, 0.6) !important;
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      text-decoration: none !important;
      transition: all 0.25s ease !important;
      cursor: pointer !important;
    }
    .nav-admin-btn:hover {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(255, 77, 28, 0.5) !important;
    }
    .admin-icon {
      opacity: 0.7;
    }
    .mobile-admin-wrap {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .overlay-admin-link {
      display: inline-flex !important;
      align-items: center !important;
      gap: 10px !important;
      font-size: 18px !important;
      font-weight: 600 !important;
      color: var(--accent) !important;
      text-decoration: none !important;
      transition: all 0.25s !important;
    }
    .overlay-admin-link:hover {
      transform: translateX(4px);
      filter: brightness(1.2);
    }
    .side-admin-footer {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .side-admin-btn {
      display: inline-block;
      font-size: 11px;
      font-family: var(--body);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      text-decoration: none;
      padding: 6px 12px;
      border: 1px solid rgba(255, 77, 28, 0.35);
      border-radius: 4px;
      background: rgba(255, 77, 28, 0.08);
      transition: all 0.2s;
    }
    .side-admin-btn:hover {
      background: var(--accent);
      color: #fff;
    }
    .header-right-actions {
      display: flex !important;
      align-items: center !important;
      gap: 14px !important;
      z-index: 60 !important;
      margin-left: 12px !important;
    }
    .mobile-header-register {
      display: none !important;
    }
    .burger {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      gap: 5px !important;
      width: 40px !important;
      height: 40px !important;
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      padding: 0 !important;
    }
    .burger span {
      display: block !important;
      height: 2px !important;
      width: 24px !important;
      background: #ffffff !important;
      border-radius: 2px !important;
      transition: all 0.35s ease !important;
      margin-left: auto !important;
    }
    .burger:hover span {
      background: var(--accent, #ff4d1c) !important;
    }
    .burger.x span:nth-child(1) {
      transform: translateY(7px) rotate(45deg) !important;
    }
    .burger.x span:nth-child(2) {
      opacity: 0 !important;
    }
    .burger.x span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg) !important;
    }
    @media (max-width: 960px) {
      .mobile-header-register {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 7px 16px !important;
        background: var(--accent, #ff4d1c) !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        letter-spacing: 0.12em !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        border-radius: 9999px !important;
        box-shadow: 0 4px 16px rgba(255, 77, 28, 0.4) !important;
        transition: all 0.2s ease !important;
      }
      .mobile-header-register:hover {
        background: #ff6538 !important;
        transform: translateY(-1px) !important;
      }
    }
  `],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private router = inject(Router);

  isScrolled = signal(false);
  isMenuOpen = signal(false);
  openDropdown = signal<string | null>(null);
  subMenuOpen = signal<string | null>(null);

  private cleanupListeners: Array<() => void> = [];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const mainEl = document.getElementById('main');
    const onScroll = () => {
      const top = mainEl ? mainEl.scrollTop : window.scrollY;
      this.isScrolled.set(top > 30);
    };

    if (mainEl) {
      mainEl.addEventListener('scroll', onScroll, { passive: true });
      this.cleanupListeners.push(() => mainEl.removeEventListener('scroll', onScroll));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanupListeners.push(() => window.removeEventListener('scroll', onScroll));

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.item')) {
        this.openDropdown.set(null);
      }
    };
    document.addEventListener('click', onDocClick);
    this.cleanupListeners.push(() => document.removeEventListener('click', onDocClick));
  }

  toggleDropdown(name: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdown.update((current) => (current === name ? null : name));
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleSubMenu(id: string): void {
    this.subMenuOpen.update((cur) => (cur === id ? null : id));
  }

  scrollTo(targetId: string): void {
    this.openDropdown.set(null);
    this.isMenuOpen.set(false);

    const cleanId = targetId.replace(/^#/, '');
    const currentPath = this.router.url.split('#')[0].split('?')[0];
    const isHomePage = currentPath === '' || currentPath === '/';

    if (!isHomePage) {
      if (cleanId === 'home' || !cleanId) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/'], { fragment: cleanId });
      }
      return;
    }

    if (cleanId === 'home' || !cleanId) {
      const mainEl = document.getElementById('main');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  menuNavigate(targetId: string): void {
    this.isMenuOpen.set(false);
    this.scrollTo(targetId);
  }

  ngOnDestroy(): void {
    this.cleanupListeners.forEach((fn) => fn());
    this.cleanupListeners = [];
  }
}
