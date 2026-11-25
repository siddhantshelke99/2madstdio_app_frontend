import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-[#23252d]/80 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand Mark -->
          <a routerLink="/" class="flex items-center gap-3 group focus:outline-none">
            <div class="w-10 h-10 rounded-lg bg-[#141519] border border-[#262832] flex items-center justify-center font-['Space_Grotesk'] font-bold text-lg text-white group-hover:border-[#ff4d1c] transition-colors">
              <span class="text-[#ff4d1c]">2</span>N
            </div>
            <div class="flex flex-col">
              <span class="font-['Space_Grotesk'] font-bold text-xl tracking-wider text-white group-hover:text-[#ff4d1c] transition-colors">
                2NOMADS
              </span>
              <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8e909a] -mt-1">
                Design Studio &amp; Academy
              </span>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              routerLink="/"
              routerLinkActive="text-white bg-[#16171d] border-[#2b2d38]"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-md text-sm font-medium text-[#8e909a] hover:text-white hover:bg-[#121317] border border-transparent transition-all">
              Home
            </a>
            <a
              routerLink="/studio"
              routerLinkActive="text-white bg-[#16171d] border-[#2b2d38]"
              class="px-4 py-2 rounded-md text-sm font-medium text-[#8e909a] hover:text-white hover:bg-[#121317] border border-transparent transition-all">
              Studio Services
            </a>
            <a
              routerLink="/academy"
              routerLinkActive="text-white bg-[#16171d] border-[#2b2d38]"
              class="px-4 py-2 rounded-md text-sm font-medium text-[#8e909a] hover:text-white hover:bg-[#121317] border border-transparent transition-all">
              Academy &amp; Courses
            </a>
            <a
              routerLink="/contact"
              routerLinkActive="text-white bg-[#16171d] border-[#2b2d38]"
              class="px-4 py-2 rounded-md text-sm font-medium text-[#8e909a] hover:text-white hover:bg-[#121317] border border-transparent transition-all">
              Contact
            </a>
          </nav>

          <!-- Desktop Right CTAs -->
          <div class="hidden md:flex items-center gap-3">
            <a
              routerLink="/contact"
              class="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#a0a2ad] hover:text-white transition-colors">
              Studio Inquiry
            </a>
            <a
              routerLink="/register"
              class="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider text-white bg-[#ff4d1c] hover:bg-[#ff6538] rounded-md transition-all shadow-[0_4px_16px_rgba(255,77,28,0.35)] hover:shadow-[0_6px_22px_rgba(255,77,28,0.5)]">
              Enroll — Season 01
            </a>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="flex md:hidden">
            <button
              (click)="toggleMenu()"
              type="button"
              class="p-2 rounded-md text-[#8e909a] hover:text-white hover:bg-[#16171c] focus:outline-none"
              aria-label="Toggle navigation menu">
              @if (!isMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMenuOpen()) {
        <div class="md:hidden glass-nav border-b border-[#23252d] px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <a
            routerLink="/"
            (click)="closeMenu()"
            routerLinkActive="text-[#ff4d1c] bg-[#14151a]"
            [routerLinkActiveOptions]="{ exact: true }"
            class="block px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-[#16171d]">
            Home
          </a>
          <a
            routerLink="/studio"
            (click)="closeMenu()"
            routerLinkActive="text-[#ff4d1c] bg-[#14151a]"
            class="block px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-[#16171d]">
            Studio Services
          </a>
          <a
            routerLink="/academy"
            (click)="closeMenu()"
            routerLinkActive="text-[#ff4d1c] bg-[#14151a]"
            class="block px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-[#16171d]">
            Academy Courses
          </a>
          <a
            routerLink="/contact"
            (click)="closeMenu()"
            routerLinkActive="text-[#ff4d1c] bg-[#14151a]"
            class="block px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-[#16171d]">
            Contact &amp; Studio Inquiries
          </a>
          <div class="pt-4 border-t border-[#23252d] flex flex-col gap-2">
            <a
              routerLink="/register"
              (click)="closeMenu()"
              class="w-full text-center py-3 text-sm font-bold font-mono uppercase tracking-wider text-white bg-[#ff4d1c] hover:bg-[#ff6538] rounded-md shadow-lg">
              Enroll — Season 01
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
