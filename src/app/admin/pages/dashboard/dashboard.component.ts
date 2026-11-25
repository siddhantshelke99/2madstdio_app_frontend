import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService, DashboardStats, StudentRecord, InquiryRecord } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrap">
      
      <!-- Top Section -->
      <div class="page-top-bar">
        <div>
          <span class="kicker-pill">Studio &amp; Academy Metrics</span>
          <h1 class="page-title">Executive Dashboard</h1>
        </div>

        <div class="top-actions">
          <button
            (click)="loadStats()"
            [disabled]="isLoading()"
            class="btn-refresh">
            <svg class="refresh-icon" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      @if (stats(); as s) {
        <div class="kpi-grid">
          
          <!-- Card 1: Total Students -->
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">TOTAL APPLICANTS</span>
              <span class="badge-blue">{{ s.students.byStatus.new }} New</span>
            </div>
            <div class="kpi-value">{{ s.students.total }}</div>
            <div class="kpi-foot">
              <span class="text-emerald">{{ s.students.byStatus.enrolled }} Enrolled</span> ·
              <span class="text-amber">{{ s.students.byStatus.contacted }} Contacted</span>
            </div>
          </div>

          <!-- Card 2: Open Inquiries -->
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">CLIENT INQUIRIES</span>
              <span class="badge-orange">{{ s.inquiries.byStatus.open }} Pending</span>
            </div>
            <div class="kpi-value">{{ s.inquiries.total }}</div>
            <div class="kpi-foot">
              <span>{{ s.inquiries.byType.studio_project }} Studio RFPs</span> ·
              <span>{{ s.inquiries.byType.academy_general }} Academy</span>
            </div>
          </div>

          <!-- Card 3: Active Courses -->
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">ACADEMY COURSES</span>
              <span class="badge-purple">Season 01</span>
            </div>
            <div class="kpi-value">{{ s.courses.published }} / {{ s.courses.total }}</div>
            <div class="kpi-foot">Published Masterclasses</div>
          </div>

          <!-- Card 4: Enrolled Revenue -->
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">ENROLLED REVENUE</span>
              <span class="badge-green">Confirmed</span>
            </div>
            <div class="kpi-value text-emerald">{{ formatCurrency(s.students.totalEnrolledRevenue) }}</div>
            <div class="kpi-foot">Based on paid admissions</div>
          </div>

        </div>

        <!-- RECENT ACTIVITY SECTIONS -->
        <div class="activity-grid">
          
          <!-- Recent Student Registrations Table -->
          <div class="activity-panel">
            <div class="panel-header">
              <h3 class="panel-title">Recent Student Applications</h3>
              <a routerLink="/admin/students" class="panel-link">Manage Pipeline &rarr;</a>
            </div>

            @if (s.recentStudents && s.recentStudents.length > 0) {
              <div class="activity-list">
                @for (student of s.recentStudents; track student.id) {
                  <div class="activity-item" (click)="viewStudent(student)">
                    <div class="item-main">
                      <div class="item-title">{{ student.fullName }}</div>
                      <div class="item-sub">{{ student.course?.title || 'Course' }}</div>
                    </div>
                    <div class="item-meta">
                      <span [ngClass]="getStatusBadgeClass(student.status)" class="status-pill">
                        {{ student.status }}
                      </span>
                      <div class="item-date">{{ student.registeredAt | date:'mediumDate' }}</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-text">No student registrations recorded yet.</p>
            }
          </div>

          <!-- Recent Inquiries Table -->
          <div class="activity-panel">
            <div class="panel-header">
              <h3 class="panel-title">Recent Studio &amp; RFPs</h3>
              <a routerLink="/admin/inquiries" class="panel-link">View All &rarr;</a>
            </div>

            @if (s.recentInquiries && s.recentInquiries.length > 0) {
              <div class="activity-list">
                @for (inq of s.recentInquiries; track inq.id) {
                  <div class="activity-item" (click)="viewInquiry(inq)">
                    <div class="item-main">
                      <div class="item-title">{{ inq.name }}</div>
                      <div class="item-sub italic truncate">"{{ inq.message }}"</div>
                    </div>
                    <div class="item-meta">
                      <span [class.badge-green]="inq.status === 'resolved'" [class.badge-amber]="inq.status === 'open'" class="status-pill">
                        {{ inq.status }}
                      </span>
                      <div class="type-pill">{{ inq.type === 'studio_project' ? 'Studio RFP' : 'Academy' }}</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-text">No client inquiries recorded yet.</p>
            }
          </div>

        </div>

      } @else if (isLoading()) {
        <div class="loading-wrap">
          <div class="spinner"></div>
          <p class="loading-text">Loading Studio Metrics...</p>
        </div>
      }

      <!-- DETAIL MODAL FOR STUDENT -->
      @if (selectedStudent(); as st) {
        <div class="modal-backdrop" (click)="selectedStudent.set(null)">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-top">
              <div>
                <span class="kicker-pill">Application Details</span>
                <h3 class="modal-title">{{ st.fullName }}</h3>
              </div>
              <button (click)="selectedStudent.set(null)" class="btn-close">✕</button>
            </div>
            <div class="modal-body space-y-3">
              <div class="modal-row"><span class="m-label">Email:</span><span class="m-val">{{ st.email }}</span></div>
              <div class="modal-row"><span class="m-label">Phone:</span><span class="m-val">{{ st.phone }}</span></div>
              <div class="modal-row"><span class="m-label">Course:</span><span class="m-val text-orange">{{ st.course?.title }}</span></div>
              <div class="modal-row"><span class="m-label">Status:</span><span class="m-val uppercase font-bold">{{ st.status }}</span></div>
              <div class="modal-row"><span class="m-label">Registered:</span><span class="m-val">{{ st.registeredAt | date:'medium' }}</span></div>
              @if (st.notes) {
                <div class="mt-3 p-3 rounded bg-[#17181f] border border-[#272935] text-xs">
                  <div class="text-[10px] uppercase font-bold text-[#8e909a] mb-1">Dossier / Notes:</div>
                  <pre class="font-sans whitespace-pre-wrap text-[#d0d2dd]">{{ st.notes }}</pre>
                </div>
              }
            </div>
            <div class="modal-actions">
              <a routerLink="/admin/students" (click)="selectedStudent.set(null)" class="btn-primary">Go to Students Pipeline &rarr;</a>
            </div>
          </div>
        </div>
      }

      <!-- DETAIL MODAL FOR INQUIRY -->
      @if (selectedInquiry(); as inq) {
        <div class="modal-backdrop" (click)="selectedInquiry.set(null)">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-top">
              <div>
                <span class="kicker-pill">{{ inq.type === 'studio_project' ? 'Studio Project RFP' : 'Academy Query' }}</span>
                <h3 class="modal-title">{{ inq.name }}</h3>
              </div>
              <button (click)="selectedInquiry.set(null)" class="btn-close">✕</button>
            </div>
            <div class="modal-body space-y-3">
              <div class="modal-row"><span class="m-label">Email:</span><span class="m-val">{{ inq.email }}</span></div>
              <div class="modal-row"><span class="m-label">Phone:</span><span class="m-val">{{ inq.phone }}</span></div>
              <div class="modal-row"><span class="m-label">Status:</span><span class="m-val uppercase font-bold">{{ inq.status }}</span></div>
              <div class="mt-3 p-3 rounded bg-[#17181f] border border-[#272935] text-xs">
                <div class="text-[10px] uppercase font-bold text-[#8e909a] mb-1">Message:</div>
                <p class="text-[#d0d2dd] leading-relaxed">{{ inq.message }}</p>
              </div>
            </div>
            <div class="modal-actions">
              <a routerLink="/admin/inquiries" (click)="selectedInquiry.set(null)" class="btn-primary">Manage Inquiries &rarr;</a>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .dashboard-wrap {
      padding: 32px;
      max-width: 1440px;
      margin: 0 auto;
      font-family: 'Neurial Grotesk', -apple-system, sans-serif;
      color: #f5f5f7;
    }

    .page-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      padding-bottom: 24px;
      margin-bottom: 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }
    .kicker-pill {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #ff4d1c;
      display: inline-block;
      margin-bottom: 6px;
    }
    .page-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin: 0;
      line-height: 1.2;
    }

    .btn-refresh {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-refresh:hover:not(:disabled) {
      background: #1d1f27;
      color: #ffffff;
      border-color: rgba(255, 77, 28, 0.4);
    }
    .refresh-icon {
      width: 14px;
      height: 14px;
      color: #ff4d1c;
    }

    /* KPI GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 36px;
    }
    .kpi-card {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transition: all 0.2s;
    }
    .kpi-card:hover {
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-2px);
    }
    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .kpi-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.5);
    }
    .kpi-value {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .kpi-foot {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 4px;
    }
    .text-emerald { color: #34d399; }
    .text-amber { color: #fbbf24; }
    .text-orange { color: #ff4d1c; }

    .badge-blue {
      font-size: 10px;
      font-weight: 700;
      color: #60a5fa;
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(37, 99, 235, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }
    .badge-orange {
      font-size: 10px;
      font-weight: 700;
      color: #ff6b3d;
      background: rgba(255, 77, 28, 0.15);
      border: 1px solid rgba(255, 77, 28, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }
    .badge-purple {
      font-size: 10px;
      font-weight: 700;
      color: #c084fc;
      background: rgba(147, 51, 234, 0.15);
      border: 1px solid rgba(147, 51, 234, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }
    .badge-green {
      font-size: 10px;
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }
    .badge-amber {
      font-size: 10px;
      font-weight: 700;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* ACTIVITY GRID */
    .activity-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .activity-panel {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .panel-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .panel-link {
      font-size: 12px;
      font-weight: 600;
      color: #ff4d1c;
      text-decoration: none;
    }
    .panel-link:hover {
      text-decoration: underline;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 14px;
      border-radius: 8px;
      background: #121318;
      border: 1px solid rgba(255, 255, 255, 0.04);
      cursor: pointer;
      transition: all 0.2s;
    }
    .activity-item:hover {
      background: #171820;
      border-color: rgba(255, 77, 28, 0.3);
      transform: translateX(2px);
    }
    .item-main {
      overflow: hidden;
      margin-right: 12px;
    }
    .item-title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .item-sub {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    .item-meta {
      text-align: right;
      flex-shrink: 0;
    }
    .status-pill {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .item-date {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      font-family: 'JetBrains Mono', monospace;
    }
    .type-pill {
      font-size: 10px;
      color: #ff4d1c;
      font-weight: 700;
      text-transform: uppercase;
    }
    .empty-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
      padding: 16px 0;
      text-align: center;
    }

    .loading-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      gap: 12px;
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 2px solid rgba(255, 77, 28, 0.2);
      border-top-color: #ff4d1c;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: #111216;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      max-width: 500px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }
    .modal-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .modal-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin: 4px 0 0;
    }
    .btn-close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
    }
    .btn-close:hover { color: #ffffff; }
    .modal-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .m-label { color: rgba(255, 255, 255, 0.5); }
    .m-val { color: #ffffff; font-weight: 600; }
    .modal-actions {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
    }
    .btn-primary {
      background: #ff4d1c;
      color: #ffffff;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 6px;
    }
    .btn-primary:hover {
      background: #ff6538;
    }

    @media (max-width: 900px) {
      .activity-grid {
        grid-template-columns: 1fr;
      }
      .dashboard-wrap {
        padding: 20px 16px;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);
  selectedStudent = signal<StudentRecord | null>(null);
  selectedInquiry = signal<InquiryRecord | null>(null);

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
        return 'badge-blue';
      case 'contacted':
        return 'badge-amber';
      case 'enrolled':
        return 'badge-green';
      case 'dropped':
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  }

  viewStudent(st: StudentRecord): void {
    this.selectedStudent.set(st);
  }

  viewInquiry(inq: InquiryRecord): void {
    this.selectedInquiry.set(inq);
  }
}
