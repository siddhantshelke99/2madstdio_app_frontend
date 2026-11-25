import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService, SendMessagePayload } from '../../services/admin-api.service';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div class="relative w-full max-w-lg rounded-2xl bg-[#131419] border border-[#262835] shadow-2xl p-6 sm:p-8 space-y-6">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-[#222430]">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-[#ff4d1c]">
              Direct Dispatch
            </span>
            <h3 class="font-['Space_Grotesk'] text-xl font-bold text-white">
              Send Communication
            </h3>
            <p class="text-xs text-[#8e909a] mt-0.5">
              To: <strong class="text-white">{{ recipientName }}</strong> ({{ recipientTarget }})
            </p>
          </div>
          <button
            (click)="onCancel()"
            class="p-2 rounded-lg text-[#8e909a] hover:text-white hover:bg-[#1e2029] transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (errorMessage()) {
          <div class="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
            {{ errorMessage() }}
          </div>
        }

        <!-- Form -->
        <form [formGroup]="messageForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <!-- Channel Selection -->
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-[#a0a2ad] mb-2">
              Communication Channel
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                (click)="setChannel('email')"
                [class.bg-[#ff4d1c]]="messageForm.get('channel')?.value === 'email'"
                [class.text-white]="messageForm.get('channel')?.value === 'email'"
                [class.bg-[#191a22]]="messageForm.get('channel')?.value !== 'email'"
                [class.text-[#8e909a]]="messageForm.get('channel')?.value !== 'email'"
                class="p-3 rounded-lg border border-[#2a2c3a] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </button>

              <button
                type="button"
                (click)="setChannel('whatsapp')"
                [class.bg-[#25D366]]="messageForm.get('channel')?.value === 'whatsapp'"
                [class.text-white]="messageForm.get('channel')?.value === 'whatsapp'"
                [class.bg-[#191a22]]="messageForm.get('channel')?.value !== 'whatsapp'"
                [class.text-[#8e909a]]="messageForm.get('channel')?.value !== 'whatsapp'"
                class="p-3 rounded-lg border border-[#2a2c3a] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          <!-- Email Subject (only visible when channel is email) -->
          @if (messageForm.get('channel')?.value === 'email') {
            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-[#a0a2ad] mb-1.5">
                Subject Line <span class="text-[#ff4d1c]">*</span>
              </label>
              <input
                type="text"
                formControlName="subject"
                placeholder="e.g. 2NOMADS Academy: Portfolio Review & Studio Tour"
                class="w-full px-3.5 py-2.5 rounded-lg bg-[#191a22] border border-[#2b2d3c] text-white text-sm focus:outline-none focus:border-[#ff4d1c] transition-colors" />
            </div>
          }

          <!-- Message Body -->
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-[#a0a2ad] mb-1.5">
              Message Content <span class="text-[#ff4d1c]">*</span>
            </label>
            <textarea
              formControlName="message"
              rows="5"
              placeholder="Write your direct note here..."
              class="w-full px-3.5 py-2.5 rounded-lg bg-[#191a22] border border-[#2b2d3c] text-white text-sm focus:outline-none focus:border-[#ff4d1c] transition-colors"></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="pt-3 border-t border-[#222430] flex items-center justify-end gap-3">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 rounded text-xs font-mono text-[#8e909a] hover:text-white transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="isSending()"
              class="px-5 py-2.5 rounded bg-[#ff4d1c] hover:bg-[#ff6538] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2">
              @if (isSending()) {
                <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              } @else {
                <span>Dispatch {{ messageForm.get('channel')?.value | uppercase }}</span>
              }
            </button>
          </div>

        </form>

      </div>
    </div>
  `,
})
export class MessageModalComponent {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);

  @Input() recipientType: 'student' | 'inquiry' = 'student';
  @Input() recipientId = '';
  @Input() recipientName = '';
  @Input() recipientTarget = ''; // email or phone
  @Input() initialChannel: 'email' | 'whatsapp' = 'email';

  @Output() close = new EventEmitter<void>();
  @Output() sent = new EventEmitter<void>();

  isSending = signal(false);
  errorMessage = signal<string | null>(null);

  messageForm: FormGroup = this.fb.group({
    channel: [this.initialChannel, Validators.required],
    subject: ['Follow-up from 2NOMADS Studio & Academy'],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  setChannel(channel: 'email' | 'whatsapp'): void {
    this.messageForm.patchValue({ channel });
  }

  onSubmit(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.isSending.set(true);
    this.errorMessage.set(null);

    const formVal = this.messageForm.value;
    const payload: SendMessagePayload = {
      recipientType: this.recipientType,
      recipientId: this.recipientId,
      channel: formVal.channel,
      subject: formVal.channel === 'email' ? formVal.subject : undefined,
      message: formVal.message,
    };

    this.adminApi.sendCommunication(payload).subscribe({
      next: (res) => {
        this.isSending.set(false);
        if (res.success) {
          this.sent.emit();
          this.close.emit();
        } else {
          this.errorMessage.set(res.message || 'Dispatch failed.');
        }
      },
      error: (err) => {
        this.isSending.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to dispatch communication.');
      },
    });
  }

  onCancel(): void {
    this.close.emit();
  }
}
