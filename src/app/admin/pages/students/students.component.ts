import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, StudentRecord, StudentStatus } from '../../services/admin-api.service';
import { MessageModalComponent } from '../../components/message-modal/message-modal.component';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModalComponent],
  template: `
    <div class="page-wrap">
      
      <!-- Page Header -->
      <div class="page-top-bar">
        <div>
          <span class="kicker-pill">Admissions Pipeline</span>
          <h1 class="page-title">Student Registrations</h1>
          <p class="page-sub">Review candidate applications, manage enrollment status, and dispatch admissions messages.</p>
        </div>

        <div class="top-actions">
          <button
            (click)="exportToCsv()"
            [disabled]="students().length === 0"
            class="btn-secondary">
            <svg class="w-4 h-4 text-[#ff4d1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            (click)="loadStudents()"
            class="btn-secondary">
            <svg class="w-4 h-4 text-[#ff4d1c]" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="filter-bar">
        <div class="search-input-wrap">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            placeholder="Search by candidate name, email, or phone..."
            class="filter-input" />
        </div>

        <div class="filter-select-wrap">
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Statuses</option>
            <option value="new">New Applications</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled / Paid</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <div class="filter-select-wrap">
          <select
            [(ngModel)]="selectedCourseId"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Academy Courses</option>
            @for (c of courses(); track c.id) {
              <option [value]="c.id">{{ c.title }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Toast Feedback -->
      @if (toastMessage()) {
        <div class="toast-alert">
          <span>{{ toastMessage() }}</span>
          <button (click)="toastMessage.set(null)" class="toast-close">✕</button>
        </div>
      }

      <!-- STUDENTS TABLE -->
      <div class="table-container">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Contact</th>
                <th>Course</th>
                <th>Status</th>
                <th>Notes / Dossier</th>
                <th>Registered</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (student of students(); track student.id) {
                <tr class="table-row">
                  
                  <!-- Candidate Name -->
                  <td>
                    <div class="candidate-name" (click)="openDossierModal(student)">
                      {{ student.fullName }}
                    </div>
                    <button type="button" class="view-dossier-link" (click)="openDossierModal(student)">
                      View Dossier &rarr;
                    </button>
                  </td>

                  <!-- Contact Details -->
                  <td>
                    <div class="contact-email">
                      <a [href]="'mailto:' + student.email">{{ student.email }}</a>
                    </div>
                    <div class="contact-phone">
                      <span>{{ student.phone }}</span>
                      @if (student.whatsappNumber) {
                        <span class="wa-badge" title="WhatsApp Verified">WA ✓</span>
                      }
                    </div>
                  </td>

                  <!-- Course -->
                  <td>
                    <div class="course-cell-title">
                      {{ student.course?.title || 'Course' }}
                    </div>
                    <span class="course-cell-mode">
                      {{ student.course?.mode | uppercase }}
                    </span>
                  </td>

                  <!-- Status Select -->
                  <td>
                    <select
                      [ngModel]="student.status"
                      (ngModelChange)="onUpdateStatus(student, $event)"
                      [ngClass]="getStatusBadgeClass(student.status)"
                      class="status-select">
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="enrolled">ENROLLED</option>
                      <option value="dropped">DROPPED</option>
                    </select>
                  </td>

                  <!-- Notes -->
                  <td class="notes-cell">
                    <button
                      (click)="openNotesModal(student)"
                      class="notes-btn">
                      {{ student.notes ? (student.notes | slice:0:45) + '...' : '+ Add Note' }}
                    </button>
                  </td>

                  <!-- Date -->
                  <td class="date-cell">
                    {{ student.registeredAt | date:'mediumDate' }}
                  </td>

                  <!-- Action Buttons -->
                  <td class="actions-cell">
                    <button
                      (click)="openMessageModal(student, 'email')"
                      title="Send Email"
                      class="btn-icon">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      (click)="openMessageModal(student, 'whatsapp')"
                      title="Send WhatsApp"
                      class="btn-icon btn-icon-wa">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty-table-cell">
                    No student applications match the specified filters.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- FULL APPLICATION DOSSIER MODAL -->
      @if (activeStudentForDossier(); as st) {
        <div class="modal-backdrop" (click)="activeStudentForDossier.set(null)">
          <div class="modal-card max-w-xl" (click)="$event.stopPropagation()">
            <div class="modal-top">
              <div>
                <span class="kicker-pill">Application Dossier</span>
                <h3 class="modal-title">{{ st.fullName }}</h3>
              </div>
              <button (click)="activeStudentForDossier.set(null)" class="btn-close">✕</button>
            </div>

            <div class="modal-body space-y-4">
              <div class="grid-2-cols">
                <div><span class="m-label">Email:</span> <div class="m-val">{{ st.email }}</div></div>
                <div><span class="m-label">Phone:</span> <div class="m-val">{{ st.phone }}</div></div>
                <div><span class="m-label">WhatsApp:</span> <div class="m-val">{{ st.whatsappNumber || 'N/A' }}</div></div>
                <div><span class="m-label">Status:</span> <div class="m-val uppercase font-bold text-orange">{{ st.status }}</div></div>
                <div><span class="m-label">Program:</span> <div class="m-val">{{ st.course?.title }}</div></div>
                <div><span class="m-label">Registered:</span> <div class="m-val">{{ st.registeredAt | date:'medium' }}</div></div>
              </div>

              @if (st.notes) {
                <div class="p-3.5 rounded bg-[#15161d] border border-[#232532] text-xs">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-[#8e909a] mb-1.5">Submitted Application Details:</div>
                  <pre class="font-sans whitespace-pre-wrap text-[#d0d2dd] leading-relaxed">{{ st.notes }}</pre>
                </div>
              }
            </div>

            <div class="modal-actions gap-2">
              <button (click)="openMessageModal(st, 'whatsapp')" class="btn-modal-wa">WhatsApp Candidate</button>
              <button (click)="openMessageModal(st, 'email')" class="btn-modal-email">Email Candidate</button>
              <button (click)="activeStudentForDossier.set(null)" class="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      }

      <!-- NOTES EDIT MODAL -->
      @if (activeStudentForNotes(); as s) {
        <div class="modal-backdrop" (click)="activeStudentForNotes.set(null)">
          <div class="modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="modal-top">
              <div>
                <span class="kicker-pill">Counselor Notes</span>
                <h3 class="modal-title">{{ s.fullName }}</h3>
              </div>
              <button (click)="activeStudentForNotes.set(null)" class="btn-close">✕</button>
            </div>
            <textarea
              [(ngModel)]="tempNotes"
              rows="6"
              placeholder="Internal counselor notes, payment details, portfolio critique..."
              class="w-full px-3.5 py-2.5 rounded-lg bg-[#14151a] border border-[#272935] text-white text-xs focus:outline-none focus:border-[#ff4d1c]"></textarea>
            <div class="modal-actions">
              <button (click)="activeStudentForNotes.set(null)" class="btn-secondary">Cancel</button>
              <button (click)="saveNotes(s)" class="btn-primary">Save Notes</button>
            </div>
          </div>
        </div>
      }

      <!-- DIRECT MESSAGE MODAL COMPONENT -->
      @if (activeStudentForMessage(); as s) {
        <app-message-modal
          recipientType="student"
          [recipientId]="s.id"
          [recipientName]="s.fullName"
          [recipientTarget]="messageChannel() === 'email' ? s.email : (s.whatsappNumber || s.phone)"
          [initialChannel]="messageChannel()"
          (close)="activeStudentForMessage.set(null)"
          (sent)="onMessageSent(s.fullName)">
        </app-message-modal>
      }

    </div>
  `,
  styles: [`
    .page-wrap {
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
      margin-bottom: 28px;
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
      margin: 0 0 6px;
      line-height: 1.2;
    }
    .page-sub {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-secondary {
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
    .btn-secondary:hover:not(:disabled) {
      background: #1d1f27;
      color: #ffffff;
      border-color: rgba(255, 77, 28, 0.4);
    }
    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* FILTERS */
    .filter-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .filter-input {
      width: 100%;
      background: #0f1014;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      color: #ffffff;
      outline: none;
      box-sizing: border-box;
    }
    .filter-input:focus {
      border-color: #ff4d1c;
      box-shadow: 0 0 0 2px rgba(255, 77, 28, 0.2);
    }
    .filter-select {
      width: 100%;
      background: #0f1014;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      color: #ffffff;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
    }
    .filter-select:focus {
      border-color: #ff4d1c;
    }

    /* TABLE */
    .table-container {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    .data-table thead {
      background: #121318;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .data-table th {
      padding: 14px 16px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
    }
    .data-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      vertical-align: middle;
    }
    .table-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .candidate-name {
      font-weight: 700;
      color: #ffffff;
      cursor: pointer;
    }
    .candidate-name:hover {
      color: #ff4d1c;
    }
    .view-dossier-link {
      background: none;
      border: none;
      color: #ff4d1c;
      font-size: 11px;
      cursor: pointer;
      padding: 0;
      margin-top: 2px;
      display: inline-block;
    }
    .view-dossier-link:hover { text-decoration: underline; }

    .contact-email a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 12px;
    }
    .contact-email a:hover { color: #ff4d1c; }
    .contact-phone {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }
    .wa-badge {
      font-size: 9px;
      color: #34d399;
      font-weight: 700;
    }

    .course-cell-title {
      font-weight: 600;
      color: #ffffff;
    }
    .course-cell-mode {
      font-size: 10px;
      color: #ff4d1c;
      font-weight: 700;
    }

    .status-select {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      outline: none;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .badge-blue { background: rgba(37, 99, 235, 0.2); color: #60a5fa; border-color: rgba(37, 99, 235, 0.4); }
    .badge-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); }
    .badge-emerald { background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4); }
    .badge-zinc { background: rgba(113, 113, 122, 0.2); color: #a1a1aa; border-color: rgba(113, 113, 122, 0.4); }

    .notes-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      padding: 0;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    .notes-btn:hover { color: #ffffff; text-decoration: underline; }

    .date-cell {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      white-space: nowrap;
    }

    .actions-cell {
      text-align: right;
      white-space: nowrap;
    }
    .btn-icon {
      padding: 6px;
      border-radius: 6px;
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 6px;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      background: #ff4d1c;
      color: #ffffff;
      border-color: #ff4d1c;
    }
    .btn-icon-wa:hover {
      background: #22c55e;
      color: #ffffff;
      border-color: #22c55e;
    }

    .empty-table-cell {
      padding: 40px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
    }

    .toast-alert {
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .toast-close {
      background: none;
      border: none;
      color: #34d399;
      cursor: pointer;
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

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 13px;
    }
    .m-label { font-size: 11px; color: rgba(255, 255, 255, 0.45); }
    .m-val { color: #ffffff; font-weight: 600; margin-top: 2px; }
    .text-orange { color: #ff4d1c; }

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
      border: none;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-primary:hover { background: #ff6538; }

    .btn-modal-wa {
      background: #22c55e;
      color: #ffffff;
      border: none;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-modal-wa:hover { background: #16a34a; }

    .btn-modal-email {
      background: #ff4d1c;
      color: #ffffff;
      border: none;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-modal-email:hover { background: #ff6538; }

    @media (max-width: 768px) {
      .filter-bar { grid-template-columns: 1fr; }
      .page-wrap { padding: 20px 16px; }
    }
  `],
})
export class StudentsComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  students = signal<StudentRecord[]>([]);
  courses = signal<Course[]>([]);
  isLoading = signal(true);
  toastMessage = signal<string | null>(null);

  searchQuery = '';
  selectedStatus = '';
  selectedCourseId = '';

  activeStudentForDossier = signal<StudentRecord | null>(null);
  activeStudentForNotes = signal<StudentRecord | null>(null);
  tempNotes = '';

  activeStudentForMessage = signal<StudentRecord | null>(null);
  messageChannel = signal<'email' | 'whatsapp'>('email');

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminApi.getCourses().subscribe({
      next: (res) => {
        if (res.data) this.courses.set(res.data);
      },
    });
  }

  loadStudents(): void {
    this.isLoading.set(true);
    this.adminApi
      .getStudents({
        search: this.searchQuery.trim() || undefined,
        status: this.selectedStatus || undefined,
        courseId: this.selectedCourseId || undefined,
      })
      .subscribe({
        next: (res) => {
          if (res.data) this.students.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load students:', err);
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.loadStudents();
  }

  onUpdateStatus(student: StudentRecord, newStatus: StudentStatus): void {
    this.adminApi.updateStudentStatus(student.id, newStatus, student.notes).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          student.status = res.data.status;
          this.showToast(`Updated ${student.fullName} status to "${newStatus.toUpperCase()}"`);
        }
      },
      error: (err) => console.error('Status update failed:', err),
    });
  }

  openDossierModal(student: StudentRecord): void {
    this.activeStudentForDossier.set(student);
  }

  openNotesModal(student: StudentRecord): void {
    this.tempNotes = student.notes || '';
    this.activeStudentForNotes.set(student);
  }

  saveNotes(student: StudentRecord): void {
    this.adminApi.updateStudentStatus(student.id, student.status, this.tempNotes).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          student.notes = res.data.notes;
          this.activeStudentForNotes.set(null);
          this.showToast(`Saved notes for ${student.fullName}`);
        }
      },
      error: (err) => console.error('Save notes failed:', err),
    });
  }

  openMessageModal(student: StudentRecord, channel: 'email' | 'whatsapp'): void {
    this.messageChannel.set(channel);
    this.activeStudentForMessage.set(student);
  }

  onMessageSent(studentName: string): void {
    this.showToast(`Message dispatched successfully to ${studentName}`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'new': return 'badge-blue';
      case 'contacted': return 'badge-amber';
      case 'enrolled': return 'badge-emerald';
      case 'dropped': return 'badge-zinc';
      default: return 'badge-zinc';
    }
  }

  exportToCsv(): void {
    const list = this.students();
    if (list.length === 0) return;

    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'WhatsApp', 'Course', 'Status', 'Notes', 'Registered At'];
    const rows = list.map((s) => [
      `"${s.id}"`,
      `"${s.fullName}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.whatsappNumber || ''}"`,
      `"${s.course?.title || ''}"`,
      `"${s.status}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      `"${s.registeredAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `2nomads_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
