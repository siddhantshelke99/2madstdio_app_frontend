import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, CommunicationLogRecord } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrap">
      
      <!-- Page Header -->
      <div class="page-top-bar">
        <div>
          <span class="kicker-pill">Audit Trail</span>
          <h1 class="page-title">Communication Logs</h1>
          <p class="page-sub">Audit history of automated onboarding confirmations and manual counselor messages across Email &amp; WhatsApp.</p>
        </div>

        <div class="top-actions">
          <button
            (click)="loadLogs()"
            class="btn-secondary">
            <svg class="w-4 h-4 text-[#ff4d1c]" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-bar">
        <div class="filter-group">
          <label class="filter-label">Channel</label>
          <select
            [(ngModel)]="selectedChannel"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Channels</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Statuses</option>
            <option value="sent">Sent Successfully</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Recipient Target</label>
          <select
            [(ngModel)]="selectedRecipientType"
            (ngModelChange)="onFilterChange()"
            class="filter-select">
            <option value="">All Recipients</option>
            <option value="student">Student Registrations</option>
            <option value="inquiry">Client Inquiries</option>
          </select>
        </div>
      </div>

      <!-- LOGS TABLE -->
      <div class="table-container">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Channel</th>
                <th>Recipient</th>
                <th>Template / Event</th>
                <th>Status</th>
                <th class="text-right">Payload Details</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr class="table-row">
                  
                  <!-- Timestamp -->
                  <td class="date-cell">
                    {{ log.sentAt | date:'medium' }}
                  </td>

                  <!-- Channel Badge -->
                  <td>
                    @if (log.channel === 'email') {
                      <span class="channel-badge email-badge">
                        <svg class="w-3.5 h-3.5 text-[#ff4d1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>EMAIL</span>
                      </span>
                    } @else {
                      <span class="channel-badge wa-badge">
                        <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>WHATSAPP</span>
                      </span>
                    }
                  </td>

                  <!-- Recipient -->
                  <td>
                    <span class="type-pill mr-1.5">{{ log.recipientType }}</span>
                    <span class="font-mono text-xs text-[#8e909a]" title="{{ log.recipientId }}">
                      {{ log.recipientId.substring(0, 8) }}...
                    </span>
                  </td>

                  <!-- Template Name -->
                  <td class="font-mono text-xs text-white">
                    {{ formatTemplateName(log.templateName) }}
                  </td>

                  <!-- Status -->
                  <td>
                    @if (log.status === 'sent') {
                      <span class="status-sent">● SENT</span>
                    } @else {
                      <span class="status-failed" title="{{ log.errorMessage }}">✕ FAILED</span>
                    }
                  </td>

                  <!-- Details Button -->
                  <td class="actions-cell">
                    <button
                      (click)="openDetailModal(log)"
                      class="btn-detail">
                      View Payload
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-table-cell">
                    No communication logs found matching the filter criteria.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- LOG PAYLOAD MODAL -->
      @if (activeLog(); as log) {
        <div class="modal-backdrop" (click)="activeLog.set(null)">
          <div class="modal-card max-w-lg" (click)="$event.stopPropagation()">
            <div class="modal-top">
              <div>
                <span class="kicker-pill">Payload Details</span>
                <h3 class="modal-title">{{ log.templateName }}</h3>
              </div>
              <button (click)="activeLog.set(null)" class="btn-close">✕</button>
            </div>

            <div class="modal-body space-y-3">
              <div class="modal-row"><span class="m-label">Channel:</span><span class="m-val uppercase font-bold">{{ log.channel }}</span></div>
              <div class="modal-row"><span class="m-label">Status:</span><span class="m-val font-bold" [class.text-emerald]="log.status === 'sent'" [class.text-rose]="log.status === 'failed'">{{ log.status }}</span></div>
              <div class="modal-row"><span class="m-label">Timestamp:</span><span class="m-val">{{ log.sentAt | date:'medium' }}</span></div>
              <div class="modal-row"><span class="m-label">Recipient ID:</span><span class="m-val font-mono text-xs">{{ log.recipientId }}</span></div>

              @if (log.errorMessage) {
                <div class="p-3 rounded bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                  <strong>Error Message:</strong> {{ log.errorMessage }}
                </div>
              }

              <div class="p-3.5 rounded bg-[#14151a] border border-[#272935] text-xs">
                <div class="text-[10px] uppercase font-bold text-[#8e909a] mb-1.5">Dispatched Payload JSON:</div>
                <pre class="font-mono text-[11px] text-[#38bdf8] overflow-x-auto p-2 bg-[#090a0d] rounded">{{ log.payload | json }}</pre>
              </div>
            </div>

            <div class="modal-actions">
              <button (click)="activeLog.set(null)" class="btn-secondary">Close</button>
            </div>
          </div>
        </div>
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
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .filter-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
    }
    .filter-select {
      background: #0f1014;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      color: #ffffff;
      outline: none;
      cursor: pointer;
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

    .date-cell { font-size: 11px; color: rgba(255, 255, 255, 0.45); white-space: nowrap; font-family: 'JetBrains Mono', monospace; }

    .channel-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .email-badge { background: #1a1b24; color: #a1a3b0; border: 1px solid #282a3a; }
    .wa-badge { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

    .type-pill {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      background: #14151c;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      color: #8e909a;
    }

    .status-sent {
      font-size: 11px;
      font-weight: 700;
      color: #34d399;
      font-family: 'JetBrains Mono', monospace;
    }
    .status-failed {
      font-size: 11px;
      font-weight: 700;
      color: #f87171;
      font-family: 'JetBrains Mono', monospace;
    }

    .actions-cell { text-align: right; white-space: nowrap; }
    .btn-detail {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-detail:hover { background: #20222c; border-color: rgba(255, 255, 255, 0.25); }

    .empty-table-cell { padding: 40px; text-align: center; color: rgba(255, 255, 255, 0.4); font-style: italic; }

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
    .text-emerald { color: #34d399; }
    .text-rose { color: #f87171; }

    .modal-actions {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .filter-bar { grid-template-columns: 1fr; }
      .page-wrap { padding: 20px 16px; }
    }
  `],
})
export class LogsComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  logs = signal<CommunicationLogRecord[]>([]);
  isLoading = signal(true);
  selectedChannel = '';
  selectedStatus = '';
  selectedRecipientType = '';

  activeLog = signal<CommunicationLogRecord | null>(null);

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading.set(true);
    this.adminApi
      .getLogs({
        channel: this.selectedChannel || undefined,
        status: this.selectedStatus || undefined,
        recipientType: this.selectedRecipientType || undefined,
      })
      .subscribe({
        next: (res) => {
          if (res.data) this.logs.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load logs:', err);
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.loadLogs();
  }

  formatTemplateName(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  openDetailModal(log: CommunicationLogRecord): void {
    this.activeLog.set(log);
  }
}
