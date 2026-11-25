import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

export interface AccordionItem {
  id: string | number;
  title: string;
  subtitle: string;
  quote: string;
  credit: string;
  image: string;
  category: string;
}

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>

    <main class="accordion-gallery-main">
      <!-- Background subtle atmospheric gradients -->
      <div class="glow-orb top-orb" aria-hidden="true"></div>
      <div class="glow-orb bottom-orb" aria-hidden="true"></div>

      <div class="accordion-container">
        <!-- Section Header with Batch Switcher -->
        <header class="gallery-header">
          <div class="controls-row">
            <div class="batch-pills">
              @for (batch of totalBatches(); track $index) {
                <button
                  type="button"
                  [class.active]="currentBatch() === $index"
                  (click)="setBatch($index)"
                  class="batch-btn">
                  <span>Set 0{{ $index + 1 }} ({{ $index * pageSize + 1 }}–{{ ($index + 1) * pageSize }})</span>
                </button>
              }
            </div>
          </div>
        </header>

        <!-- The Responsive Expandable Image Accordion -->
        <section class="accordion-wrapper group" role="region" aria-label="Interactive Image Accordion">
          @for (item of visibleItems(); track item.id; let idx = $index) {
            <article
              class="accordion-card group/article"
              [class.is-focused]="focusedIndex() === idx"
              (mouseenter)="focusedIndex.set(idx)"
              (mouseleave)="focusedIndex.set(null)"
              (click)="handleCardClick(item, idx)">
              
              <!-- Background Image -->
              <img
                [src]="item.image"
                [alt]="item.title"
                loading="eager"
                class="accordion-img" />

              <!-- Dark Vignette and Gradient Overlay -->
              <div class="card-scrim"></div>

              <!-- Frosted Glass Blurred Hover Overlay (Cruip Accordion Effect) -->
              <div class="card-glass-blur"></div>

              <!-- Top Badge: Category & Index -->
              <div class="card-top-bar">
                <span class="card-index">0{{ idx + 1 + (currentBatch() * pageSize) }}</span>
                <span class="card-cat">{{ item.category }}</span>
              </div>

              <!-- Bottom Content & Expanded Quote -->
              <div class="card-caption">
                <div class="card-titles">
                  <h3 class="card-main-title">{{ item.title }}</h3>
                  <p class="card-sub-title">{{ item.subtitle }}</p>
                </div>

                <div class="quote-box">
                  <p class="quote-text">“{{ item.quote }}”</p>
                  <div class="credit-row">
                    <span class="credit-author">By {{ item.credit }}</span>
                    <span class="fullscreen-hint">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Fullscreen
                    </span>
                  </div>
                </div>
              </div>

              <!-- Neon Accent Active Border -->
              <div class="neon-border"></div>
            </article>
          }
        </section>

        <!-- Footer / Navigation Bar -->
        <footer class="gallery-nav-footer">
          <div class="nav-info">
            <span class="highlight-text">{{ visibleItems().length }}</span> of {{ currentDataset().length }} showcased
          </div>

          <div class="nav-controls">
            <button
              type="button"
              (click)="prevBatch()"
              [disabled]="currentBatch() === 0"
              class="nav-btn prev">
              ← Previous Set
            </button>
            <span class="page-indicator">{{ currentBatch() + 1 }} / {{ totalBatches().length }}</span>
            <button
              type="button"
              (click)="nextBatch()"
              [disabled]="currentBatch() === totalBatches().length - 1"
              class="nav-btn next">
              Next Set →
            </button>
          </div>
        </footer>
      </div>

      <!-- EDGE-TO-EDGE FULLSCREEN LIGHTBOX MODAL -->
      @if (activeModalItem(); as modal) {
        <div class="fullscreen-modal" role="dialog" aria-modal="true" (click)="closeFullscreen()">
          <!-- Backdrop Blur -->
          <div class="modal-backdrop"></div>

          <!-- Modal Top Bar -->
          <div class="modal-topbar" (click)="$event.stopPropagation()">
            <div class="modal-meta">
              <span class="modal-index">0{{ modalIndex() + 1 }} / {{ currentDataset().length }}</span>
              <h2 class="modal-heading">{{ modal.title }}</h2>
              <span class="modal-sub">{{ modal.subtitle }}</span>
            </div>

            <div class="modal-actions">
              <button
                type="button"
                class="modal-action-btn"
                (click)="toggleBrowserFullscreen()"
                title="Toggle Native OS Fullscreen">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button
                type="button"
                class="modal-action-btn close-btn"
                (click)="closeFullscreen()"
                title="Close (ESC)">
                ✕
              </button>
            </div>
          </div>

          <!-- Main Stage Media Image -->
          <div class="modal-stage" (click)="$event.stopPropagation()">
            <img [src]="modal.image" [alt]="modal.title" class="modal-img" />

            <!-- Nav Arrows -->
            <button
              type="button"
              class="modal-arrow modal-prev"
              (click)="navigateModal(-1)"
              title="Previous (Left Arrow)">
              ‹
            </button>
            <button
              type="button"
              class="modal-arrow modal-next"
              (click)="navigateModal(1)"
              title="Next (Right Arrow)">
              ›
            </button>
          </div>

          <!-- Modal Bottom Caption -->
          <div class="modal-bottom" (click)="$event.stopPropagation()">
            <p class="modal-quote">“{{ modal.quote }}”</p>
            <span class="modal-credit">Photograph / Prototype by {{ modal.credit }}</span>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #070708;
      color: #f5f5f7;
      min-height: 100vh;
      font-family: 'Neurial Grotesk', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    .accordion-gallery-main {
      position: relative;
      min-height: 100vh;
      padding-top: 86px;
      padding-bottom: 24px;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: radial-gradient(ellipse at 50% 15%, rgba(255, 77, 28, 0.08) 0%, transparent 60%), #070708;
    }

    /* Ambient Glow Orbs */
    .glow-orb {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(120px);
      opacity: 0.18;
      z-index: 0;
    }
    .top-orb {
      top: -80px;
      left: 10%;
      background: radial-gradient(circle, #ff4d1c, transparent);
    }
    .bottom-orb {
      bottom: -100px;
      right: 15%;
      background: radial-gradient(circle, #ff6b3d, transparent);
    }

    .accordion-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 clamp(16px, 3vw, 40px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
    }

    /* Header Styling */
    .gallery-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 12px;
    }

    .controls-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
    }

    .batch-pills {
      display: inline-flex;
      gap: 8px;
    }
    .batch-btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);
      padding: 7px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .batch-btn.active {
      background: rgba(255, 77, 28, 0.18);
      border-color: rgba(255, 77, 28, 0.6);
      color: #ff4d1c;
      box-shadow: 0 0 16px rgba(255, 77, 28, 0.25);
    }
    .batch-btn:hover:not(.active) {
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    /* =========================================================================
       ACCORDION CORE ARCHITECTURE
       ========================================================================= */
    .accordion-wrapper {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 12px;
      width: 100%;
      height: clamp(520px, 70vh, 760px);
      box-sizing: border-box;
      margin: 6px 0 16px 0;
    }

    .accordion-card {
      position: relative;
      flex: 1 1 0%;
      height: 100% !important;
      min-width: 0;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      isolation: isolate;
      /* Cruip Cubic Bezier easing for ultra-smooth accordion expansion */
      transition: all 500ms cubic-bezier(0.5, 0.85, 0.25, 1.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* On hover of wrapper, non-hovered cards compress to 8.5% width, hovered expands to remaining ~57% */
    .accordion-wrapper:hover .accordion-card:not(:hover) {
      flex: 0 0 8.5% !important;
      filter: brightness(0.65) saturate(0.8);
    }
    .accordion-card:hover {
      flex: 1 1 58% !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      border-color: rgba(255, 77, 28, 0.6);
    }

    /* Image Presentation */
    .accordion-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
      z-index: 1;
    }
    .accordion-card:hover .accordion-img {
      transform: scale(1.05);
    }

    /* Gradient Scrim */
    .card-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.45) 0%,
        rgba(0, 0, 0, 0.1) 40%,
        rgba(0, 0, 0, 0.85) 85%,
        rgba(0, 0, 0, 0.98) 100%
      );
      z-index: 2;
      pointer-events: none;
    }

    /* Frosted glass blur effect on non-hovered siblings */
    .card-glass-blur {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(0px);
      opacity: 0;
      z-index: 3;
      pointer-events: none;
      transition: opacity 300ms ease;
    }
    .accordion-wrapper:hover .accordion-card:not(:hover) .card-glass-blur {
      opacity: 1;
      backdrop-filter: blur(2px);
    }

    /* Top Bar */
    .card-top-bar {
      position: absolute;
      top: 18px;
      left: 18px;
      right: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 4;
      pointer-events: none;
    }
    .card-index {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #ff4d1c;
      background: rgba(10, 10, 12, 0.7);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 77, 28, 0.3);
    }
    .card-cat {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 250ms ease;
    }
    .accordion-card:hover .card-cat {
      opacity: 1;
    }

    /* Bottom Caption & Quote Box */
    .card-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px;
      z-index: 4;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .card-titles {
      margin-bottom: 8px;
    }
    .card-main-title {
      font-family: 'Neurial Grotesk', system-ui, sans-serif;
      font-size: clamp(17px, 2vw, 24px);
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px 0;
      line-height: 1.2;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-sub-title {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Expandable Quote revealed on Hover */
    .quote-box {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transform: translateY(12px);
      transition: all 350ms cubic-bezier(0.5, 0.85, 0.25, 1.8);
      transition-delay: 100ms;
      margin-top: 4px;
    }
    .accordion-card:hover .quote-box {
      max-height: 160px;
      opacity: 1;
      transform: translateY(0);
      transition-delay: 200ms;
    }

    .quote-text {
      font-size: 14.5px;
      font-weight: 500;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.92);
      font-style: italic;
      margin: 6px 0 10px 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    }
    .credit-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 8px;
    }
    .credit-author {
      font-size: 11px;
      font-weight: 600;
      color: #ff4d1c;
      letter-spacing: 0.04em;
    }
    .fullscreen-hint {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      background: rgba(255, 77, 28, 0.25);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255, 77, 28, 0.4);
    }

    /* Neon Bottom Line Indicator */
    .neon-border {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #ff4d1c;
      opacity: 0;
      box-shadow: 0 0 12px #ff4d1c;
      transition: opacity 300ms ease;
      z-index: 5;
    }
    .accordion-card:hover .neon-border {
      opacity: 1;
    }

    /* Navigation Footer */
    .gallery-nav-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
    }
    .nav-info {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
    }
    .highlight-text {
      color: #ff4d1c;
      font-weight: 700;
    }
    .nav-controls {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .nav-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .nav-btn:hover:not(:disabled) {
      background: #ff4d1c;
      border-color: #ff4d1c;
      box-shadow: 0 2px 12px rgba(255, 77, 28, 0.35);
    }
    .nav-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .page-indicator {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.8);
      font-variant-numeric: tabular-nums;
    }

    /* =========================================================================
       MOBILE RESPONSIVENESS (Cruip max-md:flex-col)
       ========================================================================= */
    @media (max-width: 900px) {
      .accordion-gallery-main {
        padding-top: 76px;
        padding-bottom: 30px;
      }
      .gallery-header {
        margin-bottom: 14px;
      }
      .gallery-title {
        font-size: 26px;
      }
      .gallery-subtitle {
        font-size: 13px;
        margin-bottom: 12px;
      }
      .controls-row {
        gap: 8px;
      }
      .pill-btn {
        padding: 6px 14px;
        font-size: 11.5px;
      }
      .batch-btn {
        padding: 5px 10px;
        font-size: 11px;
      }
      .accordion-wrapper {
        flex-direction: column !important;
        height: auto !important;
        gap: 12px;
        margin: 14px 0;
      }
      .accordion-card {
        height: 115px !important;
        flex: none !important;
        width: 100% !important;
        transition: height 450ms cubic-bezier(0.5, 0.85, 0.25, 1.15) !important;
      }
      .accordion-card .card-top-bar {
        top: 10px;
        left: 12px;
        right: 12px;
      }
      .accordion-card .card-caption {
        padding: 12px 14px;
      }
      .accordion-card .card-main-title {
        font-size: 16px;
        margin-bottom: 2px;
      }
      .accordion-card .card-sub-title {
        font-size: 11px;
      }
      .accordion-card:not(.is-focused) .card-top-bar {
        justify-content: flex-end;
      }
      .accordion-card:not(.is-focused) .card-index {
        display: none;
      }
      .accordion-card.is-focused {
        height: 380px !important;
        border-color: rgba(255, 77, 28, 0.6) !important;
      }
      .accordion-card.is-focused .card-top-bar {
        justify-content: space-between;
      }
      .accordion-card.is-focused .card-index {
        display: block;
      }
      .accordion-card.is-focused .card-cat {
        opacity: 1;
      }
      .quote-box {
        max-height: 0;
      }
      .accordion-card.is-focused .quote-box {
        max-height: 180px;
        opacity: 1;
        transform: translateY(0);
      }
      .accordion-card.is-focused .neon-border {
        opacity: 1;
      }
    }

    /* =========================================================================
       TRUE EDGE-TO-EDGE FULLSCREEN LIGHTBOX MODAL
       ========================================================================= */
    .fullscreen-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      box-sizing: border-box;
      animation: fadeInModal 0.25s ease-out;
    }
    @keyframes fadeInModal {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(5, 5, 8, 0.94);
      backdrop-filter: blur(20px);
      z-index: 1;
    }
    .modal-topbar {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .modal-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .modal-index {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #ff4d1c;
      text-transform: uppercase;
    }
    .modal-heading {
      font-family: 'Neurial Grotesk', system-ui, sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .modal-sub {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    .modal-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .modal-action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .modal-action-btn:hover {
      background: #ff4d1c;
      border-color: #ff4d1c;
      transform: scale(1.05);
    }
    .close-btn {
      font-size: 18px;
      font-weight: 700;
    }

    /* Modal Stage */
    .modal-stage {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1200px;
      height: calc(100vh - 220px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .modal-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
      user-select: none;
    }

    .modal-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(14, 15, 20, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      font-size: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
      z-index: 20;
    }
    .modal-arrow:hover {
      background: #ff4d1c;
      border-color: #ff4d1c;
      transform: translateY(-50%) scale(1.1);
    }
    .modal-prev {
      left: 16px;
    }
    .modal-next {
      right: 16px;
    }

    /* Modal Bottom */
    .modal-bottom {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1200px;
      text-align: center;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .modal-quote {
      font-size: 15px;
      font-style: italic;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 4px 0;
    }
    .modal-credit {
      font-size: 12px;
      color: #ff4d1c;
      font-weight: 600;
    }
  `],
})
export class GalleryComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Hovered or focused card index
  focusedIndex = signal<number | null>(null);

  // Pagination for accordion (displays 6 cards at a time to prevent horizontal overcrowding)
  readonly pageSize = 6;
  currentBatch = signal<number>(0);

  // Edge-to-Edge Fullscreen Lightbox Modal
  activeModalItem = signal<AccordionItem | null>(null);
  modalIndex = signal<number>(0);

  // 18 Automotive Studio Prototypes & Clay Sculpting Projects
  studioItems: AccordionItem[] = [
    {
      id: 's1',
      title: 'JAWA 42 Koren Custom',
      subtitle: 'Full Scale Working Custom Build',
      quote: 'Innovate relentlessly. Every line on this machine is hand-carved in clay before freezing.',
      credit: 'R Donshong Koren & 2NOMADS Workshop',
      image: '/media/gallery/jawa42-custom-profile.jpg',
      category: 'Prototype Show',
    },
    {
      id: 's2',
      title: 'Clay Surfacing Grid',
      subtitle: '1:1 Wheelbase & Stance Blueprint',
      quote: 'Mastering two-wheeler architecture, wheelbase stance, and physical packaging.',
      credit: 'Automotive Clay Bench',
      image: '/media/gallery/clay-bike-surfacing-grid.jpg',
      category: 'Clay Craft',
    },
    {
      id: 's3',
      title: 'BSA Bobber Custom Show',
      subtitle: 'Hand-Crafted Prototype Turntable',
      quote: 'Precision gold pinstripe tail and cantilever saddle on full motorcycle show stand.',
      credit: '2NOMADS Fabrication Team',
      image: '/media/gallery/bsa-bobber-350-show.jpg',
      category: 'Show Build',
    },
    {
      id: 's4',
      title: 'Oneaxi Electric Scooter',
      subtitle: 'In-House Urban EV Platform',
      quote: 'Aerodynamic crimson front fairing and exposed trellis chassis designed from scratch.',
      credit: 'Oneaxi Studio Project',
      image: '/media/gallery/oneaxi-electric-scooter-studio.jpg',
      category: 'EV Mobility',
    },
    {
      id: 's5',
      title: 'Tape Drawing & Blueprint Rig',
      subtitle: 'Traditional Automotive Layout',
      quote: 'Full-scale orthographic blueprint line transfer defining key feature lines.',
      credit: 'Academy Studio Modellers',
      image: '/media/gallery/clay-bike-full-tape-blueprint.jpg',
      category: 'Design Tape',
    },
    {
      id: 's6',
      title: 'Lykan Hypersport Front DRL',
      subtitle: 'Hypercar Clay Surface Validation',
      quote: 'Sharp titanium shoulder character lines sculpted by hand in high-density styling clay.',
      credit: 'Studio Modellers',
      image: '/media/gallery/lykan-hypersport-front-drl.jpg',
      category: 'Class-A Surface',
    },
    {
      id: 's7',
      title: 'Shelby Cobra 427 Roadster',
      subtitle: '1:1 Full Scale Aluminum & Clay',
      quote: 'Guardsman Blue with Le Mans racing stripes recreated through accurate coordinate points.',
      credit: '2NOMADS Heritage Build',
      image: '/media/gallery/shelby-cobra-427-making.jpg',
      category: 'Iconic Classic',
    },
    {
      id: 's8',
      title: 'Kapil Dev Clay Car Review',
      subtitle: 'Styling Coordinate Inspection',
      quote: 'Legendary sports icon reviewing passenger car scale proportions at the coordinate bridge.',
      credit: 'Automotive Styling Directors',
      image: '/media/gallery/kapil-dev-clay-car-review.jpg',
      category: 'OEM Review',
    },
    {
      id: 's9',
      title: 'Lykan Hypersport Wind Tunnel',
      subtitle: 'Aerodynamic Smoke Flow Reveal',
      quote: 'Full vehicle smoke flow test verifying airflow across the rear wing and diffusers.',
      credit: 'W Motors & Aerodynamics Lab',
      image: '/media/gallery/lykan-hypersport-rear-smoke.jpg',
      category: 'Wind Tunnel',
    },
    {
      id: 's10',
      title: 'Aerodynamic Front Fairing Buck',
      subtitle: 'Mounted on Testing Turntable Jig',
      quote: 'Hand-sculpted fairing buck aligned on multi-axis coordinate tooling table.',
      credit: '2NOMADS Prototyping',
      image: '/media/gallery/motorcycle-aero-buck-jig.jpg',
      category: 'Prototyping',
    },
    {
      id: 's11',
      title: 'JAWA 42 Bobbed Tail View',
      subtitle: 'Custom AVL Exhaust & Clean Frame',
      quote: 'Stripped back bobber profile combining classic heritage with sharp modern attitude.',
      credit: 'Koren Custom Build',
      image: '/media/gallery/jawa42-custom-rear.jpg',
      category: 'Custom Motorcycle',
    },
    {
      id: 's12',
      title: 'Clay Bike Surfacing Stage 1',
      subtitle: 'Rough Armature Block-Out',
      quote: 'Warm synthetic clay applied over steel armature to define foundational proportions.',
      credit: 'Clay Academy',
      image: '/media/gallery/clay-bike-surfacing-stage-1.jpg',
      category: 'Clay Sculpting',
    },
    {
      id: 's13',
      title: 'Clay Bike Surfacing Stage 2',
      subtitle: 'Precision Scraper & Line Finish',
      quote: 'Flexible steel scrapers cutting crisp light reflections into curved tank volumes.',
      credit: 'Senior Clay Sculptors',
      image: '/media/gallery/clay-bike-surfacing-stage-2.jpg',
      category: 'Clay Sculpting',
    },
    {
      id: 's14',
      title: 'Clay Bike Surfacing Stage 3',
      subtitle: 'Final High-Gloss Dynoc Foil Wrap',
      quote: 'Silver reflective film applied over raw clay to simulate finished painted sheet metal.',
      credit: 'Studio Finishers',
      image: '/media/gallery/clay-bike-surfacing-stage-3.jpg',
      category: 'Clay Sculpting',
    },
    {
      id: 's15',
      title: 'BSA Bobber Tank & Engine',
      subtitle: 'Mirror-Gloss Deep Finish',
      quote: 'Refined fuel tank knee indents and polished 1903 engine casing details.',
      credit: 'Paint & Finish Studio',
      image: '/media/gallery/bsa-tank-engine-detail.jpg',
      category: 'Detail Craft',
    },
    {
      id: 's16',
      title: 'Clay Saddle & Side Cover',
      subtitle: 'Hand-Smoothed Radius Transitions',
      quote: 'Sculpting ergonomic contact points where rider and chassis harmonize.',
      credit: '2NOMADS Design Lab',
      image: '/media/gallery/clay-saddle-sidepanel-craft.jpg',
      category: 'Ergonomics',
    },
    {
      id: 's17',
      title: 'JAWA 42 Three-Quarter View',
      subtitle: 'Dynamic Road Stance',
      quote: 'Aggressive lowered stance with inverted fork geometry ready for street testing.',
      credit: 'Donshong Koren',
      image: '/media/gallery/jawa42-custom-threequarter.jpg',
      category: 'Custom Motorcycle',
    },
    {
      id: 's18',
      title: 'BSA Bobber Floating Saddle',
      subtitle: 'Diamond Quilted Alcantara Seat',
      quote: 'Cantilevered single saddle floating cleanly above the minimalist rear bobber fender.',
      credit: 'Bespoke Upholstery',
      image: '/media/gallery/bsa-bobber-saddle-tail.jpg',
      category: 'Detail Craft',
    },
  ];

  currentDataset = computed<AccordionItem[]>(() => {
    return this.studioItems;
  });

  totalBatches = computed<number[]>(() => {
    const count = Math.ceil(this.currentDataset().length / this.pageSize);
    return Array.from({ length: count }, (_, i) => i);
  });

  visibleItems = computed<AccordionItem[]>(() => {
    const list = this.currentDataset();
    const start = this.currentBatch() * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  setBatch(index: number): void {
    this.currentBatch.set(index);
    this.focusedIndex.set(null);
  }

  prevBatch(): void {
    if (this.currentBatch() > 0) {
      this.currentBatch.update((b) => b - 1);
      this.focusedIndex.set(null);
    }
  }

  nextBatch(): void {
    if (this.currentBatch() < this.totalBatches().length - 1) {
      this.currentBatch.update((b) => b + 1);
      this.focusedIndex.set(null);
    }
  }

  handleCardClick(item: AccordionItem, index: number): void {
    if (this.isBrowser && window.innerWidth <= 900) {
      // On mobile, if this card is already focused, open fullscreen modal; otherwise focus it
      if (this.focusedIndex() === index) {
        this.openFullscreen(item, index);
      } else {
        this.focusedIndex.set(index);
      }
      return;
    }
    // On desktop, click opens fullscreen lightbox
    this.openFullscreen(item, index);
  }

  openFullscreen(item: AccordionItem, index: number): void {
    const overallIndex = index + this.currentBatch() * this.pageSize;
    this.activeModalItem.set(item);
    this.modalIndex.set(overallIndex);
  }

  closeFullscreen(): void {
    this.activeModalItem.set(null);
  }

  navigateModal(delta: number): void {
    const list = this.currentDataset();
    const newIdx = (this.modalIndex() + delta + list.length) % list.length;
    this.modalIndex.set(newIdx);
    this.activeModalItem.set(list[newIdx]);
  }

  toggleBrowserFullscreen(): void {
    if (!this.isBrowser) return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.activeModalItem()) return;

    if (event.key === 'Escape') {
      this.closeFullscreen();
    } else if (event.key === 'ArrowRight') {
      this.navigateModal(1);
    } else if (event.key === 'ArrowLeft') {
      this.navigateModal(-1);
    }
  }

  ngOnDestroy(): void {}
}
