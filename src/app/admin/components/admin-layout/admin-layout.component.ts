import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#070708] text-[#f5f5f7] flex">

      <!-- DESKTOP SIDEBAR -->
      <aside class="hidden lg:flex flex-col w-64 bg-[#0c0d10] border-r border-[#1e2029] select-none fixed inset-y-0 left-0 z-30">
        
        <!-- Brand Header -->
        <div class="h-20 flex items-center px-6 border-b border-[#1e2029] gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#14151a] border border-[#272935] flex items-center justify-center font-['Space_Grotesk'] font-bold text-white">
            <span class="text-[#ff4d1c]">2</span>N
          </div>
          <div>
            <div class="font-['Space_Grotesk'] font-bold text-base text-white tracking-wider">
              2NOMADS
            </div>
            <div class="text-[9px] font-mono uppercase tracking-[0.2em] text-[#ff4d1c] -mt-0.5">
              Admin Portal
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          
          <a
            routerLink="/admin/dashboard"
            routerLinkActive="bg-[#ff4d1c] text-white shadow-md"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase text-[#8e909a] hover:bg-[#16171f] hover:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </a>

          <a
            routerLink="/admin/students"
            routerLinkActive="bg-[#ff4d1c] text-white shadow-md"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase text-[#8e909a] hover:bg-[#16171f] hover:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Students</span>
          </a>

          <a
            routerLink="/admin/courses"
            routerLinkActive="bg-[#ff4d1c] text-white shadow-md"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase text-[#8e909a] hover:bg-[#16171f] hover:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Courses</span>
          </a>

          <a
            routerLink="/admin/inquiries"
            routerLinkActive="bg-[#ff4d1c] text-white shadow-md"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase text-[#8e909a] hover:bg-[#16171f] hover:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Inquiries</span>
          </a>

          <a
            routerLink="/admin/logs"
            routerLinkActive="bg-[#ff4d1c] text-white shadow-md"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase text-[#8e909a] hover:bg-[#16171f] hover:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Comms Logs</span>
          </a>

        </nav>

        <!-- Admin Profile Footer -->
        <div class="p-4 border-t border-[#1e2029] bg-[#09090b]">
          <div class="flex items-center justify-between mb-3">
            <div class="overflow-hidden">
              <div class="text-xs font-bold text-white truncate">
                {{ user()?.name || 'Administrator' }}
              </div>
              <div class="text-[10px] text-[#71737e] truncate font-mono">
                {{ user()?.email || 'admin@2nomads.design' }}
              </div>
            </div>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff4d1c]/15 text-[#ff4d1c] border border-[#ff4d1c]/30 uppercase font-bold">
              {{ user()?.role || 'admin' }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-2 pt-2 border-t border-[#1a1c22]">
            <a
              routerLink="/"
              target="_blank"
              class="text-[11px] font-mono text-[#8e909a] hover:text-white transition-colors flex items-center gap-1">
              <span>View Site</span> &rarr;
            </a>
            <button
              (click)="onLogout()"
              class="text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors">
              Log out
            </button>
          </div>
        </div>

      </aside>

      <!-- MOBILE TOPBAR & DRAWER -->
      <div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0c0d10] border-b border-[#1e2029] px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <button
            (click)="toggleMobileMenu()"
            class="p-2 rounded-md text-[#8e909a] hover:text-white hover:bg-[#16171f]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="font-['Space_Grotesk'] font-bold text-base text-white tracking-wider">
            2NOMADS Admin
          </span>
        </div>

        <button
          (click)="onLogout()"
          class="text-xs font-mono text-red-400 px-3 py-1.5 rounded hover:bg-red-950/30">
          Logout
        </button>
      </div>

      <!-- Mobile Nav Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fadeIn" (click)="closeMobileMenu()">
          <div class="w-64 h-full bg-[#0c0d10] border-r border-[#1e2029] p-4 flex flex-col justify-between" (click)="$event.stopPropagation()">
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#1e2029]">
                <div class="font-['Space_Grotesk'] font-bold text-lg text-white">2NOMADS</div>
                <button (click)="closeMobileMenu()" class="p-1.5 text-[#8e909a] hover:text-white">
                  ✕
                </button>
              </div>

              <nav class="space-y-1 text-xs font-mono uppercase tracking-wider">
                <a routerLink="/admin/dashboard" (click)="closeMobileMenu()" routerLinkActive="bg-[#ff4d1c] text-white" class="block px-3 py-2.5 rounded text-[#8e909a]">
                  Dashboard
                </a>
                <a routerLink="/admin/students" (click)="closeMobileMenu()" routerLinkActive="bg-[#ff4d1c] text-white" class="block px-3 py-2.5 rounded text-[#8e909a]">
                  Students
                </a>
                <a routerLink="/admin/courses" (click)="closeMobileMenu()" routerLinkActive="bg-[#ff4d1c] text-white" class="block px-3 py-2.5 rounded text-[#8e909a]">
                  Courses
                </a>
                <a routerLink="/admin/inquiries" (click)="closeMobileMenu()" routerLinkActive="bg-[#ff4d1c] text-white" class="block px-3 py-2.5 rounded text-[#8e909a]">
                  Inquiries
                </a>
                <a routerLink="/admin/logs" (click)="closeMobileMenu()" routerLinkActive="bg-[#ff4d1c] text-white" class="block px-3 py-2.5 rounded text-[#8e909a]">
                  Comms Logs
                </a>
              </nav>
            </div>

            <div class="pt-4 border-t border-[#1e2029]">
              <a routerLink="/" (click)="closeMobileMenu()" class="block text-xs text-[#8e909a] mb-2">
                &larr; Back to Public Website
              </a>
              <button (click)="onLogout()" class="w-full py-2 rounded bg-red-950/40 text-red-400 text-xs font-mono uppercase font-bold">
                Log Out
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MAIN CONTENT AREA -->
      <main class="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen bg-[#070708] overflow-x-hidden">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
