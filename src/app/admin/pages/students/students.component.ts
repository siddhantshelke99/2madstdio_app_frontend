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
    <div class="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      <!-- Page Header & Action Ribbon -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2029]">
        <div>
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c]">
            Admissions Pipeline
          </span>
          <h1 class="font-['Space_Grotesk'] text-3xl font-extrabold text-white mt-1">
            Student Registrations
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- CSV Export Button -->
          <button
            (click)="exportToCsv()"
            [disabled]="students().length === 0"
            class="px-4 py-2.5 rounded-lg bg-[#15161c] hover:bg-[#1f2028] border border-[#272935] text-xs font-mono text-[#c5c7d0] hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4 text-[#ff4d1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <!-- Search -->
        <div class="sm:col-span-5 relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            placeholder="Search by student name, email, or phone..."
            class="w-full px-4 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-sm text-white placeholder-[#585a67] focus:outline-none focus:border-[#ff4d1c] transition-colors" />
        </div>

        <!-- Status Filter -->
        <div class="sm:col-span-3">
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Statuses</option>
            <option value="new">New Applications</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled / Paid</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <!-- Course Filter -->
        <div class="sm:col-span-4">
          <select
            [(ngModel)]="selectedCourseId"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Academy Courses</option>
            @for (c of courses(); track c.id) {
              <option [value]="c.id">{{ c.title }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Toast Feedback -->
      @if (toastMessage()) {
        <div class="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <span>{{ toastMessage() }}</span>
          <button (click)="toastMessage.set(null)" class="text-emerald-400 hover:text-white">✕</button>
        </div>
      }

      <!-- STUDENTS TABLE -->
      <div class="rounded-xl bg-[#0c0d10] border border-[#1e2029] overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121318] border-b border-[#1e2029] text-[#717380] font-mono uppercase tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Student</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Course</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Notes</th>
                <th class="py-3.5 px-4">Date</th>
                <th class="py-3.5 px-4 text-right">Quick Message</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#181920] text-[#c2c4cf]">
              @for (student of students(); track student.id) {
                <tr class="hover:bg-[#121319] transition-colors">
                  
                  <!-- Student Name -->
                  <td class="py-3 px-4 font-semibold text-white whitespace-nowrap">
                    {{ student.fullName }}
                  </td>

                  <!-- Contact Details -->
                  <td class="py-3 px-4 space-y-0.5 whitespace-nowrap font-mono text-[11px]">
                    <div>
                      <a [href]="'mailto:' + student.email" class="text-[#8e909a] hover:text-[#ff4d1c] transition-colors">
                        {{ student.email }}
                      </a>
                    </div>
                    <div class="text-[#646673] flex items-center gap-1.5">
                      <span>{{ student.phone }}</span>
                      @if (student.whatsappNumber) {
                        <span class="text-emerald-400 text-[10px]" title="WhatsApp Verified">WA ✓</span>
                      }
                    </div>
                  </td>

                  <!-- Course -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="text-white font-medium block">
                      {{ student.course?.title || 'Course' }}
                    </span>
                    <span class="text-[10px] font-mono text-[#ff4d1c]">
                      {{ student.course?.mode | uppercase }}
                    </span>
                  </td>

                  <!-- Inline Status Dropdown -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <select
                      [ngModel]="student.status"
                      (ngModelChange)="onUpdateStatus(student, $event)"
                      [ngClass]="getStatusBadgeClass(student.status)"
                      class="px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase cursor-pointer border border-[#2d2f3c] focus:outline-none">
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="enrolled">ENROLLED</option>
                      <option value="dropped">DROPPED</option>
                    </select>
                  </td>

                  <!-- Notes (Clickable) -->
                  <td class="py-3 px-4 max-w-xs truncate text-[#888a96]">
                    <button
                      (click)="openNotesModal(student)"
                      class="text-left hover:text-white transition-colors underline underline-offset-2">
                      {{ student.notes || '+ Add Note' }}
                    </button>
                  </td>

                  <!-- Date -->
                  <td class="py-3 px-4 font-mono text-[11px] text-[#696b77] whitespace-nowrap">
                    {{ student.registeredAt | date:'mediumDate' }}
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      (click)="openMessageModal(student, 'email')"
                      title="Send Follow-up Email"
                      class="p-1.5 rounded bg-[#171820] hover:bg-[#ff4d1c] text-[#8e909a] hover:text-white border border-[#282a36] transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      (click)="openMessageModal(student, 'whatsapp')"
                      title="Send WhatsApp Message"
                      class="p-1.5 rounded bg-[#171820] hover:bg-[#25D366] text-[#8e909a] hover:text-white border border-[#282a36] transition-colors">
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-12 text-center text-[#676974] italic">
                    No student applications match the specified criteria.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- NOTES EDIT MODAL -->
      @if (activeStudentForNotes(); as s) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="relative w-full max-w-md rounded-2xl bg-[#131419] border border-[#272936] p-6 space-y-4">
            <h3 class="font-['Space_Grotesk'] text-lg font-bold text-white">
              Edit Internal Notes for {{ s.fullName }}
            </h3>
            <textarea
              [(ngModel)]="tempNotes"
              rows="4"
              placeholder="Internal counselor notes, payment details, portfolio critique..."
              class="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1b22] border border-[#2d2f3d] text-white text-xs focus:outline-none focus:border-[#ff4d1c]"></textarea>
            <div class="flex justify-end gap-2 pt-2">
              <button
                (click)="activeStudentForNotes.set(null)"
                class="px-3.5 py-2 rounded text-xs font-mono text-[#8e909a] hover:text-white">
                Cancel
              </button>
              <button
                (click)="saveNotes(s)"
                class="px-4 py-2 rounded bg-[#ff4d1c] text-white font-mono text-xs font-bold uppercase">
                Save Notes
              </button>
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
      case 'new':
        return 'bg-blue-950 text-blue-400';
      case 'contacted':
        return 'bg-amber-950 text-amber-400';
      case 'enrolled':
        return 'bg-emerald-950 text-emerald-400';
      case 'dropped':
        return 'bg-zinc-800 text-zinc-400';
      default:
        return 'bg-zinc-800 text-zinc-400';
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
