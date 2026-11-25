import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService, DashboardStats } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 sm:p-8 lg:p-10 space-y-10 max-w-7xl mx-auto">
      
      <!-- Top Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2029]">
        <div>
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c]">
            Overview &amp; Metrics
          </span>
          <h1 class="font-['Space_Grotesk'] text-3xl font-extrabold text-white mt-1">
            Studio &amp; Academy Dashboard
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="loadStats()"
            [disabled]="isLoading()"
            class="px-4 py-2 rounded-lg bg-[#14151a] hover:bg-[#1d1f27] border border-[#272935] text-xs font-mono text-[#8e909a] hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-3.5 h-3.5" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      @if (stats(); as s) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Card 1: Total Students -->
          <div class="p-6 rounded-xl bg-[#0e0f13] border border-[#1f212a] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-[#8e909a]">
              <span>TOTAL STUDENTS</span>
              <span class="px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/20 text-[10px]">
                {{ s.students.byStatus.new }} New
              </span>
            </div>
            <div class="text-3xl font-['Space_Grotesk'] font-bold text-white">
              {{ s.students.total }}
            </div>
            <div class="text-xs text-[#6f717c] flex items-center gap-2 pt-1 font-mono">
              <span class="text-emerald-400">{{ s.students.byStatus.enrolled }} Enrolled</span> ·
              <span class="text-amber-400">{{ s.students.byStatus.contacted }} Contacted</span>
            </div>
          </div>

          <!-- Card 2: Open Inquiries -->
          <div class="p-6 rounded-xl bg-[#0e0f13] border border-[#1f212a] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-[#8e909a]">
              <span>OPEN INQUIRIES</span>
              <span class="px-2 py-0.5 rounded bg-[#ff4d1c]/15 text-[#ff4d1c] border border-[#ff4d1c]/30 text-[10px]">
                Pending
              </span>
            </div>
            <div class="text-3xl font-['Space_Grotesk'] font-bold text-white">
              {{ s.inquiries.byStatus.open }}
            </div>
            <div class="text-xs text-[#6f717c] flex items-center gap-2 pt-1 font-mono">
              <span>{{ s.inquiries.byType.studio_project }} Studio RFPs</span> ·
              <span>{{ s.inquiries.byType.academy_general }} Academy</span>
            </div>
          </div>

          <!-- Card 3: Active Courses -->
          <div class="p-6 rounded-xl bg-[#0e0f13] border border-[#1f212a] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-[#8e909a]">
              <span>PUBLISHED COURSES</span>
              <span class="px-2 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-500/20 text-[10px]">
                Academy
              </span>
            </div>
            <div class="text-3xl font-['Space_Grotesk'] font-bold text-white">
              {{ s.courses.published }} / {{ s.courses.total }}
            </div>
            <div class="text-xs text-[#6f717c] pt-1 font-mono">
              Season 01 Masterclasses Active
            </div>
          </div>

          <!-- Card 4: Enrolled Revenue -->
          <div class="p-6 rounded-xl bg-[#0e0f13] border border-[#1f212a] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-[#8e909a]">
              <span>ENROLLED TUITION</span>
              <span class="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 text-[10px]">
                Booked
              </span>
            </div>
            <div class="text-2xl font-mono font-bold text-emerald-400">
              {{ formatCurrency(s.students.totalEnrolledRevenue) }}
            </div>
            <div class="text-xs text-[#6f717c] pt-1 font-mono">
              Based on confirmed seat admissions
            </div>
          </div>

        </div>

        <!-- RECENT ACTIVITY SECTIONS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Recent Student Registrations Table -->
          <div class="p-6 rounded-xl bg-[#0c0d10] border border-[#1e2028] space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-['Space_Grotesk'] text-lg font-bold text-white">
                Recent Student Applications
              </h3>
              <a routerLink="/admin/students" class="text-xs font-mono text-[#ff4d1c] hover:underline">
                View All &rarr;
              </a>
            </div>

            @if (s.recentStudents && s.recentStudents.length > 0) {
              <div class="divide-y divide-[#1b1c24] text-xs">
                @for (student of s.recentStudents; track student.id) {
                  <div class="py-3 flex items-center justify-between gap-3">
                    <div class="overflow-hidden">
                      <div class="font-bold text-white truncate">{{ student.fullName }}</div>
                      <div class="text-[#727481] truncate">{{ student.course?.title || 'Course' }}</div>
                    </div>
                    <div class="text-right flex-shrink-0 space-y-1">
                      <span
                        [ngClass]="getStatusBadgeClass(student.status)"
                        class="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                        {{ student.status }}
                      </span>
                      <div class="text-[10px] text-[#5b5d69] font-mono">
                        {{ student.registeredAt | date:'mediumDate' }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-xs text-[#6f717c] italic py-4">No student registrations recorded yet.</p>
            }
          </div>

          <!-- Recent Inquiries Table -->
          <div class="p-6 rounded-xl bg-[#0c0d10] border border-[#1e2028] space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-['Space_Grotesk'] text-lg font-bold text-white">
                Recent Studio &amp; General Inquiries
              </h3>
              <a routerLink="/admin/inquiries" class="text-xs font-mono text-[#ff4d1c] hover:underline">
                View All &rarr;
              </a>
            </div>

            @if (s.recentInquiries && s.recentInquiries.length > 0) {
              <div class="divide-y divide-[#1b1c24] text-xs">
                @for (inq of s.recentInquiries; track inq.id) {
                  <div class="py-3 flex items-center justify-between gap-3">
                    <div class="overflow-hidden">
                      <div class="font-bold text-white truncate">{{ inq.name }}</div>
                      <div class="text-[#727481] truncate italic">"{{ inq.message }}"</div>
                    </div>
                    <div class="text-right flex-shrink-0 space-y-1">
                      <span
                        [class.bg-emerald-950]="inq.status === 'resolved'"
                        [class.text-emerald-400]="inq.status === 'resolved'"
                        [class.bg-amber-950]="inq.status === 'open'"
                        [class.text-amber-400]="inq.status === 'open'"
                        class="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                        {{ inq.status }}
                      </span>
                      <div class="text-[10px] text-[#ff4d1c] font-mono uppercase">
                        {{ inq.type === 'studio_project' ? 'Studio RFP' : 'Academy' }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-xs text-[#6f717c] italic py-4">No inquiries recorded yet.</p>
            }
          </div>

        </div>

      } @else if (isLoading()) {
        <div class="py-20 flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-2 border-[#ff4d1c] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-mono text-[#8e909a]">Loading Studio Metrics...</p>
        </div>
      }

    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.adminApi.getStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard stats:', err);
        this.isLoading.set(false);
      },
    });
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-blue-950 text-blue-400 border border-blue-500/30';
      case 'contacted':
        return 'bg-amber-950 text-amber-400 border border-amber-500/30';
      case 'enrolled':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-500/30';
      case 'dropped':
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  }
}
