import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, InquiryRecord } from '../../services/admin-api.service';
import { MessageModalComponent } from '../../components/message-modal/message-modal.component';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModalComponent],
  template: `
    <div class="page-wrap">
      
      <!-- Page Header -->
      <div class="page-top-bar">
        <div>
          <span class="kicker-pill">Client Communications</span>
          <h1 class="page-title">Studio &amp; Academy Inquiries</h1>
          <p class="page-sub">OEM project RFPs, clay modeling contracts, and general academy admissions queries.</p>
        </div>

        <div class="top-actions">
          <div class="stat-pill">
            Total Inquiries: <strong class="text-white">{{ inquiries().length }}</strong>
          </div>
          <button
            (click)="loadInquiries()"
            class="btn-secondary">
            <svg class="w-4 h-4 text-[#ff4d1c]" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-bar">
        <div class="search-input-wrap">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            placeholder="Search by client name, email, phone, or message text..."
            class="filter-input" />
        </div>

        <div class="filter-select-wrap">
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Statuses</option>
            <option value="open">Open (Needs Attention)</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div class="filter-select-wrap">
          <select
            [(ngModel)]="selectedType"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Inquiries</option>
            <option value="studio_project">Studio Projects (OEM / Client)</option>
            <option value="academy_general">Academy General Inquiry</option>
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

      <!-- INQUIRIES TABLE -->
      <div class="table-container">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Type</th>
                <th>Message Brief</th>
                <th>Status</th>
                <th>Received</th>
                <th class="text-right">Quick Reply</th>
              </tr>
            </thead>
            <tbody>
              @for (inq of inquiries(); track inq.id) {
                <tr class="table-row">
                  
                  <!-- Contact Info -->
                  <td>
                    <div class="client-name" (click)="openViewModal(inq)">{{ inq.name }}</div>
                    <div class="client-email">
                      <a [href]="'mailto:' + inq.email">{{ inq.email }}</a>
                    </div>
                    <div class="client-phone">{{ inq.phone }}</div>
                  </td>

                  <!-- Type Badge -->
                  <td>
                    @if (inq.type === 'studio_project') {
                      <span class="badge-studio">
                        Studio RFP
                      </span>
                    } @else {
                      <span class="badge-academy">
                        Academy Query
                      </span>
                    }
                  </td>

                  <!-- Message Preview -->
                  <td class="msg-cell" (click)="openViewModal(inq)">
                    <div class="msg-preview">
                      {{ inq.message }}
                    </div>
                  </td>

                  <!-- Status Toggle -->
                  <td>
                    <button
                      (click)="toggleStatus(inq)"
                      [class.badge-emerald]="inq.status === 'resolved'"
                      [class.badge-amber]="inq.status === 'open'"
                      class="status-toggle-btn">
                      {{ inq.status === 'open' ? '● OPEN' : '✓ RESOLVED' }}
                    </button>
                  </td>

                  <!-- Date -->
                  <td class="date-cell">
                    {{ inq.createdAt | date:'mediumDate' }}
                  </td>

                  <!-- Quick Reply Buttons -->
                  <td class="actions-cell">
                    <button
                      (click)="openReplyModal(inq, 'email')"
                      title="Reply via Email"
                      class="btn-icon">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      (click)="openReplyModal(inq, 'whatsapp')"
                      title="Reply via WhatsApp"
                      class="btn-icon btn-icon-wa">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-table-cell">
                    No inquiries match the specified criteria.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- FULL INQUIRY DETAIL MODAL -->
      @if (activeInquiry(); as inq) {
        <div class="modal-backdrop" (click)="activeInquiry.set(null)">
          <div class="modal-card max-w-lg" (click)="$event.stopPropagation()">
            <div class="modal-top">
              <div>
                <span class="kicker-pill">
                  {{ inq.type === 'studio_project' ? 'Studio Project RFP' : 'Academy General Query' }}
                </span>
                <h3 class="modal-title">{{ inq.name }}</h3>
              </div>
              <button (click)="activeInquiry.set(null)" class="btn-close">✕</button>
            </div>

            <div class="modal-body space-y-3">
              <div class="modal-row"><span class="m-label">Email:</span><span class="m-val">{{ inq.email }}</span></div>
              <div class="modal-row"><span class="m-label">Phone:</span><span class="m-val">{{ inq.phone }}</span></div>
              <div class="modal-row"><span class="m-label">Status:</span><span class="m-val uppercase font-bold text-orange">{{ inq.status }}</span></div>
              <div class="modal-row"><span class="m-label">Received At:</span><span class="m-val">{{ inq.createdAt | date:'medium' }}</span></div>

              <div class="mt-3 p-3.5 rounded bg-[#14151a] border border-[#272935] text-xs">
                <div class="text-[10px] uppercase font-bold text-[#8e909a] mb-1.5">Project Scope / Message:</div>
                <p class="text-[#d0d2dd] leading-relaxed whitespace-pre-wrap">{{ inq.message }}</p>
              </div>
            </div>

            <div class="modal-actions gap-2">
              <button (click)="openReplyModal(inq, 'whatsapp')" class="btn-modal-wa">Reply via WhatsApp</button>
              <button (click)="openReplyModal(inq, 'email')" class="btn-modal-email">Reply via Email</button>
              <button (click)="activeInquiry.set(null)" class="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      }

      <!-- DIRECT MESSAGE / REPLY MODAL -->
      @if (activeInquiryForReply(); as inq) {
        <app-message-modal
          recipientType="inquiry"
          [recipientId]="inq.id"
          [recipientName]="inq.name"
          [recipientTarget]="replyChannel() === 'email' ? inq.email : inq.phone"
          [initialChannel]="replyChannel()"
          (close)="activeInquiryForReply.set(null)"
          (sent)="onReplySent(inq.name)">
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
    .stat-pill {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px 14px;
      border-radius: 8px;
    }

    .btn-secondary {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-secondary:hover { background: #1d1f27; color: #ffffff; }

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
    .filter-input:focus { border-color: #ff4d1c; }
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
    .table-row:hover { background: rgba(255, 255, 255, 0.02); }

    .client-name { font-weight: 700; color: #ffffff; cursor: pointer; }
    .client-name:hover { color: #ff4d1c; }
    .client-email a { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 12px; }
    .client-email a:hover { color: #ff4d1c; }
    .client-phone { font-size: 11px; color: rgba(255, 255, 255, 0.45); }

    .badge-studio {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(255, 77, 28, 0.12);
      color: #ff6b3d;
      border: 1px solid rgba(255, 77, 28, 0.25);
      padding: 3px 8px;
      border-radius: 4px;
    }
    .badge-academy {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(59, 130, 246, 0.12);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 3px 8px;
      border-radius: 4px;
    }

    .msg-cell { cursor: pointer; }
    .msg-preview {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.4;
      font-size: 12px;
      max-width: 320px;
    }
    .msg-cell:hover .msg-preview { color: #ffffff; }

    .status-toggle-btn {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .badge-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }
    .badge-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); }

    .date-cell { font-size: 11px; color: rgba(255, 255, 255, 0.45); white-space: nowrap; }

    .actions-cell { text-align: right; white-space: nowrap; }
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
    .btn-icon:hover { background: #ff4d1c; color: #ffffff; border-color: #ff4d1c; }
    .btn-icon-wa:hover { background: #22c55e; color: #ffffff; border-color: #22c55e; }

    .empty-table-cell { padding: 40px; text-align: center; color: rgba(255, 255, 255, 0.4); font-style: italic; }

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
    .toast-close { background: none; border: none; color: #34d399; cursor: pointer; }

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
    .modal-title { font-size: 18px; font-weight: 700; color: #ffffff; margin: 4px 0 0; }
    .btn-close { background: none; border: none; color: rgba(255, 255, 255, 0.6); font-size: 16px; cursor: pointer; padding: 4px; }
    .btn-close:hover { color: #ffffff; }

    .modal-row { display: flex; justify-content: space-between; font-size: 13px; }
    .m-label { color: rgba(255, 255, 255, 0.45); }
    .m-val { color: #ffffff; font-weight: 600; }
    .text-orange { color: #ff4d1c; }

    .modal-actions {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
    }
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
export class InquiriesComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  inquiries = signal<InquiryRecord[]>([]);
  isLoading = signal(true);
  toastMessage = signal<string | null>(null);

  searchQuery = '';
  selectedStatus = '';
  selectedType = '';

  activeInquiry = signal<InquiryRecord | null>(null);
  activeInquiryForReply = signal<InquiryRecord | null>(null);
  replyChannel = signal<'email' | 'whatsapp'>('email');

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {
    this.isLoading.set(true);
    this.adminApi
      .getInquiries({
        search: this.searchQuery.trim() || undefined,
        status: this.selectedStatus || undefined,
        type: this.selectedType || undefined,
      })
      .subscribe({
        next: (res) => {
          if (res.data) this.inquiries.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load inquiries:', err);
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.loadInquiries();
  }

  toggleStatus(inq: InquiryRecord): void {
    const newStatus = inq.status === 'open' ? 'resolved' : 'open';
    this.adminApi.updateInquiryStatus(inq.id, newStatus).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          inq.status = res.data.status;
          this.showToast(`Inquiry from ${inq.name} marked as ${inq.status.toUpperCase()}`);
        }
      },
      error: (err) => console.error('Status update failed:', err),
    });
  }

  openViewModal(inq: InquiryRecord): void {
    this.activeInquiry.set(inq);
  }

  openReplyModal(inq: InquiryRecord, channel: 'email' | 'whatsapp'): void {
    this.replyChannel.set(channel);
    this.activeInquiryForReply.set(inq);
  }

  onReplySent(clientName: string): void {
    this.showToast(`Reply dispatched to ${clientName}`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
