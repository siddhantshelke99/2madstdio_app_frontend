import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminApiService, SendMessagePayload } from '../../services/admin-api.service';

interface MessageTemplate {
  id: string;
  title: string;
  channel: 'email' | 'whatsapp';
  category: 'student' | 'inquiry' | 'all';
  subject?: string;
  badge: string;
  body: string;
}

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      (click)="onBackdropClick($event)">
      
      <div
        class="relative w-full max-w-2xl rounded-2xl bg-[#0f1015] border border-[#232532] shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-[#ececf1] font-['Neurial_Grotesk',sans-serif]"
        (click)="$event.stopPropagation()">
        
        <!-- MODAL HEADER -->
        <div class="px-5 py-3 bg-[#14161f] border-b border-[#232532] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-inner transition-colors"
              [ngClass]="activeChannel() === 'email' ? 'bg-[#ff4d1c]/15 text-[#ff4d1c] border border-[#ff4d1c]/30' : 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30'">
              @if (activeChannel() === 'email') {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              } @else {
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              }
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff4d1c] font-semibold">
                  Direct Dispatch Console
                </span>
                <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1e202d] text-[#8e909d] uppercase border border-[#2a2c3d]">
                  {{ recipientType }}
                </span>
              </div>
              <h3 class="font-['Space_Grotesk'] text-base font-bold text-white tracking-tight leading-tight">
                To: {{ recipientName || 'Recipient' }}
              </h3>
              <p class="text-[11px] text-[#828494] font-mono truncate max-w-xs">
                Contact: <span class="text-white">{{ recipientTarget || 'Not specified' }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Channel Switcher -->
            <div class="flex bg-[#0b0b0f] p-1 rounded-xl border border-[#252736]">
              <button
                type="button"
                id="modalBtnEmail"
                (click)="switchChannel('email')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                [ngClass]="activeChannel() === 'email' ? 'bg-[#ff4d1c] text-white shadow-md' : 'text-[#828494] hover:text-white'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </button>
              <button
                type="button"
                id="modalBtnWhatsapp"
                (click)="switchChannel('whatsapp')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                [ngClass]="activeChannel() === 'whatsapp' ? 'bg-[#25D366] text-black font-bold shadow-md' : 'text-[#828494] hover:text-white'">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>

            <!-- Close Button -->
            <button
              (click)="onCancel()"
              type="button"
              class="p-2 rounded-xl text-[#7e808e] hover:text-white hover:bg-[#1e202c] transition-colors"
              title="Close (Esc)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ERROR ALERT -->
        @if (errorMessage()) {
          <div class="mx-5 mt-2.5 p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 shrink-0">
            <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="flex-1">{{ errorMessage() }}</span>
          </div>
        }

        <!-- SCROLLABLE BODY -->
        <div class="px-5 py-3 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar">

          <!-- SAMPLE DRAFT TEMPLATES BAR -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-[11px] font-mono uppercase tracking-wider text-[#a0a2ad] flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-[#ff4d1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Sample Drafts ({{ availableTemplates().length }})</span>
              </label>
              <span class="text-[10px] font-mono text-[#6c6e7c]">Click to auto-populate</span>
            </div>

            <div class="flex flex-wrap gap-2">
              @for (tpl of availableTemplates(); track tpl.id) {
                <button
                  type="button"
                  (click)="applyTemplate(tpl)"
                  class="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all text-left"
                  [ngClass]="activeTemplateId() === tpl.id
                    ? (activeChannel() === 'email' ? 'bg-[#ff4d1c]/20 border-[#ff4d1c] text-white shadow-sm' : 'bg-[#25D366]/20 border-[#25D366] text-white shadow-sm')
                    : 'bg-[#151620] border-[#252736] text-[#9a9ca9] hover:border-[#3d4054] hover:text-white'">
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    [ngClass]="activeChannel() === 'email' ? 'bg-[#ff4d1c]' : 'bg-[#25D366]'"></span>
                  <span>{{ tpl.title }}</span>
                  <span class="text-[9px] uppercase px-1 py-0.2 rounded bg-[#0b0c10] text-[#717382] border border-[#202230]">
                    {{ tpl.badge }}
                  </span>
                </button>
              }
            </div>
          </div>

          <!-- FORM -->
          <form [formGroup]="messageForm" (ngSubmit)="onSubmit()" class="space-y-3">

            <!-- EMAIL SUBJECT (Only visible for email) -->
            @if (activeChannel() === 'email') {
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-mono uppercase tracking-wider text-[#a0a2ad]">
                    Subject Line <span class="text-[#ff4d1c]">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  formControlName="subject"
                  placeholder="e.g. Welcome to 2NOMADS Academy — Season 01 Syllabus & Next Steps"
                  class="w-full px-3 py-2 rounded-xl bg-[#14161f] border border-[#282a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#ff4d1c] focus:ring-1 focus:ring-[#ff4d1c] transition-all font-sans" />
              </div>
            }

            <!-- MESSAGE CONTENT -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-mono uppercase tracking-wider text-[#a0a2ad]">
                  Message Content <span class="text-[#ff4d1c]">*</span>
                </label>
                <div class="flex items-center gap-2 text-[10px] font-mono text-[#6c6e7c]">
                  <span>{{ wordCount() }} words</span>
                  <span>•</span>
                  <span>{{ charCount() }} chars</span>
                </div>
              </div>
              <textarea
                formControlName="message"
                rows="5"
                placeholder="Write your note or select a sample draft template from above..."
                (input)="onMessageInput()"
                class="w-full px-3 py-2 rounded-xl bg-[#14161f] border border-[#282a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#ff4d1c] focus:ring-1 focus:ring-[#ff4d1c] transition-all font-sans leading-relaxed resize-y custom-scrollbar"></textarea>
            </div>

            <!-- INSERT VARIABLE TAGS -->
            <div class="flex items-center flex-wrap gap-1.5">
              <span class="text-[10px] font-mono uppercase text-[#696b7a] mr-1">Insert Tag:</span>
              <button
                type="button"
                (click)="insertTag('{Name}')"
                class="px-2 py-0.5 rounded bg-[#1c1e2a] hover:bg-[#252838] border border-[#2c2f42] text-[11px] font-mono text-[#c6c8d6] transition-colors">
                + &#123;Name&#125;
              </button>
              <button
                type="button"
                (click)="insertTag('+91 91582 28037')"
                class="px-2 py-0.5 rounded bg-[#1c1e2a] hover:bg-[#252838] border border-[#2c2f42] text-[11px] font-mono text-[#c6c8d6] transition-colors">
                + Hotline Phone
              </button>
              <button
                type="button"
                (click)="insertTag('Pune Studio & Academy Bay')"
                class="px-2 py-0.5 rounded bg-[#1c1e2a] hover:bg-[#252838] border border-[#2c2f42] text-[11px] font-mono text-[#c6c8d6] transition-colors">
                + Studio Bay
              </button>
              <button
                type="button"
                (click)="insertTag('https://2nomads.design')"
                class="px-2 py-0.5 rounded bg-[#1c1e2a] hover:bg-[#252838] border border-[#2c2f42] text-[11px] font-mono text-[#c6c8d6] transition-colors">
                + Website URL
              </button>
            </div>

            <!-- ACCORDION: LIVE DISPATCH PREVIEW -->
            <div class="mt-2 rounded-xl border border-[#232532] bg-[#0c0d12] overflow-hidden">
              <div
                (click)="showPreview.set(!showPreview())"
                class="px-3.5 py-1.5 bg-[#14151e] flex items-center justify-between cursor-pointer hover:bg-[#181a25] transition-colors select-none">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono uppercase tracking-wider text-[#a0a2ad]">
                    Live Dispatch Preview (Simulated Output)
                  </span>
                  <span
                    class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase"
                    [ngClass]="activeChannel() === 'email' ? 'bg-[#ff4d1c]/20 text-[#ff4d1c]' : 'bg-[#25D366]/20 text-[#25D366]'">
                    {{ activeChannel() }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-[#868897]">
                  <span class="text-[10px] font-mono">{{ showPreview() ? 'Collapse' : 'Expand' }}</span>
                  <svg
                    class="w-3.5 h-3.5 transition-transform duration-200"
                    [class.rotate-180]="showPreview()"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              @if (showPreview()) {
                <div class="p-3 border-t border-[#1d1f2b] bg-[#0b0c10]">
                  @if (activeChannel() === 'whatsapp') {
                    <!-- WHATSAPP MOBILE PHONE BUBBLE -->
                    <div class="max-w-md mx-auto rounded-xl p-3 bg-[#0a1014] border border-[#1b2a26] shadow-md font-sans">
                      <div class="flex items-center gap-2 pb-2 mb-2 border-b border-[#182522]">
                        <div class="w-6 h-6 rounded-full bg-[#25D366] text-black font-bold flex items-center justify-center text-[10px]">
                          2N
                        </div>
                        <div>
                          <div class="text-[11px] font-bold text-white leading-tight">2NOMADS Academy & Studio</div>
                          <div class="text-[9px] text-[#25D366]">Official WhatsApp Desk • Verified</div>
                        </div>
                      </div>
                      <div class="bg-[#005c4b] text-[#e9edef] text-xs p-2.5 rounded-lg rounded-tr-none shadow-sm space-y-1 relative">
                        <p class="whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">{{ currentMessage() || 'No message content entered...' }}</p>
                        <div class="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] pt-1">
                          <span>Just now</span>
                          <span class="text-[#53bdeb]">✓✓</span>
                        </div>
                      </div>
                    </div>
                  } @else {
                    <!-- EMAIL PREVIEW -->
                    <div class="rounded-lg bg-[#12131b] border border-[#242636] p-3 text-xs font-sans space-y-2">
                      <div class="space-y-0.5 border-b border-[#202230] pb-2 text-[11px] font-mono text-[#8b8d9c]">
                        <div><strong class="text-white">From:</strong> 2NOMADS Studio & Academy &lt;admin&#64;2nomads.design&gt;</div>
                        <div><strong class="text-white">To:</strong> {{ recipientName }} &lt;{{ recipientTarget || 'email' }}&gt;</div>
                        <div><strong class="text-white">Subject:</strong> <span class="text-[#ff784b]">{{ currentSubject() || '(No subject)' }}</span></div>
                      </div>
                      <div class="text-[#d8dae5] whitespace-pre-line leading-relaxed font-sans text-xs pt-1 max-h-36 overflow-y-auto custom-scrollbar">
                        {{ currentMessage() || 'No message content entered...' }}
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

          </form>

        </div>

        <!-- MODAL FOOTER -->
        <div class="px-5 py-3 bg-[#14161f] border-t border-[#232532] flex items-center justify-between shrink-0">
          <div class="text-[10px] font-mono text-[#717382] hidden sm:block">
            <kbd class="px-1 py-0.5 rounded bg-[#0b0c10] border border-[#252738] text-white">Esc</kbd> exit · <kbd class="px-1 py-0.5 rounded bg-[#0b0c10] border border-[#252738] text-white">⌘/Ctrl + ↵</kbd> send
          </div>

          <div class="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              (click)="onCancel()"
              class="px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#8e909a] hover:text-white hover:bg-[#1e202d] transition-colors">
              Cancel
            </button>
            <button
              type="button"
              id="dispatchSubmitBtn"
              (click)="onSubmit()"
              [disabled]="isSending() || messageForm.invalid"
              class="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              [ngClass]="activeChannel() === 'email' ? 'bg-[#ff4d1c] hover:bg-[#ff6538] text-white' : 'bg-[#25D366] hover:bg-[#20b858] text-black'">
              @if (isSending()) {
                <div class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Dispatching...</span>
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Dispatch {{ activeChannel() | uppercase }}</span>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0f1015;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #2b2e3e;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #3e4259;
    }
  `]
})
export class MessageModalComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);
  private formSub?: Subscription;

  @Input() recipientType: 'student' | 'inquiry' = 'student';
  @Input() recipientId = '';
  @Input() recipientName = '';
  @Input() recipientTarget = ''; // email or phone
  @Input() initialChannel: 'email' | 'whatsapp' = 'email';

  @Output() close = new EventEmitter<void>();
  @Output() sent = new EventEmitter<void>();

  activeChannel = signal<'email' | 'whatsapp'>('email');
  activeTemplateId = signal<string | null>(null);
  showPreview = signal<boolean>(true);
  isSending = signal(false);
  errorMessage = signal<string | null>(null);

  currentMessage = signal<string>('');
  currentSubject = signal<string>('');
  wordCount = signal(0);
  charCount = signal(0);

  // Template Library
  readonly templates: MessageTemplate[] = [
    // --- EMAIL TEMPLATES (STUDENT) ---
    {
      id: 'student_onboarding_email',
      title: 'Admissions Welcome & Syllabus',
      channel: 'email',
      category: 'student',
      badge: 'Onboarding',
      subject: 'Welcome to 2NOMADS Academy — Season 01 Syllabus & Next Steps',
      body: `Dear {Name},

Thank you for choosing 2NOMADS Academy. We have reviewed your registration for the upcoming Masterclass in Automotive Styling & Clay Modelling.

Your profile has passed initial review. Below are key onboarding details for your preparation:
• Studio Location: 2NOMADS Studio & Prototyping Bay, Pune, Maharashtra
• Session Format: Hands-on physical clay bench sculpting (1:4 & 1:1 scale) + Class-A Digital Surfacing
• Tooling Provided: Master armatures, spring-steel rakes, styling tape, and Chavant clay

Please review the attached syllabus and reply to confirm your preferred batch schedule or let us know if you need assistance with local accommodation in Pune.

Best regards,
Admissions Team
2NOMADS Studio & Academy, Pune
www.2nomads.design | +91 91582 28037`,
    },
    {
      id: 'student_interview_email',
      title: 'Studio Tour & Bench Walkthrough',
      channel: 'email',
      category: 'student',
      badge: 'Studio Visit',
      subject: '2NOMADS Academy: Invitation for Studio Tour & Clay Bench Walkthrough',
      body: `Dear {Name},

Following your registration, we would like to invite you for an in-person walkthrough and portfolio review with lead automobile designer R Donshong Koren at our Pune studio.

This session will give you a direct look at active OEM clay projects, our precision optical 3D laser scanning setup, and your allocated physical bench.

Please let us know your preferred availability:
• Slot 1: Saturday, 11:30 AM – 1:00 PM
• Slot 2: Sunday, 3:00 PM – 4:30 PM

We look forward to meeting you and reviewing your design work.

Warm regards,
R Donshong Koren
Founder & Lead Designer, 2NOMADS`,
    },
    {
      id: 'student_tuition_email',
      title: 'Tuition Schedule & Seat Lock',
      channel: 'email',
      category: 'student',
      badge: 'Tuition',
      subject: '2NOMADS Academy: Enrollment Seat Confirmation & Tuition Schedule',
      body: `Dear {Name},

Congratulations! Your seat for 2NOMADS Academy Season 01 has been provisionally reserved.

To finalize your bench reservation and prepare your customized tooling kit, please find our official payment schedule and tuition details attached. Installment plans are available upon request.

Once payment is processed, your official Admission Dossier and student studio access card will be issued immediately.

Best regards,
Accounts & Admissions Desk
2NOMADS Studio & Academy, Pune`,
    },

    // --- EMAIL TEMPLATES (INQUIRY / OEM) ---
    {
      id: 'inquiry_rfp_email',
      title: 'OEM RFP Technical Scoping',
      channel: 'email',
      category: 'inquiry',
      badge: 'OEM Brief',
      subject: '2NOMADS Studio: Scoping Discussion for your Vehicle Styling RFP',
      body: `Dear {Name},

Thank you for reaching out to 2NOMADS Studio regarding your concept styling and prototyping requirements.

Our design and clay engineering leads have reviewed your brief. We have extensive experience delivering scale and 1:1 running prototypes for leading brands including Classic Legends, Pluto Mobility, and Hindustan Motors.

We would be glad to share our mutual NDA and schedule an exploratory technical call this week to review project scope, timelines, and CMM inspection tolerances.

Please let us know your team's availability this week.

Sincerely,
Client Relations & Studio Lead
2NOMADS Studio, Pune
www.2nomads.design`,
    },
    {
      id: 'inquiry_visit_email',
      title: 'Studio Facility & Prototyping Bay Visit',
      channel: 'email',
      category: 'inquiry',
      badge: 'Facility Tour',
      subject: '2NOMADS Studio: Invitation to Pune Studio & Prototyping Bay',
      body: `Dear {Name},

We would be delighted to host you at our Pune facility to inspect our clay sculpting bays, optical 3D scanning equipment, and metal/composite fabrication floor.

We can demonstrate our rapid clay milling process and discuss your styling program in complete confidentiality.

Please let us know your preferred dates for a visit.

Best regards,
R Donshong Koren
Founder & Lead Designer, 2NOMADS Studio`,
    },

    // --- WHATSAPP TEMPLATES (STUDENT) ---
    {
      id: 'student_ping_wa',
      title: 'Admissions Fast Ping',
      channel: 'whatsapp',
      category: 'student',
      badge: 'Quick Chat',
      body: `Hi {Name}! 🏎️ This is the 2NOMADS Academy admissions desk in Pune. We reviewed your application for the Season 01 Automotive Styling Masterclass. Do you have 5 minutes for a quick chat regarding your batch timing and physical clay bench reservation?`,
    },
    {
      id: 'student_tour_wa',
      title: 'Studio Tour & Clay Demo',
      channel: 'whatsapp',
      category: 'student',
      badge: 'Demo Invite',
      body: `Hello {Name}! 📍 Greetings from 2NOMADS Studio. We'd love to invite you to our Pune facility this weekend to see live 1:1 scale clay sculpting in action and meet our lead designers. Would Saturday or Sunday work better for you?`,
    },
    {
      id: 'student_reminder_wa',
      title: 'Enrollment & Bench Lock Reminder',
      channel: 'whatsapp',
      category: 'student',
      badge: 'Follow-up',
      body: `Hello {Name}! ⚡ Your seat for Season 01 is currently on hold. Please let us know if you need the fee breakdown or installment schedule so we can confirm your tooling kit before bench capacity is reached. Let us know if you have any questions! 🛠️`,
    },

    // --- WHATSAPP TEMPLATES (INQUIRY / OEM) ---
    {
      id: 'inquiry_ping_wa',
      title: 'OEM RFP Instant Reply',
      channel: 'whatsapp',
      category: 'inquiry',
      badge: 'OEM Reply',
      body: `Hello {Name}! Thank you for contacting 2NOMADS Studio regarding your styling inquiry. Our studio leads have reviewed your requirement. When is a good time this week for a brief 15-minute scoping call?`,
    },
    {
      id: 'inquiry_visit_wa',
      title: 'Facility Tour Coordination',
      channel: 'whatsapp',
      category: 'inquiry',
      badge: 'Visit Brief',
      body: `Hi {Name}, greetings from 2NOMADS Studio, Pune. We'd be glad to host your team at our prototyping bay to review our 1:1 clay models and prototype builds under NDA. Let us know what date suits your schedule!`,
    },
    {
      id: 'inquiry_portfolio_wa',
      title: 'Studio Portfolio Follow-up',
      channel: 'whatsapp',
      category: 'inquiry',
      badge: 'Portfolio',
      body: `Hello {Name}, following up on your design consultancy inquiry with 2NOMADS. Please let us know if you received our email with the studio portfolio, or if we can assist you with any specific details. Have a great day!`,
    },
  ];

  messageForm: FormGroup = this.fb.group({
    channel: ['email', Validators.required],
    subject: ['Follow-up from 2NOMADS Studio & Academy', Validators.required],
    message: ['', [Validators.required, Validators.minLength(5)]],
    templateName: ['custom_admin_followup'],
  });

  // Filter available templates based on active channel and recipient type
  availableTemplates = computed(() => {
    const ch = this.activeChannel();
    const type = this.recipientType;
    return this.templates.filter(
      (t) => t.channel === ch && (t.category === type || t.category === 'all')
    );
  });

  ngOnInit(): void {
    const initial = this.initialChannel || 'email';
    this.switchChannel(initial);

    this.formSub = this.messageForm.valueChanges.subscribe((val) => {
      this.currentMessage.set(val.message || '');
      this.currentSubject.set(val.subject || '');
      this.updateCounts(val.message || '');
    });
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  switchChannel(channel: 'email' | 'whatsapp'): void {
    this.activeChannel.set(channel);
    this.messageForm.patchValue({ channel });

    if (channel === 'email') {
      this.messageForm.get('subject')?.setValidators([Validators.required, Validators.minLength(3)]);
      if (!this.messageForm.get('subject')?.value) {
        this.messageForm.patchValue({ subject: 'Follow-up from 2NOMADS Studio & Academy' });
      }
    } else {
      this.messageForm.get('subject')?.clearValidators();
    }
    this.messageForm.get('subject')?.updateValueAndValidity();

    // Auto-select first matching draft template
    const avail = this.availableTemplates();
    if (avail.length > 0) {
      this.applyTemplate(avail[0]);
    } else {
      this.updateCounts(this.messageForm.get('message')?.value || '');
    }
  }

  applyTemplate(tpl: MessageTemplate): void {
    this.activeTemplateId.set(tpl.id);
    const resolvedName = this.recipientName || (this.recipientType === 'student' ? 'Student' : 'Partner');
    
    let resolvedBody = tpl.body.replace(/{Name}/g, resolvedName);
    let resolvedSubject = tpl.subject ? tpl.subject.replace(/{Name}/g, resolvedName) : '';

    this.messageForm.patchValue({
      templateName: tpl.id,
      subject: resolvedSubject || this.messageForm.get('subject')?.value,
      message: resolvedBody,
    });

    this.currentMessage.set(resolvedBody);
    this.currentSubject.set(resolvedSubject || this.messageForm.get('subject')?.value);
    this.updateCounts(resolvedBody);
  }

  insertTag(tag: string): void {
    const current = this.messageForm.get('message')?.value || '';
    const resolvedTag = tag === '{Name}' ? (this.recipientName || 'Candidate') : tag;
    const updated = current + (current.endsWith(' ') || current.endsWith('\n') ? '' : ' ') + resolvedTag;
    this.messageForm.patchValue({ message: updated });
    this.currentMessage.set(updated);
    this.updateCounts(updated);
  }

  onMessageInput(): void {
    this.activeTemplateId.set(null);
    const text = this.messageForm.get('message')?.value || '';
    this.currentMessage.set(text);
    this.updateCounts(text);
  }

  updateCounts(text: string): void {
    this.charCount.set(text.length);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    this.wordCount.set(words);
  }

  onBackdropClick(event: MouseEvent): void {
    this.onCancel();
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
