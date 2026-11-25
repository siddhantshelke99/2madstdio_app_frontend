import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface GalleryItem {
  id: string;
  title: string;
  category: 'clay' | 'prototype' | 'studio';
  image: string;
  description: string;
}

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative overflow-hidden pt-24 pb-20">

      <!-- HERO SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#1c1d24]">
        <div class="max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ff4d1c]/10 border border-[#ff4d1c]/30 text-xs font-mono text-[#ff4d1c] uppercase tracking-widest">
            Studio Division · OEM Design Services
          </div>
          <h1 class="font-['Space_Grotesk'] text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Design Services for Automotive OEMs.
          </h1>
          <p class="text-base sm:text-lg text-[#9da0ac] leading-relaxed">
            From styling clay to running prototype — trusted by brands including Classic Legend, Pluto Mobility, and Hindustan Motors. We provide automotive design houses with tactile physical sculpting and turnkey vehicle builds.
          </p>
          <div class="pt-2">
            <a
              routerLink="/contact"
              [queryParams]="{ type: 'studio_project' }"
              class="inline-block px-7 py-3.5 rounded-md bg-[#ff4d1c] hover:bg-[#ff6538] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg">
              Submit a Project RFP &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- SERVICES DETAIL GRID -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">

        <!-- Service 01: Clay Service -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6 order-2 lg:order-1">
            <div class="text-xs font-mono uppercase tracking-[0.25em] text-[#ff4d1c]">
              Studio · 01
            </div>
            <h2 class="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white">
              Clay Service (Scale &amp; Full 1:1)
            </h2>
            <p class="text-sm sm:text-base text-[#9b9da8] leading-relaxed">
              Scale and full-size clay models for two-wheelers, cars, and concepts. We take your vehicle design through clay, correct it surface by surface under proper studio lights, and tune tape lines until the stance and highlights are flawless.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Armature Construction:</strong> Welded steel and aluminum chassis bucks built to precise wheelbase, ground clearance, and suspension geometry.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Highlight Reading:</strong> Continuous evaluation under longitudinal fluorescent tube arrays to eradicate surface waviness.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Di-Noc Wrapping:</strong> Metallic wrap film application for realistic executive presentation and OEM board sign-offs.
                </p>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-2 rounded-xl overflow-hidden border border-[#232530] bg-[#121317]">
            <img
              src="/images/gallery/work-01.jpg"
              alt="Automotive styling clay model being sculpted at 2NOMADS"
              class="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        <!-- Service 02: Prototype Service -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="rounded-xl overflow-hidden border border-[#232530] bg-[#121317]">
            <img
              src="/images/gallery/work-03.jpg"
              alt="Functional prototype motorcycle build at 2NOMADS"
              class="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="space-y-6">
            <div class="text-xs font-mono uppercase tracking-[0.25em] text-[#ff4d1c]">
              Studio · 02
            </div>
            <h2 class="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white">
              Prototype Service (Show &amp; Working)
            </h2>
            <p class="text-sm sm:text-base text-[#9b9da8] leading-relaxed">
              Show prototypes for vehicle launches and auto expos, and working prototypes that actually run on track — from custom motorcycle builds for Classic Legend to proprietary lightweight electric scooter chassis for Pluto Mobility.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Composite Tooling:</strong> FRP, epoxy tooling boards, and vacuum-assisted composite molding for structural body panels.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Powertrain Packaging:</strong> Integration of ICE engines, battery enclosures, electric hub motors, and harness routing.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Show Finish Paint:</strong> Multi-coat automotive polyurethane finishes, hand-cast acrylic lenses, and metal plating.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Service 03: 3D Scanning & Reverse Engineering -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6 order-2 lg:order-1">
            <div class="text-xs font-mono uppercase tracking-[0.25em] text-[#ff4d1c]">
              Studio · 03
            </div>
            <h2 class="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white">
              3D Optical Scanning &amp; Class-A Reverse CAD
            </h2>
            <p class="text-sm sm:text-base text-[#9b9da8] leading-relaxed">
              Bridge physical clay models and digital engineering. We digitize physical surfaces, generate clean mesh clouds, and produce parametric Class-A NURBS CAD ready for CNC tooling and production tooling release.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>High-Resolution Optical Scanning:</strong> Marker-assisted multi-pass scanning of complex clay surfaces and chassis components.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Mesh Decimation &amp; Deviation Check:</strong> Quantitative error map analysis verifying that scan data matches target blueprints.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff4d1c] mt-2"></span>
                <p class="text-xs sm:text-sm text-[#c7c9d4] leading-normal">
                  <strong>Class-A CAD Surfacing:</strong> High-order Bézier and NURBS patch networks with G2/G3 surface continuity.
                </p>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-2 rounded-xl overflow-hidden border border-[#232530] bg-[#121317]">
            <img
              src="/images/gallery/studio-04.jpg"
              alt="3D coordinate scanning and reverse engineering in studio"
              class="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

      </section>

      <!-- PORTFOLIO GALLERY SHOWCASE -->
      <section class="py-20 bg-[#0a0a0d] border-t border-[#1c1d24]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span class="text-xs font-mono uppercase tracking-[0.25em] text-[#ff4d1c]">
                Portfolio &amp; Work
              </span>
              <h2 class="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white mt-2">
                Inside the 2NOMADS Workshop.
              </h2>
            </div>

            <!-- Category Filter Tabs -->
            <div class="flex flex-wrap gap-2 text-xs font-mono">
              <button
                (click)="setFilter('all')"
                [class.bg-[#ff4d1c]]="activeFilter() === 'all'"
                [class.text-white]="activeFilter() === 'all'"
                [class.bg-[#15161b]]="activeFilter() !== 'all'"
                [class.text-[#8e909a]]="activeFilter() !== 'all'"
                class="px-3.5 py-1.5 rounded border border-[#262832] transition-colors">
                All Works
              </button>
              <button
                (click)="setFilter('clay')"
                [class.bg-[#ff4d1c]]="activeFilter() === 'clay'"
                [class.text-white]="activeFilter() === 'clay'"
                [class.bg-[#15161b]]="activeFilter() !== 'clay'"
                [class.text-[#8e909a]]="activeFilter() !== 'clay'"
                class="px-3.5 py-1.5 rounded border border-[#262832] transition-colors">
                Clay Modeling
              </button>
              <button
                (click)="setFilter('prototype')"
                [class.bg-[#ff4d1c]]="activeFilter() === 'prototype'"
                [class.text-white]="activeFilter() === 'prototype'"
                [class.bg-[#15161b]]="activeFilter() !== 'prototype'"
                [class.text-[#8e909a]]="activeFilter() !== 'prototype'"
                class="px-3.5 py-1.5 rounded border border-[#262832] transition-colors">
                Prototypes
              </button>
              <button
                (click)="setFilter('studio')"
                [class.bg-[#ff4d1c]]="activeFilter() === 'studio'"
                [class.text-white]="activeFilter() === 'studio'"
                [class.bg-[#15161b]]="activeFilter() !== 'studio'"
                [class.text-[#8e909a]]="activeFilter() !== 'studio'"
                class="px-3.5 py-1.5 rounded border border-[#262832] transition-colors">
                Studio Life
              </button>
            </div>
          </div>

          <!-- Gallery Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (item of filteredItems(); track item.id) {
              <div class="group rounded-xl overflow-hidden bg-[#121316] border border-[#22242c] hover:border-[#ff4d1c]/50 transition-all duration-300">
                <div class="relative h-64 overflow-hidden bg-[#0c0d10]">
                  <img
                    [src]="item.image"
                    [alt]="item.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#070708]/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#ff4d1c] border border-white/10">
                    {{ item.category }}
                  </div>
                </div>
                <div class="p-5 space-y-2">
                  <h3 class="font-['Space_Grotesk'] font-bold text-lg text-white group-hover:text-[#ff4d1c] transition-colors">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-[#8e909a] leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            }
          </div>

        </div>
      </section>

      <!-- BOTTOM RFP CALLOUT -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 class="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white">
          Need styling clay models or running prototypes for your program?
        </h2>
        <p class="text-sm text-[#9597a2] max-w-xl mx-auto">
          Contact our Bhosari, Pune studio for project timeline estimation, capacity planning, and quotation.
        </p>
        <div>
          <a
            routerLink="/contact"
            [queryParams]="{ type: 'studio_project' }"
            class="inline-block px-8 py-4 rounded-md bg-[#ff4d1c] hover:bg-[#ff6538] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg">
            Request Studio Proposal
          </a>
        </div>
      </section>

    </div>
  `,
})
export class StudioPageComponent {
  activeFilter = signal<'all' | 'clay' | 'prototype' | 'studio'>('all');

  galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Full-Scale Two-Wheeler Clay Sculpt',
      category: 'clay',
      image: '/images/gallery/work-01.jpg',
      description: 'Precision styling clay model prepared for client ergonomic validation and surfacing review.',
    },
    {
      id: '2',
      title: 'Coordinate Measurement & Scraper Tuning',
      category: 'clay',
      image: '/images/gallery/work-02.jpg',
      description: 'Hand scrape refinement along fuel tank shoulder lines under calibrated neon studio lights.',
    },
    {
      id: '3',
      title: 'Custom Motorcycle Prototype Build',
      category: 'prototype',
      image: '/images/gallery/work-03.jpg',
      description: 'Functional show build featuring bespoke chassis fabrication, composite tank, and custom exhaust.',
    },
    {
      id: '4',
      title: 'Laser Scanning Calibration',
      category: 'studio',
      image: '/images/gallery/studio-04.jpg',
      description: 'Optical 3D scanner capture of clay styling volume for reverse CAD mesh generation.',
    },
    {
      id: '5',
      title: 'Di-Noc Wrapping Demonstration',
      category: 'clay',
      image: '/images/gallery/work-05.jpg',
      description: 'Applying metallic automotive film over clay for executive presentation sign-offs.',
    },
    {
      id: '6',
      title: 'Studio Life in Bhosari, Pune',
      category: 'studio',
      image: '/images/gallery/studio-06.jpg',
      description: 'Moulding stations, composite layups, and design reviews inside the 2NOMADS facility.',
    },
  ];

  setFilter(filter: 'all' | 'clay' | 'prototype' | 'studio'): void {
    this.activeFilter.set(filter);
  }

  filteredItems(): GalleryItem[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.galleryItems;
    return this.galleryItems.filter((i) => i.category === filter);
  }
}
