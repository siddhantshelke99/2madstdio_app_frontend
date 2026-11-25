import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, InquiryRecord, InquiryStatus, InquiryType } from '../../services/admin-api.service';
import { MessageModalComponent } from '../../components/message-modal/message-modal.component';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModalComponent],
  template: `
    <div class="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2029]">
        <div>
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c]">
            Client Communications
          </span>
          <h1 class="font-['Space_Grotesk'] text-3xl font-extrabold text-white mt-1">
            Studio & Academy Inquiries
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-xs font-mono text-[#8e909a] px-3.5 py-2 rounded-lg bg-[#111216] border border-[#232532]">
            Total Inquiries: <strong class="text-white">{{ inquiries().length }}</strong>
          </div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <!-- Search -->
        <div class="sm:col-span-6 relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onFilterChange()"
            placeholder="Search by client name, email, phone, or message..."
            class="w-full px-4 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-sm text-white placeholder-[#585a67] focus:outline-none focus:border-[#ff4d1c] transition-colors" />
        </div>

        <!-- Status Filter -->
        <div class="sm:col-span-3">
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Statuses</option>
            <option value="open">Open (Needs Action)</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <!-- Type Filter -->
        <div class="sm:col-span-3">
          <select
            [(ngModel)]="selectedType"
            (ngModelChange)="onFilterChange()"
            class="w-full px-3.5 py-2.5 rounded-lg bg-[#101115] border border-[#242632] text-xs font-mono text-white focus:outline-none focus:border-[#ff4d1c] transition-colors">
            <option value="">All Inquiries</option>
            <option value="studio_project">Studio Projects (OEM/Client)</option>
            <option value="academy_general">Academy General Inquiry</option>
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

      <!-- INQUIRIES TABLE -->
      <div class="rounded-xl bg-[#0c0d10] border border-[#1e2029] overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121318] border-b border-[#1e2029] text-[#717380] font-mono uppercase tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Type</th>
                <th class="py-3.5 px-4">Message / Brief</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Date</th>
                <th class="py-3.5 px-4 text-right">Quick Reply</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#181920] text-[#c2c4cf]">
              @for (inq of inquiries(); track inq.id) {
                <tr class="hover:bg-[#121319] transition-colors">
                  
                  <!-- Contact Info -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <div class="font-semibold text-white">
                      {{ inq.name }}
                    </div>
                    <div class="font-mono text-[11px] text-[#8e909a] mt-0.5">
                      <a [href]="'mailto:' + inq.email" class="hover:text-[#ff4d1c] transition-colors">
                        {{ inq.email }}
                      </a>
                    </div>
                    <div class="font-mono text-[11px] text-[#5b5d6b]">
                      {{ inq.phone }}
                    </div>
                  </td>

                  <!-- Type Badge -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    @if (inq.type === 'studio_project') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#ff4d1c]/10 text-[#ff7149] border border-[#ff4d1c]/30">
                        Studio Project
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        Academy Query
                      </span>
                    }
                  </td>

                  <!-- Message Preview -->
                  <td class="py-3 px-4 max-w-sm">
                    <div class="line-clamp-2 text-[#b0b2be] leading-relaxed cursor-pointer hover:text-white transition-colors" (click)="openViewModal(inq)">
                      {{ inq.message }}
                    </div>
                  </td>

                  <!-- Status Toggle -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <button
                      (click)="toggleStatus(inq)"
                      [class.bg-emerald-950]="inq.status === 'resolved'"
                      [class.text-emerald-400]="inq.status === 'resolved'"
                      [class.border-emerald-700]="inq.status === 'resolved'"
                      [class.bg-amber-950]="inq.status === 'open'"
                      [class.text-amber-400]="inq.status === 'open'"
                      [class.border-amber-700]="inq.status === 'open'"
                      class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border hover:opacity-80 transition-opacity">
                      {{ inq.status === 'open' ? '● OPEN' : '✓ RESOLVED' }}
                    </button>
                  </td>

                  <!-- Date -->
                  <td class="py-3 px-4 font-mono text-[11px] text-[#696b77] whitespace-nowrap">
                    {{ inq.createdAt | date:'mediumDate' }}
                  </td>

                  <!-- Quick Reply Buttons -->
                  <td class="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      (click)="openReplyModal(inq, 'email')"
                      title="Reply via Email"
                      class="p-1.5 rounded bg-[#171820] hover:bg-[#ff4d1c] text-[#8e909a] hover:text-white border border-[#282a36] transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      (click)="openReplyModal(inq, 'whatsapp')"
                      title="Reply via WhatsApp"
                      class="p-1.5 rounded bg-[#171820] hover:bg-[#25D366] text-[#8e909a] hover:text-white border border-[#282a36] transition-colors">
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-12 text-center text-[#676974] italic">
                    No inquiries match the current filter.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- INQUIRY FULL VIEW MODAL -->
      @if (activeInquiryForView(); as inq) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="relative w-full max-w-lg rounded-2xl bg-[#131419] border border-[#272936] p-6 sm:p-8 space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-[#21232e]">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-[#ff4d1c]">
                  {{ inq.type === 'studio_project' ? 'Studio Project Brief' : 'Academy Inquiry' }}
                </span>
                <h3 class="font-['Space_Grotesk'] text-xl font-bold text-white">
                  {{ inq.name }}
                </h3>
              </div>
              <button
                (click)="activeInquiryForView.set(null)"
                class="p-2 rounded-lg text-[#8e909a] hover:text-white hover:bg-[#1e2029]">
                ✕
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#191a22] border border-[#2b2d3c]">
                <div>
                  <span class="text-[10px] font-mono uppercase text-[#737583] block">Email</span>
                  <a [href]="'mailto:' + inq.email" class="text-white hover:text-[#ff4d1c] font-mono break-all">{{ inq.email }}</a>
                </div>
                <div>
                  <span class="text-[10px] font-mono uppercase text-[#737583] block">Phone</span>
                  <span class="text-white font-mono">{{ inq.phone }}</span>
                </div>
              </div>

              <div>
                <span class="text-[10px] font-mono uppercase text-[#737583] block mb-1">Message</span>
                <div class="p-3.5 rounded-lg bg-[#191a22] border border-[#2b2d3c] text-white text-xs leading-relaxed whitespace-pre-wrap">
                  {{ inq.message }}
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-[#21232e] flex items-center justify-between">
              <button
                (click)="toggleStatus(inq)"
                class="px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-colors"
                [class.bg-emerald-950]="inq.status === 'resolved'"
                [class.text-emerald-400]="inq.status === 'resolved'"
                [class.bg-amber-950]="inq.status === 'open'"
                [class.text-amber-400]="inq.status === 'open'">
                Status: {{ inq.status | uppercase }} (Click to Toggle)
              </button>

              <div class="flex items-center gap-2">
                <button
                  (click)="openReplyModal(inq, 'email')"
                  class="px-3 py-1.5 rounded bg-[#ff4d1c] text-white text-xs font-mono font-bold">
                  Reply Email
                </button>
                <button
                  (click)="openReplyModal(inq, 'whatsapp')"
                  class="px-3 py-1.5 rounded bg-[#25D366] text-white text-xs font-mono font-bold">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- DIRECT MESSAGE MODAL -->
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
})
export class InquiriesComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  inquiries = signal<InquiryRecord[]>([]);
  isLoading = signal(true);
  toastMessage = signal<string | null>(null);

  searchQuery = '';
  selectedStatus = '';
  selectedType = '';

  activeInquiryForView = signal<InquiryRecord | null>(null);
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

  toggleStatus(inquiry: InquiryRecord): void {
    const newStatus: InquiryStatus = inquiry.status === 'open' ? 'resolved' : 'open';
    this.adminApi.updateInquiryStatus(inquiry.id, newStatus).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          inquiry.status = res.data.status;
          this.showToast(`Inquiry marked as ${newStatus.toUpperCase()}`);
        }
      },
      error: (err) => {
        console.error('Failed to toggle status:', err);
      },
    });
  }

  openViewModal(inquiry: InquiryRecord): void {
    this.activeInquiryForView.set(inquiry);
  }

  openReplyModal(inquiry: InquiryRecord, channel: 'email' | 'whatsapp'): void {
    this.activeInquiryForView.set(null);
    this.replyChannel.set(channel);
    this.activeInquiryForReply.set(inquiry);
  }

  onReplySent(clientName: string): void {
    this.showToast(`Reply dispatched to ${clientName}`);
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
