import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { InquiryComponent } from '../../components/inquiry/inquiry.component';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    InquiryComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  courses = signal<Course[]>([]);
  
  // Cinematic Video Showcase Signals
  isVideoMuted = signal<boolean>(true);

  private cleanupFns: Array<() => void> = [];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.api.getCourses().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.courses.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load courses:', err),
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Check fragment
    this.route.fragment.subscribe((frag) => {
      if (frag) {
        const scrollToFragment = () => {
          const el = document.getElementById(frag);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        };
        setTimeout(scrollToFragment, 100);
        setTimeout(scrollToFragment, 350);
      }
    });

    // Check path for direct deep linking (/register -> #enroll, /contact -> #contact, /academy -> #academy, /studio -> #studio)
    this.route.url.subscribe((segments) => {
      const path = segments.map((s) => s.path).join('/');
      const pathToSection: Record<string, string> = {
        register: 'enroll',
        enroll: 'enroll',
        contact: 'contact',
        academy: 'academy',
        studio: 'studio',
      };
      if (pathToSection[path]) {
        setTimeout(() => {
          const el = document.getElementById(pathToSection[path]);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    });

    this.initPageInteractions();
  }

  private initPageInteractions(): void {
    const main = document.getElementById('main');
    if (!main) return;

    const sections = [...document.querySelectorAll('section')];

    // Hardware accelerated parallax & section reveals
    let ticking = false;
    const updateParallax = () => {
      const viewHeight = main.clientHeight;
      const isDesktop = window.innerWidth > 960;

      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        if (rect.bottom >= -100 && rect.top <= viewHeight + 100) {
          const centerOffset = rect.top + rect.height / 2 - viewHeight / 2;
          const heroBg = s.querySelector('.bg-hero') as HTMLElement;
          if (heroBg) {
            heroBg.style.setProperty('--py', `${(rect.top * 0.14).toFixed(1)}px`);
          }

          if (isDesktop) {
            const sidePhoto = s.querySelector('.side-photo') as HTMLElement;
            if (sidePhoto) {
              sidePhoto.style.setProperty('--py', `${(centerOffset * -0.055).toFixed(1)}px`);
            }
            const sideArt = s.querySelector('.side-art') as HTMLElement;
            if (sideArt) {
              sideArt.style.setProperty('--py', `${(centerOffset * -0.04).toFixed(1)}px`);
            }
            const vidFrame = s.querySelector('.vid-frame') as HTMLElement;
            if (vidFrame) {
              vidFrame.style.setProperty('--py', `${(centerOffset * -0.03).toFixed(1)}px`);
            }
          }
        }
      });

      revealSections();
      ticking = false;
    };

    const revealSections = () => {
      const vh = main.clientHeight || window.innerHeight;
      sections.forEach((s) => {
        if (s.classList.contains('in')) return;
        const r = s.getBoundingClientRect();
        if (r.top < vh * 1.05 && r.bottom > -80) s.classList.add('in');
      });
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    main.addEventListener('scroll', onScroll, { passive: true });
    this.cleanupFns.push(() => main.removeEventListener('scroll', onScroll));

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('in');
          });
        },
        { root: main, threshold: [0, 0.05], rootMargin: '120px 0px 80px 0px' }
      );
      sections.forEach((s) => io.observe(s));
      this.cleanupFns.push(() => io.disconnect());
    }
    revealSections();

    // Gallery & Lightbox
    this.initGallerySystem(main);

    // Video Scroll Showcase
    this.initShowcaseVideoScrubber(main);
  }

  private initGallerySystem(main: HTMLElement): void {
    const filterBtns = document.querySelectorAll('.g-filter-btn');
    const cards = [...document.querySelectorAll('.gallery-card')] as HTMLElement[];
    const reelCards = [...document.querySelectorAll('.g-reel-card')] as HTMLElement[];
    const lightbox = document.getElementById('galleryLightbox');
    if (!lightbox || !cards.length) return;

    const glImage = document.getElementById('glImage') as HTMLImageElement;
    const glVideo = document.getElementById('glVideo') as HTMLVideoElement;
    const glTag = document.getElementById('glTag');
    const glCounter = document.getElementById('glCounter');
    const glTitle = document.getElementById('glTitle');
    const glDesc = document.getElementById('glDesc');
    const glClose = document.getElementById('glClose');
    const glPrev = document.getElementById('glPrev');
    const glNext = document.getElementById('glNext');
    const glBackdrop = document.getElementById('glBackdrop');
    const glFullscreenBtn = document.getElementById('glFullscreenBtn');
    const glZoomBtn = document.getElementById('glZoomBtn');
    const glStage = document.getElementById('glStage');
    const glBody = document.getElementById('glBody');

    // Reel Track Elements
    const reelTrackContainer = document.getElementById('gReelTrackContainer');
    const reelProgressBar = document.getElementById('gReelProgressBar');
    const reelPrev = document.getElementById('gReelPrev');
    const reelNext = document.getElementById('gReelNext');

    let currentFilter = 'all';
    let activeCards = [...cards];
    let activeIndex = 0;
    let isZoomed = false;

    const PAGE_SIZE = 24;
    let visibleLimit = PAGE_SIZE;
    const loadMoreWrap = document.getElementById('galleryLoadMore');
    const moreBtn = document.getElementById('galleryMoreBtn') as HTMLButtonElement;
    const moreLabel = document.getElementById('galleryMoreLabel');
    const visibleCountEl = document.getElementById('galleryVisibleCount');

    // 1. Horizontal Scroll Motion Reel System (Inspired by animmasterlib.dev/scroll)
    if (reelTrackContainer) {
      const updateReelProgressAndParallax = () => {
        const maxScroll = reelTrackContainer.scrollWidth - reelTrackContainer.clientWidth;
        const progress = maxScroll > 0 ? (reelTrackContainer.scrollLeft / maxScroll) * 100 : 0;
        if (reelProgressBar) {
          reelProgressBar.style.width = Math.min(100, Math.max(8, progress)) + '%';
        }

        // Parallax depth motion on inner images
        const containerRect = reelTrackContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        reelCards.forEach((rc) => {
          const rect = rc.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const offset = (cardCenter - containerCenter) / (containerRect.width / 2);
          const clampedOffset = Math.max(-1.5, Math.min(1.5, offset));
          const img = rc.querySelector('.g-reel-img') as HTMLElement | null;
          if (img) {
            img.style.transform = `scale(1.08) translateX(${clampedOffset * -14}px)`;
          }
        });
      };

      reelTrackContainer.addEventListener('scroll', updateReelProgressAndParallax, { passive: true });
      this.cleanupFns.push(() => reelTrackContainer.removeEventListener('scroll', updateReelProgressAndParallax));
      updateReelProgressAndParallax();

      // Navigation Buttons (Glide by card width)
      reelPrev?.addEventListener('click', () => {
        const scrollAmount = Math.max(340, reelTrackContainer.clientWidth * 0.7);
        reelTrackContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      reelNext?.addEventListener('click', () => {
        const scrollAmount = Math.max(340, reelTrackContainer.clientWidth * 0.7);
        reelTrackContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });

      // Drag-to-Scrub Physics for Desktop
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        reelTrackContainer.classList.add('is-dragging');
        startX = e.pageX - reelTrackContainer.offsetLeft;
        startScrollLeft = reelTrackContainer.scrollLeft;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - reelTrackContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        reelTrackContainer.scrollLeft = startScrollLeft - walk;
      };

      const onMouseUp = () => {
        isDragging = false;
        reelTrackContainer.classList.remove('is-dragging');
      };

      reelTrackContainer.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      this.cleanupFns.push(() => {
        reelTrackContainer.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      });

      // Video preview hover for Reel Cards
      reelCards.forEach((rc) => {
        const v = rc.querySelector('.g-reel-video') as HTMLVideoElement | null;
        if (v) {
          rc.addEventListener('mouseenter', () => {
            v.play().catch(() => {});
          });
          rc.addEventListener('mouseleave', () => {
            v.pause();
            v.currentTime = 0;
          });
        }
      });
    }

    // 2. 3D Tilt Perspective on Hover (Both Bento Cards and Reel Cards)
    const allInteractiveCards = [...cards, ...reelCards];
    allInteractiveCards.forEach((c) => {
      const onCardMove = (e: MouseEvent) => {
        if (window.innerWidth <= 768) return;
        const rect = c.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        c.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
      };

      const onCardLeave = () => {
        c.style.transform = '';
      };

      c.addEventListener('mousemove', onCardMove);
      c.addEventListener('mouseleave', onCardLeave);
    });

    // 3. Category Filter Counts & Filtering
    const matchesFilter = (card: HTMLElement, filter: string): boolean => {
      if (filter === 'all') return true;
      const cat = card.dataset['category'] || '';
      const tags = (card.dataset['tags'] || '').toLowerCase();
      const isVideo = card.dataset['mediaType'] === 'video' || !!card.dataset['videoSrc'];

      if (filter === 'reels') return isVideo || tags.includes('reel') || tags.includes('reels');
      if (filter === 'clay') return cat === 'clay' || tags.includes('clay');
      if (filter === 'work') return cat === 'work' || tags.includes('work') || tags.includes('prototype') || isVideo;
      if (filter === 'studio') return cat === 'studio' || tags.includes('studio');
      return cat === filter || tags.includes(filter);
    };

    // Calculate dynamic counts
    const countEl = (id: string, count: number) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(count);
    };
    countEl('countAll', cards.length);
    countEl('countWork', cards.filter((c) => matchesFilter(c, 'work')).length);
    countEl('countClay', cards.filter((c) => matchesFilter(c, 'clay')).length);
    countEl('countStudio', cards.filter((c) => matchesFilter(c, 'studio')).length);
    countEl('countReels', cards.filter((c) => matchesFilter(c, 'reels')).length);

    const applyGalleryView = (animate: boolean) => {
      activeCards = [];
      let matched = 0;
      cards.forEach((card) => {
        const matches = matchesFilter(card, currentFilter);
        if (!matches) {
          card.classList.add('g-hidden');
          card.classList.remove('g-fade-in');
          return;
        }
        matched++;
        if (matched <= visibleLimit) {
          const entering = card.classList.contains('g-hidden');
          card.classList.remove('g-hidden');
          if (animate && entering) {
            card.classList.remove('g-fade-in');
            void card.offsetWidth;
            card.classList.add('g-fade-in');
          }
          activeCards.push(card);
        } else {
          card.classList.add('g-hidden');
          card.classList.remove('g-fade-in');
        }
      });

      const shown = Math.min(visibleLimit, matched);
      if (visibleCountEl) {
        visibleCountEl.textContent = matched
          ? 'Showing ' + shown + ' of ' + matched
          : 'No photos in this category';
      }
      if (moreBtn) {
        const remaining = matched - shown;
        moreBtn.hidden = remaining <= 0;
        if (moreLabel) {
          moreLabel.textContent =
            remaining > 0
              ? 'Show ' + Math.min(PAGE_SIZE, remaining) + ' more photos'
              : 'All photos shown';
        }
      }
      if (loadMoreWrap) {
        loadMoreWrap.classList.toggle('is-complete', matched <= shown);
      }
    };

    filterBtns.forEach((btn) => {
      const el = btn as HTMLElement;
      btn.addEventListener('click', () => {
        const filter = el.dataset['filter'] || 'all';
        if (filter === currentFilter) return;
        currentFilter = filter;
        visibleLimit = PAGE_SIZE;

        filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        applyGalleryView(true);
      });
    });

    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        visibleLimit += PAGE_SIZE;
        applyGalleryView(true);
      });
    }

    applyGalleryView(false);

    // 4. Immersive Fullscreen Lightbox Renderer
    const resetZoom = () => {
      isZoomed = false;
      glStage?.classList.remove('gl-zoomed');
      glZoomBtn?.classList.remove('is-active');
    };

    const cardIsVideo = () => {
      const card = activeCards[activeIndex];
      return card ? !!card.dataset['videoSrc'] : false;
    };

    const renderLightboxItem = () => {
      const card = activeCards[activeIndex];
      if (!card) return;
      resetZoom();

      const imgEl = card.querySelector('img') as HTMLImageElement;
      const titleEl = card.querySelector('.gallery-card-title, .g-reel-card-title');
      const descEl = card.querySelector('.gallery-card-desc, .g-reel-card-desc');
      const pillEl = card.querySelector('.gallery-pill, .g-reel-tag');
      const videoSrc = card.dataset['videoSrc'];

      const title = titleEl ? titleEl.textContent : '';
      const desc = descEl ? descEl.textContent : '';
      const pill = pillEl
        ? pillEl.textContent?.replace('·', '—') || ''
        : (card.dataset['category'] || '').toUpperCase();

      const currentNum = String(activeIndex + 1).padStart(2, '0');
      const totalNum = String(activeCards.length).padStart(2, '0');

      if (glTitle) glTitle.textContent = title;
      if (glDesc) glDesc.textContent = desc;
      if (glTag) glTag.textContent = pill;
      if (glCounter) glCounter.textContent = `${currentNum} / ${totalNum}`;

      if (videoSrc) {
        // Video item
        if (glImage) glImage.style.display = 'none';
        if (glVideo) {
          glVideo.style.display = 'block';
          glVideo.src = videoSrc;
          glVideo.currentTime = 0;
          glVideo.play().catch(() => {});
        }
        if (glZoomBtn) glZoomBtn.style.display = 'none';
      } else {
        // Image item
        if (glVideo) {
          glVideo.pause();
          glVideo.style.display = 'none';
        }
        if (glZoomBtn) glZoomBtn.style.display = 'flex';
        if (glImage) {
          glImage.style.display = 'block';
          glImage.classList.add('gl-changing');
          setTimeout(() => {
            glImage.src = imgEl?.src || '';
            glImage.alt = imgEl?.alt || '';
            glImage.classList.remove('gl-changing');
          }, 120);
        }
      }
    };

    const openLightbox = (index: number, sourceList?: HTMLElement[]) => {
      if (sourceList && sourceList.length) {
        activeCards = sourceList;
      }
      if (index < 0 || index >= activeCards.length) return;
      activeIndex = index;
      renderLightboxItem();
      lightbox.hidden = false;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      main.style.overflow = 'hidden';
      glClose?.focus();
    };

    const closeLightbox = () => {
      resetZoom();
      if (glVideo) glVideo.pause();
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      lightbox.classList.remove('active');
      setTimeout(() => {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        main.style.overflow = '';
      }, 250);
    };

    const showNext = () => {
      if (!activeCards.length) return;
      activeIndex = (activeIndex + 1) % activeCards.length;
      renderLightboxItem();
    };

    const showPrev = () => {
      if (!activeCards.length) return;
      activeIndex = (activeIndex - 1 + activeCards.length) % activeCards.length;
      renderLightboxItem();
    };

    // Zoom Toggle (Z or click Zoom button or double-click image)
    const toggleZoom = () => {
      if (cardIsVideo()) return;
      isZoomed = !isZoomed;
      glStage?.classList.toggle('gl-zoomed', isZoomed);
      glZoomBtn?.classList.toggle('is-active', isZoomed);
    };

    glZoomBtn?.addEventListener('click', toggleZoom);
    glImage?.addEventListener('dblclick', toggleZoom);

    // Native Fullscreen Toggle (F or click Fullscreen button)
    const toggleNativeFullscreen = () => {
      const iconExpand = glFullscreenBtn?.querySelector('.icon-expand') as HTMLElement | null;
      const iconCompress = glFullscreenBtn?.querySelector('.icon-compress') as HTMLElement | null;

      if (!document.fullscreenElement) {
        const req = lightbox.requestFullscreen || (lightbox as any).webkitRequestFullscreen;
        if (req) {
          req.call(lightbox).catch(() => {});
          if (iconExpand) iconExpand.style.display = 'none';
          if (iconCompress) iconCompress.style.display = 'block';
        }
      } else {
        const exit = document.exitFullscreen || (document as any).webkitExitFullscreen;
        if (exit) {
          exit.call(document).catch(() => {});
          if (iconExpand) iconExpand.style.display = 'block';
          if (iconCompress) iconCompress.style.display = 'none';
        }
      }
    };

    glFullscreenBtn?.addEventListener('click', toggleNativeFullscreen);
    const onFsChange = () => {
      const iconExpand = glFullscreenBtn?.querySelector('.icon-expand') as HTMLElement | null;
      const iconCompress = glFullscreenBtn?.querySelector('.icon-compress') as HTMLElement | null;
      const isFs = !!document.fullscreenElement;
      if (iconExpand) iconExpand.style.display = isFs ? 'none' : 'block';
      if (iconCompress) iconCompress.style.display = isFs ? 'block' : 'none';
    };
    document.addEventListener('fullscreenchange', onFsChange);
    this.cleanupFns.push(() => document.removeEventListener('fullscreenchange', onFsChange));

    // Touch Swipe Support for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) showNext();
        else showPrev();
      }
    };
    glBody?.addEventListener('touchstart', onTouchStart, { passive: true });
    glBody?.addEventListener('touchend', onTouchEnd, { passive: true });
    this.cleanupFns.push(() => {
      glBody?.removeEventListener('touchstart', onTouchStart);
      glBody?.removeEventListener('touchend', onTouchEnd);
    });

    // Bento Card Click Handlers
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const idx = activeCards.indexOf(card);
        if (idx !== -1) openLightbox(idx);
      });
      card.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = activeCards.indexOf(card);
          if (idx !== -1) openLightbox(idx);
        }
      });
    });

    // Reel Card Click Handlers
    reelCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        openLightbox(idx, reelCards);
      });
      card.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx, reelCards);
        }
      });
    });

    glClose?.addEventListener('click', closeLightbox);
    glBackdrop?.addEventListener('click', closeLightbox);
    glNext?.addEventListener('click', showNext);
    glPrev?.addEventListener('click', showPrev);

    const onKey = (e: KeyboardEvent) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'f' || e.key === 'F') toggleNativeFullscreen();
      else if (e.key === 'z' || e.key === 'Z') toggleZoom();
      else if (e.key === ' ') {
        if (cardIsVideo() && glVideo) {
          e.preventDefault();
          if (glVideo.paused) glVideo.play();
          else glVideo.pause();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    this.cleanupFns.push(() => window.removeEventListener('keydown', onKey));
  }

  private initShowcaseVideoScrubber(main: HTMLElement): void {
    const sectionEl = document.getElementById('showcase');
    const videoEl = document.getElementById('showcaseVideo') as HTMLVideoElement | null;

    if (!sectionEl || !videoEl) return;

    // Detect mobile touch / small viewport
    const isMobileDevice = () => window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);

    if (isMobileDevice()) {
      // Mobile / Tablet: hardware-accelerated continuous looping playback when in viewport
      videoEl.muted = true;
      videoEl.loop = true;
      videoEl.play().catch(() => {});

      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                videoEl.play().catch(() => {});
              } else {
                videoEl.pause();
              }
            });
          },
          { root: main, threshold: 0.05 }
        );
        obs.observe(sectionEl);
        this.cleanupFns.push(() => obs.disconnect());
      }
      return;
    }

    // Desktop: Pause continuous playback and drive frame-by-frame with scroll
    videoEl.pause();

    let targetProgress = 0;
    let currentProgress = 0;
    let isSeeking = false;
    let isRendering = false;

    // Track seeking state to eliminate seek queue thrashing
    const onSeeking = () => { isSeeking = true; };
    const onSeeked = () => {
      isSeeking = false;
      applySeek();
    };

    videoEl.addEventListener('seeking', onSeeking);
    videoEl.addEventListener('seeked', onSeeked);
    this.cleanupFns.push(() => {
      videoEl.removeEventListener('seeking', onSeeking);
      videoEl.removeEventListener('seeked', onSeeked);
    });

    const applySeek = () => {
      if (!videoEl.duration || isSeeking) return;
      const targetTime = currentProgress * videoEl.duration;
      if (Math.abs(videoEl.currentTime - targetTime) > 0.015) {
        const anyVideo = videoEl as any;
        if (typeof anyVideo.fastSeek === 'function') {
          anyVideo.fastSeek(targetTime);
        } else {
          videoEl.currentTime = targetTime;
        }
      }
    };

    const renderLoop = () => {
      isRendering = false;

      // Responsive interpolation factor (0.35) for butter-smooth catching up
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.35;
        requestRender();
      } else {
        currentProgress = targetProgress;
      }

      applySeek();
    };

    const requestRender = () => {
      if (isRendering) return;
      isRendering = true;
      requestAnimationFrame(renderLoop);
    };

    const onMainScroll = () => {
      const rect = sectionEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalDist = rect.height - vh;
      if (totalDist <= 0) return;

      const rawProgress = -rect.top / totalDist;
      targetProgress = Math.max(0, Math.min(1, rawProgress));

      requestRender();
    };

    main.addEventListener('scroll', onMainScroll, { passive: true });
    this.cleanupFns.push(() => main.removeEventListener('scroll', onMainScroll));

    // Initial check
    onMainScroll();
  }

  scrollToShowcase(): void {
    const el = document.getElementById('showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  toggleVideoAudio(): void {
    const video = document.getElementById('showcaseVideo') as HTMLVideoElement | null;
    if (!video) return;

    video.muted = !video.muted;
    this.isVideoMuted.set(video.muted);
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }
}
