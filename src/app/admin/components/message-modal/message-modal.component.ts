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
  shortDesc: string;
  body: string;
}

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="dispatch-overlay"
      (click)="onBackdropClick($event)">
      
      <!-- MODAL CONTAINER (HIGH-END 2-COLUMN STRUCTURE) -->
      <div
        class="dispatch-modal"
        (click)="$event.stopPropagation()">
        
        <!-- HEADER -->
        <header class="dispatch-header">
          <div class="header-left">
            <div
              class="channel-icon-avatar"
              [class.is-email]="activeChannel() === 'email'"
              [class.is-wa]="activeChannel() === 'whatsapp'">
              @if (activeChannel() === 'email') {
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              } @else {
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              }
            </div>

            <div class="header-titles">
              <div class="header-badge-row">
                <h3 class="header-main-title">Direct Dispatch Console</h3>
                <span class="role-badge">{{ recipientType }}</span>
              </div>
              <p class="header-sub">
                To: <strong class="name-highlight">{{ recipientName || 'Recipient' }}</strong>
                <span class="dot-sep">•</span>
                <span class="target-text">{{ recipientTarget || 'No address specified' }}</span>
              </p>
            </div>
          </div>

          <!-- Channel Selector Toggle -->
          <div class="header-right">
            <div class="channel-toggle-pill">
              <button
                type="button"
                id="modalBtnEmail"
                (click)="switchChannel('email')"
                class="toggle-btn"
                [class.active-email]="activeChannel() === 'email'">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </button>
              <button
                type="button"
                id="modalBtnWhatsapp"
                (click)="switchChannel('whatsapp')"
                class="toggle-btn"
                [class.active-wa]="activeChannel() === 'whatsapp'">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>

            <!-- Close Button -->
            <button
              (click)="onCancel()"
              type="button"
              class="modal-close-btn"
              title="Close (Esc)">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <!-- ERROR ALERT -->
        @if (errorMessage()) {
          <div class="error-banner">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- 2-COLUMN STRUCTURE BODY -->
        <div class="dispatch-grid-body custom-scrollbar">

          <!-- LEFT COLUMN: COMPOSE & TEMPLATES (58% width) -->
          <div class="compose-pane">
            
            <!-- SECTION 1: SAMPLE DRAFT TEMPLATES -->
            <div class="draft-selector-block">
              <div class="selector-header">
                <span class="block-label">Sample Draft Templates</span>
                <span class="block-hint">Click a template to load copy</span>
              </div>

              <!-- Draft Templates Horizontal Strip -->
              <div class="template-scroll-strip custom-scrollbar">
                @for (tpl of availableTemplates(); track tpl.id) {
                  <button
                    type="button"
                    (click)="applyTemplate(tpl)"
                    class="template-card-btn"
                    [class.active-tpl-email]="activeTemplateId() === tpl.id && activeChannel() === 'email'"
                    [class.active-tpl-wa]="activeTemplateId() === tpl.id && activeChannel() === 'whatsapp'">
                    <span class="tpl-bullet"></span>
                    <span class="tpl-title-text">{{ tpl.title }}</span>
                    <span class="tpl-badge-pill">{{ tpl.badge }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- FORM CONTROLS -->
            <form [formGroup]="messageForm" (ngSubmit)="onSubmit()" class="compose-form-area">
              
              <!-- EMAIL SUBJECT LINE -->
              @if (activeChannel() === 'email') {
                <div class="form-field-group">
                  <div class="field-label-row">
                    <label class="field-label">Subject Line <span class="req-star">*</span></label>
                    <span class="field-meta">Recipient Inbox Title</span>
                  </div>
                  <input
                    type="text"
                    formControlName="subject"
                    placeholder="e.g. Welcome to 2NOMADS Academy — Season 01 Syllabus & Next Steps"
                    class="form-text-input" />
                </div>
              }

              <!-- MESSAGE CONTENT TEXTAREA -->
              <div class="form-field-group flex-1">
                <div class="field-label-row">
                  <label class="field-label">Message Content <span class="req-star">*</span></label>
                  <div class="counts-tag">
                    <span>{{ wordCount() }} words</span>
                    <span>•</span>
                    <span>{{ charCount() }} chars</span>
                  </div>
                </div>
                <textarea
                  formControlName="message"
                  (input)="onMessageInput()"
                  placeholder="Compose your message or choose a sample draft above..."
                  class="form-textarea custom-scrollbar"
                  [class.is-wa-textarea]="activeChannel() === 'whatsapp'"></textarea>
              </div>

              <!-- INSERT VARIABLES BAR -->
              <div class="tags-row">
                <span class="tags-hint">Insert dynamic tag:</span>
                <button type="button" (click)="insertTag('{Name}')" class="tag-pill">+ Candidate Name</button>
                <button type="button" (click)="insertTag('+91 91582 28037')" class="tag-pill">+ Studio Phone</button>
                <button type="button" (click)="insertTag('Pune Studio Bay')" class="tag-pill">+ Studio Bay</button>
                <button type="button" (click)="insertTag('https://2nomads.design')" class="tag-pill">+ Website</button>
              </div>

            </form>

          </div>

          <!-- RIGHT COLUMN: REAL-TIME SIMULATED PREVIEW (42% width) -->
          <div class="preview-pane">
            <div class="preview-top-bar">
              <span class="preview-title">
                <span class="live-dot"></span>
                <span>Live Delivery Preview</span>
              </span>
              <span class="preview-channel-pill" [class.is-wa]="activeChannel() === 'whatsapp'">
                {{ activeChannel() | uppercase }}
              </span>
            </div>

            <!-- PREVIEW SHELL CONTAINER -->
            <div class="preview-frame-container">
              
              @if (activeChannel() === 'whatsapp') {
                <!-- WHATSAPP MOBILE PHONE INTERFACE -->
                <div class="wa-shell">
                  <!-- Phone Top Header -->
                  <div class="wa-header-bar">
                    <div class="wa-avatar">2N</div>
                    <div class="wa-profile-info">
                      <div class="wa-name">2NOMADS Academy &amp; Studio</div>
                      <div class="wa-status">
                        <span class="status-dot"></span>
                        <span>Official WhatsApp Desk • Verified</span>
                      </div>
                    </div>
                  </div>

                  <!-- Chat Message Feed -->
                  <div class="wa-chat-canvas custom-scrollbar">
                    <div class="wa-date-pill">TODAY</div>
                    <div class="wa-bubble">
                      <p class="wa-bubble-text">{{ currentMessage() || 'Select a draft or compose on the left...' }}</p>
                      <div class="wa-bubble-footer">
                        <span>Just now</span>
                        <span class="blue-ticks">✓✓</span>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom Info -->
                  <div class="wa-bottom-bar">
                    <span class="wa-dispatch-info">Recipient: {{ recipientTarget || 'Candidate' }}</span>
                    <span class="wa-enc-tag">🔒 END-TO-END ENCRYPTED</span>
                  </div>
                </div>

              } @else {
                <!-- EMAIL CLIENT INTERFACE -->
                <div class="email-shell">
                  <!-- Window Header -->
                  <div class="email-top-bar">
                    <div class="mac-dots">
                      <span class="m-dot red"></span>
                      <span class="m-dot yellow"></span>
                      <span class="m-dot green"></span>
                    </div>
                    <span class="email-client-name">2NOMADS Direct Mail Dispatcher</span>
                    <span class="email-protocol">TLS 1.3</span>
                  </div>

                  <!-- Email Header Lines -->
                  <div class="email-headers-box">
                    <div class="hdr-line">
                      <span class="hdr-key">From:</span>
                      <span class="hdr-val">2NOMADS Studio &amp; Academy &lt;admin&#64;2nomads.design&gt;</span>
                    </div>
                    <div class="hdr-line">
                      <span class="hdr-key">To:</span>
                      <span class="hdr-val">{{ recipientName }} &lt;{{ recipientTarget || 'candidate@email' }}&gt;</span>
                    </div>
                    <div class="hdr-line">
                      <span class="hdr-key">Subject:</span>
                      <span class="hdr-val subject-val">{{ currentSubject() || '(No subject provided)' }}</span>
                    </div>
                  </div>

                  <!-- Email Body -->
                  <div class="email-content-body custom-scrollbar">
                    <div class="email-rendered-text">{{ currentMessage() || 'Select a draft or compose on the left...' }}</div>
                  </div>

                  <!-- Studio Footer Signature -->
                  <div class="email-footer-sign">
                    <span>2NOMADS Studio &amp; Academy · Pune, India</span>
                    <span>www.2nomads.design</span>
                  </div>
                </div>
              }

            </div>
          </div>

        </div>

        <!-- FIXED FOOTER -->
        <footer class="dispatch-footer">
          <div class="footer-meta-info">
            <span class="footer-label">Destination:</span>
            <span class="footer-target-chip">{{ recipientTarget || 'Not specified' }}</span>
            <span class="footer-sep">•</span>
            <span class="footer-hint">
              <kbd>Esc</kbd> exit · <kbd>⌘/Ctrl + ↵</kbd> send
            </span>
          </div>

          <div class="footer-action-btns">
            <button
              type="button"
              (click)="onCancel()"
              class="btn-footer-cancel">
              Cancel
            </button>
            <button
              type="button"
              id="dispatchSubmitBtn"
              (click)="onSubmit()"
              [disabled]="isSending() || messageForm.invalid"
              class="btn-footer-submit"
              [class.is-email-btn]="activeChannel() === 'email'"
              [class.is-wa-btn]="activeChannel() === 'whatsapp'">
              @if (isSending()) {
                <div class="btn-spinner"></div>
                <span>Dispatching...</span>
              } @else {
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Dispatch {{ activeChannel() | uppercase }}</span>
              }
            </button>
          </div>
        </footer>

      </div>
    </div>
  `,
  styles: [`
    /* OVERLAY & MODAL STRUCTURE */
    .dispatch-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background-color: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .dispatch-modal {
      position: relative;
      width: 100%;
      max-width: 1060px;
      height: 670px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      background-color: #0f1118;
      border: 1px solid #25283c;
      box-shadow: 0 35px 80px -15px rgba(0, 0, 0, 0.75), 0 0 45px rgba(0, 0, 0, 0.5);
      color: #f1f2f6;
      font-family: 'Neurial Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }

    /* HEADER */
    .dispatch-header {
      padding: 16px 24px;
      background-color: #141622;
      border-bottom: 1px solid #222538;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .channel-icon-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .channel-icon-avatar.is-email {
      background-color: rgba(255, 77, 28, 0.14);
      color: #ff4d1c;
      border: 1px solid rgba(255, 77, 28, 0.35);
    }
    .channel-icon-avatar.is-wa {
      background-color: rgba(37, 211, 102, 0.14);
      color: #25D366;
      border: 1px solid rgba(37, 211, 102, 0.35);
    }

    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .header-badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-main-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .role-badge {
      font-family: monospace;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 100px;
      background-color: #1e2132;
      color: #a4a7bf;
      border: 1px solid #2d3148;
    }

    .header-sub {
      margin: 0;
      font-size: 12.5px;
      color: #8a8e9f;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .name-highlight {
      color: #ffffff;
      font-weight: 600;
    }
    .dot-sep {
      color: #4a4d60;
    }
    .target-text {
      color: #b0b4ca;
      font-family: monospace;
      font-size: 11.5px;
    }

    /* CHANNEL TOGGLE PILL */
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .channel-toggle-pill {
      display: flex;
      background-color: #0b0c12;
      padding: 3px;
      border-radius: 12px;
      border: 1px solid #222538;
      gap: 2px;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #84889d;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .toggle-btn:hover {
      color: #ffffff;
    }
    .toggle-btn.active-email {
      background-color: #ff4d1c;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(255, 77, 28, 0.35);
    }
    .toggle-btn.active-wa {
      background-color: #25D366;
      color: #000000;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(37, 211, 102, 0.35);
    }

    .modal-close-btn {
      padding: 8px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: #7b7f94;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .modal-close-btn:hover {
      background-color: #1e2132;
      color: #ffffff;
    }

    /* ERROR BANNER */
    .error-banner {
      margin: 12px 24px 0;
      padding: 10px 14px;
      border-radius: 10px;
      background-color: rgba(127, 29, 29, 0.4);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* 2-COLUMN BODY GRID */
    .dispatch-grid-body {
      padding: 20px 24px;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 24px;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    /* LEFT COLUMN: COMPOSE */
    .compose-pane {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }

    .draft-selector-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .selector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .block-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a0a4b8;
    }
    .block-hint {
      font-size: 11px;
      color: #6a6e82;
    }

    .template-scroll-strip {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 6px;
      padding-right: 16px;
    }

    .template-card-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 10px;
      border: 1px solid #23263b;
      background-color: #141624;
      color: #9aa0b6;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .template-card-btn:hover {
      border-color: #383c56;
      background-color: #191b2c;
      color: #ffffff;
    }
    .template-card-btn.active-tpl-email {
      background-color: rgba(255, 77, 28, 0.12);
      border-color: #ff4d1c;
      color: #ffffff;
    }
    .template-card-btn.active-tpl-wa {
      background-color: rgba(37, 211, 102, 0.12);
      border-color: #25D366;
      color: #ffffff;
    }

    .tpl-bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ff4d1c;
    }
    .template-card-btn.active-tpl-wa .tpl-bullet {
      background-color: #25D366;
    }

    .tpl-title-text {
      font-size: 12px;
      font-weight: 600;
    }
    .tpl-badge-pill {
      font-family: monospace;
      font-size: 9px;
      text-transform: uppercase;
      padding: 2px 5px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.4);
      color: #7b8096;
      border: 1px solid #24273c;
    }

    /* FORM CONTROLS */
    .compose-form-area {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
    }

    .form-field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .field-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a0a4b8;
    }
    .req-star {
      color: #ff4d1c;
    }
    .field-meta {
      font-size: 11px;
      color: #6a6e82;
    }
    .counts-tag {
      font-family: monospace;
      font-size: 11px;
      color: #6a6e82;
      display: flex;
      gap: 6px;
    }

    .form-text-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      border-radius: 10px;
      background-color: #141624;
      border: 1px solid #26293e;
      color: #ffffff;
      font-size: 13.5px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-text-input:focus {
      border-color: #ff4d1c;
      box-shadow: 0 0 0 2px rgba(255, 77, 28, 0.15);
    }

    .form-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      border-radius: 10px;
      background-color: #141624;
      border: 1px solid #26293e;
      color: #ffffff;
      font-size: 13px;
      line-height: 1.6;
      font-family: inherit;
      outline: none;
      height: 190px;
      resize: none;
      transition: all 0.2s ease;
    }
    .form-textarea.is-wa-textarea {
      height: 260px;
    }
    .form-textarea:focus {
      border-color: #ff4d1c;
      box-shadow: 0 0 0 2px rgba(255, 77, 28, 0.15);
    }
    .form-textarea.is-wa-textarea:focus {
      border-color: #25D366;
      box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.15);
    }

    .tags-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tags-hint {
      font-size: 11px;
      color: #6a6e82;
      margin-right: 2px;
    }
    .tag-pill {
      padding: 3px 8px;
      border-radius: 6px;
      background-color: #161826;
      border: 1px solid #282c44;
      color: #bdc1d4;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tag-pill:hover {
      background-color: #202438;
      border-color: #3e4364;
      color: #ffffff;
    }

    /* RIGHT COLUMN: PREVIEW PANE */
    .preview-pane {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .preview-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .preview-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a0a4b8;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #25D366;
      box-shadow: 0 0 6px rgba(37, 211, 102, 0.6);
    }
    .preview-channel-pill {
      font-family: monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 6px;
      background-color: rgba(255, 77, 28, 0.12);
      color: #ff6838;
      border: 1px solid rgba(255, 77, 28, 0.25);
    }
    .preview-channel-pill.is-wa {
      background-color: rgba(37, 211, 102, 0.12);
      color: #25D366;
      border: 1px solid rgba(37, 211, 102, 0.25);
    }

    .preview-frame-container {
      flex: 1;
      border-radius: 14px;
      border: 1px solid #23263b;
      background-color: #0c0e15;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /* WHATSAPP MOBILE PHONE FRAME */
    .wa-shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #0b141a;
    }
    .wa-header-bar {
      padding: 10px 14px;
      background-color: #1f2c34;
      border-bottom: 1px solid #2a3942;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .wa-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #25D366;
      color: #000;
      font-weight: 800;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wa-profile-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .wa-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #e9edef;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wa-status {
      font-size: 10px;
      color: #25D366;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #25D366;
    }

    .wa-chat-canvas {
      flex: 1;
      padding: 14px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .wa-date-pill {
      align-self: center;
      padding: 2px 10px;
      border-radius: 6px;
      background-color: #182229;
      color: #8696a0;
      font-size: 10px;
      font-family: monospace;
    }
    .wa-bubble {
      align-self: flex-end;
      max-width: 90%;
      padding: 10px 12px;
      border-radius: 12px;
      border-top-right-radius: 0;
      background-color: #005c4b;
      color: #e9edef;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .wa-bubble-text {
      margin: 0;
      font-size: 12px;
      line-height: 1.5;
      white-space: pre-line;
      word-break: break-word;
    }
    .wa-bubble-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      font-size: 9.5px;
      color: #8696a0;
    }
    .blue-ticks {
      color: #53bdeb;
      font-weight: bold;
    }
    .wa-bottom-bar {
      padding: 8px 14px;
      background-color: #1f2c34;
      border-top: 1px solid #2a3942;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10.5px;
      color: #8696a0;
      flex-shrink: 0;
    }
    .wa-enc-tag {
      color: #25D366;
      font-family: monospace;
      font-size: 9px;
    }

    /* EMAIL CLIENT FRAME */
    .email-shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #11131b;
    }
    .email-top-bar {
      padding: 8px 14px;
      background-color: #161824;
      border-bottom: 1px solid #202334;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .mac-dots {
      display: flex;
      gap: 5px;
    }
    .m-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .m-dot.red { background-color: #ff5f56; }
    .m-dot.yellow { background-color: #ffbd2e; }
    .m-dot.green { background-color: #27c93f; }
    .email-client-name {
      font-size: 11px;
      color: #7b8098;
      font-weight: 500;
    }
    .email-protocol {
      font-family: monospace;
      font-size: 10px;
      color: #5d6176;
    }

    .email-headers-box {
      padding: 10px 14px;
      border-bottom: 1px solid #1c1f2e;
      background-color: #131520;
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 11.5px;
      flex-shrink: 0;
    }
    .hdr-line {
      display: flex;
      gap: 8px;
    }
    .hdr-key {
      font-family: monospace;
      font-size: 11px;
      color: #6c7086;
      width: 48px;
      flex-shrink: 0;
    }
    .hdr-val {
      color: #d2d5e4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hdr-val.subject-val {
      color: #ff7547;
      font-weight: 600;
    }

    .email-content-body {
      flex: 1;
      padding: 14px;
      overflow-y: auto;
      font-size: 12.5px;
      line-height: 1.6;
      color: #dce0f0;
      white-space: pre-line;
      word-break: break-word;
    }
    .email-rendered-text {
      margin: 0;
    }
    .email-footer-sign {
      padding: 8px 14px;
      background-color: #131520;
      border-top: 1px solid #1c1f2e;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: monospace;
      font-size: 10px;
      color: #686c82;
      flex-shrink: 0;
    }

    /* FOOTER */
    .dispatch-footer {
      padding: 14px 24px;
      background-color: #131520;
      border-top: 1px solid #212436;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .footer-meta-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #7b8098;
    }
    .footer-label {
      color: #6c7086;
    }
    .footer-target-chip {
      color: #ffffff;
      font-family: monospace;
      font-size: 11.5px;
      background-color: #1a1d2c;
      padding: 2px 7px;
      border-radius: 6px;
      border: 1px solid #272a3d;
    }
    .footer-sep {
      color: #3f4254;
    }
    .footer-hint {
      font-size: 11px;
      color: #6c7086;
    }
    .footer-hint kbd {
      background-color: #0b0c12;
      border: 1px solid #23263b;
      border-radius: 4px;
      padding: 1px 5px;
      color: #ffffff;
    }

    .footer-action-btns {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-footer-cancel {
      padding: 9px 18px;
      border-radius: 10px;
      border: 1px solid #282c42;
      background-color: transparent;
      color: #a2a6bd;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-footer-cancel:hover {
      background-color: #1c1f30;
      color: #ffffff;
      border-color: #3c4262;
    }

    .btn-footer-submit {
      padding: 9px 22px;
      border-radius: 10px;
      border: none;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      letter-spacing: 0.04em;
    }
    .btn-footer-submit:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-footer-submit.is-email-btn {
      background-color: #ff4d1c;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(255, 77, 28, 0.35);
    }
    .btn-footer-submit.is-email-btn:hover:not(:disabled) {
      background-color: #ff6538;
      box-shadow: 0 6px 18px rgba(255, 77, 28, 0.45);
    }
    .btn-footer-submit.is-wa-btn {
      background-color: #25D366;
      color: #000000;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
    }
    .btn-footer-submit.is-wa-btn:hover:not(:disabled) {
      background-color: #2ee672;
      box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45);
    }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* SCROLLBARS */
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #25283c;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #3c4060;
    }

    @media (max-width: 900px) {
      .dispatch-grid-body {
        grid-template-columns: 1fr;
      }
      .dispatch-modal {
        height: auto;
        max-height: 94vh;
      }
      .footer-meta-info {
        display: none;
      }
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
      title: 'Admissions Welcome',
      channel: 'email',
      category: 'student',
      badge: 'Onboarding',
      shortDesc: 'Welcome letter, syllabus overview & studio location',
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
      title: 'Studio Tour & Bench',
      channel: 'email',
      category: 'student',
      badge: 'Studio Visit',
      shortDesc: '1-on-1 portfolio review & physical bench allocation',
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
      title: 'Tuition & Seat Lock',
      channel: 'email',
      category: 'student',
      badge: 'Tuition',
      shortDesc: 'Fee breakdown, installments & student dossier issuance',
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
      title: 'OEM RFP Scoping',
      channel: 'email',
      category: 'inquiry',
      badge: 'OEM Brief',
      shortDesc: 'Confidential discovery call, NDA & CMM milestones',
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
      title: 'Facility Tour & Bay',
      channel: 'email',
      category: 'inquiry',
      badge: 'Facility Tour',
      shortDesc: 'Inspect clay sculpting bays & metal fabrication floor',
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
      shortDesc: 'Fast 5-minute chat on batch timings & bench slot',
      body: `Hi {Name}! 🏎️ This is the 2NOMADS Academy admissions desk in Pune. We reviewed your application for the Season 01 Automotive Styling Masterclass. Do you have 5 minutes for a quick chat regarding your batch timing and physical clay bench reservation?`,
    },
    {
      id: 'student_tour_wa',
      title: 'Studio Tour & Demo',
      channel: 'whatsapp',
      category: 'student',
      badge: 'Demo Invite',
      shortDesc: 'Weekend invitation for live 1:1 scale sculpting demo',
      body: `Hello {Name}! 📍 Greetings from 2NOMADS Studio. We'd love to invite you to our Pune facility this weekend to see live 1:1 scale clay sculpting in action and meet our lead designers. Would Saturday or Sunday work better for you?`,
    },
    {
      id: 'student_reminder_wa',
      title: 'Seat Lock Reminder',
      channel: 'whatsapp',
      category: 'student',
      badge: 'Follow-up',
      shortDesc: 'Gentle check-in on pending registration & tool kit',
      body: `Hello {Name}! ⚡ Your seat for Season 01 is currently on hold. Please let us know if you need the fee breakdown or installment schedule so we can confirm your tooling kit before bench capacity is reached. Let us know if you have any questions! 🛠️`,
    },

    // --- WHATSAPP TEMPLATES (INQUIRY / OEM) ---
    {
      id: 'inquiry_ping_wa',
      title: 'OEM Fast Reply',
      channel: 'whatsapp',
      category: 'inquiry',
      badge: 'OEM Reply',
      shortDesc: '15-minute scoping call invitation for OEM leads',
      body: `Hello {Name}! Thank you for contacting 2NOMADS Studio regarding your styling inquiry. Our studio leads have reviewed your requirement. When is a good time this week for a brief 15-minute scoping call?`,
    },
    {
      id: 'inquiry_visit_wa',
      title: 'Facility Tour Brief',
      channel: 'whatsapp',
      category: 'inquiry',
      badge: 'Visit Brief',
      shortDesc: 'Scheduling prototype bay tour under mutual NDA',
      body: `Hi {Name}, greetings from 2NOMADS Studio, Pune. We'd be glad to host your team at our prototyping bay to review our 1:1 clay models and prototype builds under NDA. Let us know what date suits your schedule!`,
    },
    {
      id: 'inquiry_portfolio_wa',
      title: 'Portfolio Follow-up',
      channel: 'whatsapp',
      category: 'inquiry',
      badge: 'Portfolio',
      shortDesc: 'Quick check if client received project credentials',
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
