import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Course, CourseMode } from '../../models/course.model';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative overflow-hidden pt-24 pb-20">

      <!-- HERO HEADER -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#1c1d24]">
        <div class="max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ff4d1c]/10 border border-[#ff4d1c]/30 text-xs font-mono text-[#ff4d1c] uppercase tracking-widest">
            Academy Division · Concept to Prototype
          </div>
          <h1 class="font-['Space_Grotesk'] text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Learn From Those Who Build.
          </h1>
          <p class="text-base sm:text-lg text-[#9da0ac] leading-relaxed">
            Automotive styling, clay surfacing, and vehicle prototyping taught by active designers in a working OEM studio. Evening batches so you never miss college or employment.
          </p>
        </div>
      </section>

      <!-- FILTER & COURSES LISTING -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1d1f27]">
          <div class="text-sm font-mono text-[#8e909a]">
            Showing <span class="text-white font-bold">{{ filteredCourses().length }}</span> Professional Courses
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              (click)="selectedMode.set('all')"
              [class.bg-[#ff4d1c]]="selectedMode() === 'all'"
              [class.text-white]="selectedMode() === 'all'"
              [class.bg-[#121317]]="selectedMode() !== 'all'"
              [class.text-[#8e909a]]="selectedMode() !== 'all'"
              class="px-4 py-2 rounded border border-[#262832] transition-colors">
              All Modes
            </button>
            <button
              (click)="selectedMode.set('offline')"
              [class.bg-[#ff4d1c]]="selectedMode() === 'offline'"
              [class.text-white]="selectedMode() === 'offline'"
              [class.bg-[#121317]]="selectedMode() !== 'offline'"
              [class.text-[#8e909a]]="selectedMode() !== 'offline'"
              class="px-4 py-2 rounded border border-[#262832] transition-colors">
              Offline (Studio)
            </button>
            <button
              (click)="selectedMode.set('hybrid')"
              [class.bg-[#ff4d1c]]="selectedMode() === 'hybrid'"
              [class.text-white]="selectedMode() === 'hybrid'"
              [class.bg-[#121317]]="selectedMode() !== 'hybrid'"
              [class.text-[#8e909a]]="selectedMode() !== 'hybrid'"
              class="px-4 py-2 rounded border border-[#262832] transition-colors">
              Hybrid
            </button>
            <button
              (click)="selectedMode.set('online')"
              [class.bg-[#ff4d1c]]="selectedMode() === 'online'"
              [class.text-white]="selectedMode() === 'online'"
              [class.bg-[#121317]]="selectedMode() !== 'online'"
              [class.text-[#8e909a]]="selectedMode() !== 'online'"
              class="px-4 py-2 rounded border border-[#262832] transition-colors">
              Online
            </button>
          </div>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="py-20 flex flex-col items-center justify-center space-y-4">
            <div class="w-10 h-10 border-2 border-[#ff4d1c] border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs font-mono text-[#8e909a] tracking-wider uppercase">Loading Academy Curriculum...</p>
          </div>
        }

        <!-- Error State -->
        @if (hasError()) {
          <div class="p-8 rounded-xl bg-[#171111] border border-red-500/30 text-center space-y-4">
            <p class="text-sm text-red-400">Failed to connect to backend API server. Make sure the backend server is running.</p>
            <button
              (click)="loadCourses()"
              class="px-5 py-2 rounded bg-[#ff4d1c] text-white font-mono text-xs font-bold uppercase">
              Retry Connection
            </button>
          </div>
        }

        <!-- Course Cards Grid -->
        @if (!isLoading() && !hasError()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (course of filteredCourses(); track course.id) {
              <div class="group rounded-xl bg-[#111216] border border-[#20222a] hover:border-[#ff4d1c]/60 p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                
                <div class="space-y-4">
                  <!-- Mode & Duration Header Badges -->
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1c1d25] border border-[#2c2f3c] text-[#ff4d1c]">
                      {{ course.mode }}
                    </span>
                    <span class="text-xs font-mono text-[#8e909a]">
                      {{ course.duration }}
                    </span>
                  </div>

                  <!-- Course Title -->
                  <h3 class="font-['Space_Grotesk'] text-2xl font-bold text-white group-hover:text-[#ff4d1c] transition-colors leading-snug">
                    {{ course.title }}
                  </h3>

                  <!-- Description -->
                  <p class="text-xs sm:text-sm text-[#9395a1] leading-relaxed line-clamp-3">
                    {{ course.description }}
                  </p>

                  <!-- Fee -->
                  <div class="pt-3 border-t border-[#1b1c24]">
                    <div class="text-[11px] font-mono text-[#7b7d88]">Tuition Fee</div>
                    <div class="text-xl font-bold font-mono text-white mt-0.5">
                      {{ formatFee(course.fee) }}
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-6 mt-6 border-t border-[#1b1c24] flex items-center justify-between gap-3">
                  <button
                    (click)="openModal(course)"
                    class="text-xs font-mono text-[#8e909a] hover:text-white transition-colors underline underline-offset-4">
                    View Syllabus &rarr;
                  </button>
                  <a
                    routerLink="/register"
                    [queryParams]="{ courseId: course.id }"
                    class="px-4 py-2 rounded bg-[#ff4d1c] hover:bg-[#ff6538] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md">
                    Enroll
                  </a>
                </div>

              </div>
            }
          </div>
        }

      </section>

      <!-- COURSE DETAIL MODAL (SYLLABUS & BREAKDOWN) -->
      @if (selectedCourse(); as course) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#121317] border border-[#2a2c38] shadow-2xl p-6 sm:p-8 space-y-6">
            
            <!-- Close Button -->
            <button
              (click)="closeModal()"
              class="absolute top-5 right-5 p-2 rounded-lg text-[#8e909a] hover:text-white hover:bg-[#1e2028] transition-colors"
              aria-label="Close modal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Modal Header -->
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ff4d1c]/15 text-[#ff4d1c] border border-[#ff4d1c]/30">
                  {{ course.mode }}
                </span>
                <span class="text-xs font-mono text-[#8e909a]">
                  Duration: {{ course.duration }}
                </span>
              </div>
              <h2 class="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white">
                {{ course.title }}
              </h2>
            </div>

            <!-- Full Description -->
            <p class="text-sm text-[#9b9da8] leading-relaxed">
              {{ course.description }}
            </p>

            <!-- Fee Card -->
            <div class="p-4 rounded-xl bg-[#191a22] border border-[#282a35] flex items-center justify-between">
              <div>
                <div class="text-xs font-mono text-[#7b7d88]">Tuition Fee</div>
                <div class="text-2xl font-bold font-mono text-[#ff4d1c]">
                  {{ formatFee(course.fee) }}
                </div>
              </div>
              <div class="text-right text-xs text-[#8e909a]">
                <div>Evening Schedule</div>
                <div>Classroom + Studio Tools</div>
              </div>
            </div>

            <!-- Syllabus Modules -->
            <div class="space-y-3">
              <h4 class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c] font-semibold">
                Course Syllabus &amp; Modules
              </h4>

              @if (course.syllabus && course.syllabus.length > 0) {
                <div class="space-y-3">
                  @for (mod of course.syllabus; track mod.weekOrModule) {
                    <div class="p-3.5 rounded-lg bg-[#181920] border border-[#232530] space-y-1.5">
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-mono font-bold text-[#ff4d1c]">
                          {{ mod.weekOrModule }}
                        </span>
                        <span class="text-xs text-[#525460]">·</span>
                        <span class="text-xs font-semibold text-white">
                          {{ mod.topic }}
                        </span>
                      </div>
                      @if (mod.details && mod.details.length > 0) {
                        <ul class="pl-4 list-disc space-y-1 text-xs text-[#8e909a]">
                          @for (det of mod.details; track det) {
                            <li>{{ det }}</li>
                          }
                        </ul>
                      }
                    </div>
                  }
                </div>
              } @else {
                <p class="text-xs text-[#7b7d88] italic">Detailed weekly curriculum available upon enrollment.</p>
              }
            </div>

            <!-- Modal Action Buttons -->
            <div class="pt-4 border-t border-[#232530] flex items-center justify-end gap-3">
              <button
                (click)="closeModal()"
                class="px-5 py-2.5 rounded text-xs font-mono text-[#8e909a] hover:text-white transition-colors">
                Close
              </button>
              <a
                routerLink="/register"
                [queryParams]="{ courseId: course.id }"
                (click)="closeModal()"
                class="px-6 py-2.5 rounded bg-[#ff4d1c] hover:bg-[#ff6538] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg">
                Proceed to Registration &rarr;
              </a>
            </div>

          </div>
        </div>
      }

    </div>
  `,
})
export class AcademyPageComponent implements OnInit {
  private apiService = inject(ApiService);

  courses = signal<Course[]>([]);
  selectedMode = signal<'all' | CourseMode>('all');
  selectedCourse = signal<Course | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  filteredCourses = computed(() => {
    const mode = this.selectedMode();
    const all = this.courses();
    if (mode === 'all') return all;
    return all.filter((c) => c.mode === mode);
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.apiService.getCourses().subscribe({
      next: (res) => {
        if (res.data) {
          this.courses.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load courses from API:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  openModal(course: Course): void {
    this.selectedCourse.set(course);
  }

  closeModal(): void {
    this.selectedCourse.set(null);
  }

  formatFee(fee: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(fee);
  }
}
