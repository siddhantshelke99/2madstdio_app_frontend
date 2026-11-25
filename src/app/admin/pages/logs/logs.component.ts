import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, CommunicationLogRecord } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2029]">
        <div>
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c]">
            Audit Trail
          </span>
          <h1 class="font-['Space_Grotesk'] text-3xl font-extrabold text-white mt-1">
            Communication Logs
          </h1>
          <p class="text-xs text-[#8e909a] mt-1">
            Audit history of automated notifications and manual counselor messages across Email & WhatsApp.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="loadLogs()"
            class="px-4 py-2 rounded-lg bg-[#15161c] hover:bg-[#1f2028] border border-[#272935] text-xs font-mono text-[#c5c7d0] hover:text-white transition-colors flex items-center gap-2">
            <svg class="w-4 h-4 text-[#ff4d1c]" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <!-- Channel Filter -->
        <div class="sm:col-span-4">
          <label class="block text-[10px] font-mono uppercase text-[#717380] mb-1.5">Channel</label>
          <select
            [(ngModel)]="selectedChannel"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Channels</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="sm:col-span-4">
          <label class="block text-[10px] font-mono uppercase text-[#717380] mb-1.5">Status</label>
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Statuses</option>
            <option value="sent">Sent Successfully</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <!-- Recipient Type -->
        <div class="sm:col-span-4">
          <label class="block text-[10px] font-mono uppercase text-[#717380] mb-1.5">Recipient Target</label>
          <select
            [(ngModel)]="selectedRecipientType"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Recipients</option>
            <option value="student">Student Registrations</option>
            <option value="inquiry">Client Inquiries</option>
          </select>
        </div>
      </div>

      <!-- LOGS TABLE -->
      <div class="rounded-xl bg-[#0c0d10] border border-[#1e2029] overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121318] border-b border-[#1e2029] text-[#717380] font-mono uppercase tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Timestamp</th>
                <th class="py-3.5 px-4">Channel</th>
                <th class="py-3.5 px-4">Recipient</th>
                <th class="py-3.5 px-4">Template / Event</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#181920] text-[#c2c4cf]">
              @for (log of logs(); track log.id) {
                <tr class="hover:bg-[#121319] transition-colors">
                  
                  <!-- Timestamp -->
                  <td class="py-3 px-4 font-mono text-[11px] text-[#7c7e8c] whitespace-nowrap">
                    {{ log.sentAt | date:'medium' }}
                  </td>

                  <!-- Channel Badge -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    @if (log.channel === 'email') {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-medium bg-[#1d1f2a] text-[#8e909a] border border-[#2c2f40]">
                        <svg class="w-3.5 h-3.5 text-[#ff4d1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>EMAIL</span>
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                        <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>WHATSAPP</span>
                      </span>
                    }
                  </td>

                  <!-- Recipient -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#181a24] text-[#a0a2ad] border border-[#2b2d3d] mr-1.5">
                      {{ log.recipientType }}
                    </span>
                    <span class="font-mono text-[11px] text-[#8e909a]" title="{{ log.recipientId }}">
                      {{ log.recipientId.substring(0, 8) }}...
                    </span>
                  </td>

                  <!-- Template Name -->
                  <td class="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-white">
                    {{ formatTemplateName(log.templateName) }}
                  </td>

                  <!-- Status -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    @if (log.status === 'sent') {
                      <span class="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        SENT
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 text-rose-400 font-mono text-[11px] font-bold" title="{{ log.errorMessage }}">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        FAILED
                      </span>
                    }
                  </td>

                  <!-- Details Button -->
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      (click)="openDetailModal(log)"
                      class="px-2.5 py-1 rounded bg-[#16171f] hover:bg-[#20222b] border border-[#262836] text-[11px] font-mono text-[#8e909a] hover:text-white transition-colors">
                      View Payload
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-12 text-center text-[#676974] italic">
                    No communication logs found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- PAYLOAD DETAIL MODAL -->
      @if (activeLog(); as log) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="relative w-full max-w-xl rounded-2xl bg-[#131419] border border-[#272936] p-6 sm:p-8 space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-[#21232e]">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-[#ff4d1c]">
                  Log Inspector (ID: {{ log.id.substring(0, 8) }})
                </span>
                <h3 class="font-['Space_Grotesk'] text-xl font-bold text-white">
                  {{ formatTemplateName(log.templateName) }}
                </h3>
              </div>
              <button
                (click)="activeLog.set(null)"
                class="p-2 rounded-lg text-[#8e909a] hover:text-white hover:bg-[#1e2029]">
                ✕
              </button>
            </div>

            <div class="space-y-4 text-xs font-mono">
              <div class="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#191a22] border border-[#2b2d3c]">
                <div>
                  <span class="text-[10px] uppercase text-[#717380] block">Channel</span>
                  <span class="text-white">{{ log.channel | uppercase }}</span>
                </div>
                <div>
                  <span class="text-[10px] uppercase text-[#717380] block">Status</span>
                  <span [class.text-emerald-400]="log.status === 'sent'" [class.text-rose-400]="log.status === 'failed'">
                    {{ log.status | uppercase }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] uppercase text-[#717380] block">Recipient Type</span>
                  <span class="text-white">{{ log.recipientType }}</span>
                </div>
                <div>
                  <span class="text-[10px] uppercase text-[#717380] block">Sent At</span>
                  <span class="text-white">{{ log.sentAt | date:'medium' }}</span>
                </div>
              </div>

              @if (log.errorMessage) {
                <div>
                  <span class="text-[10px] uppercase text-rose-400 block mb-1">Error Diagnostics</span>
                  <div class="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
                    {{ log.errorMessage }}
                  </div>
                </div>
              }

              <div>
                <span class="text-[10px] uppercase text-[#717380] block mb-1">Payload JSON</span>
                <pre class="p-4 rounded-lg bg-[#0e0f13] border border-[#262837] text-white text-[11px] overflow-x-auto max-h-60 leading-relaxed">{{ formatPayloadJson(log.payload) }}</pre>
              </div>
            </div>

            <div class="pt-3 border-t border-[#21232e] flex justify-end">
              <button
                (click)="activeLog.set(null)"
                class="px-4 py-2 rounded bg-[#1f212b] text-white text-xs font-mono font-bold hover:bg-[#282a36]">
                Close
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
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
      .getCommunicationLogs({
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
          console.error('Failed to load communication logs:', err);
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.loadLogs();
  }

  openDetailModal(log: CommunicationLogRecord): void {
    this.activeLog.set(log);
  }

  formatTemplateName(name: string): string {
    if (!name) return 'Transactional Message';
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatPayloadJson(payload: Record<string, any>): string {
    try {
      return JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  }
}
