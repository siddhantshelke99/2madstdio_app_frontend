import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-[#050506] border-t border-[#1d1e24] pt-16 pb-12 text-[#8e909a]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          <!-- Column 1: Brand & Ethos (2 Cols wide on desktop) -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-md bg-[#141519] border border-[#2b2d38] flex items-center justify-center font-['Space_Grotesk'] font-bold text-white">
                <span class="text-[#ff4d1c]">2</span>N
              </div>
              <span class="font-['Space_Grotesk'] font-bold text-xl text-white tracking-wider">
                2NOMADS
              </span>
            </div>
            
            <p class="text-sm text-[#a3a5b0] max-w-sm leading-relaxed">
              Transportation Design Studio and Academy in Pune, India. We design, sculpt and build machines that move — and we train the people who will design the next ones.
            </p>

            <div class="pt-2 text-xs font-mono text-[#ff4d1c] tracking-widest uppercase">
              Pune, Maharashtra · India
            </div>
          </div>

          <!-- Column 2: Studio Division -->
          <div class="space-y-3">
            <h4 class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c] font-semibold">
              Studio Services
            </h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a routerLink="/studio" class="hover:text-white transition-colors">Clay Modelling (Scale &amp; 1:1)</a>
              </li>
              <li>
                <a routerLink="/studio" class="hover:text-white transition-colors">Show &amp; Running Prototypes</a>
              </li>
              <li>
                <a routerLink="/studio" class="hover:text-white transition-colors">3D Laser Scanning &amp; RE</a>
              </li>
              <li>
                <a routerLink="/studio" class="hover:text-white transition-colors">OEM Design Consulting</a>
              </li>
              <li>
                <a routerLink="/contact" class="hover:text-white transition-colors">Request a Proposal (RFP)</a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Academy Division -->
          <div class="space-y-3">
            <h4 class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c] font-semibold">
              Academy
            </h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a routerLink="/academy" class="hover:text-white transition-colors">Master Classes Season 01</a>
              </li>
              <li>
                <a routerLink="/academy" class="hover:text-white transition-colors">Transportation Design</a>
              </li>
              <li>
                <a routerLink="/academy" class="hover:text-white transition-colors">Automotive Clay Craft</a>
              </li>
              <li>
                <a routerLink="/academy" class="hover:text-white transition-colors">Class-A Digital Sculpting</a>
              </li>
              <li>
                <a routerLink="/register" class="hover:text-white transition-colors">Enrollment Portal</a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Studio Location & Hours -->
          <div class="space-y-3">
            <h4 class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c] font-semibold">
              Studio HQ
            </h4>
            <div class="text-xs leading-relaxed space-y-1.5 text-[#a3a5b0]">
              <p class="text-white font-medium">MSEI, Plot No. T-153/1</p>
              <p>Bhosari, Pune 411026</p>
              <p class="pt-1"><strong>Studio Hours:</strong> Mon – Fri from 11:00 AM</p>
              <p><strong>Class Timings:</strong> Mon – Fri · 6:00 PM – 9:00 PM</p>
              <p class="pt-1">
                <a href="tel:+919158228037" class="text-[#ff4d1c] hover:underline">+91 91582 28037</a>
              </p>
              <p>
                <a href="mailto:donnykoren@gmail.com" class="hover:text-white transition-colors">donnykoren&#64;gmail.com</a>
              </p>
            </div>
          </div>

        </div>

        <!-- Bottom Bar: Copyright & Subtle Admin Link -->
        <div class="pt-8 border-t border-[#1d1e24] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555762]">
          <div>
            &copy; {{ currentYear }} 2NOMADS Transportation Design Studio &amp; Academy. All rights reserved.
          </div>
          
          <div class="flex items-center gap-6">
            <span class="text-[#3e404b]">Crafted in Pune, India</span>
            <!-- Subtle Admin Portal Link -->
            <a
              routerLink="/admin/login"
              class="text-[#454752] hover:text-[#ff4d1c] transition-colors flex items-center gap-1.5 focus:outline-none">
              <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
