import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { InquiryComponent } from '../../components/inquiry/inquiry.component';

export interface StudioEquipment {
  id: string;
  name: string;
  category: 'clay' | 'scanning' | 'prototype' | 'cad';
  categoryLabel: string;
  model: string;
  image: string;
  specs: string;
  description: string;
  utility: string;
}

export interface StudioService {
  id: string;
  title: string;
  badge: string;
  lead: string;
  image: string;
  points: string[];
}

@Component({
  selector: 'app-studio-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, InquiryComponent],
  template: `
    <app-header></app-header>

    <div class="studio-page-container">

      <!-- HERO SECTION -->
      <section class="studio-hero-section">
        <div class="studio-wrap">
          <div class="studio-breadcrumbs">
            <a routerLink="/">Home</a>
            <span class="studio-breadcrumb-sep">/</span>
            <span class="studio-breadcrumb-current">Studio &amp; Services</span>
          </div>

          <div class="studio-hero-badge">
            <span class="studio-badge-dot"></span>
            <span>AUTOMOTIVE DESIGN &amp; PROTOTYPING STUDIO · BHOSARI, PUNE</span>
          </div>

          <h1 class="studio-hero-title">
            Design Services &amp; Studio Equipment for OEMs
          </h1>

          <p class="studio-hero-lead">
            From 1:4 scale concept styling to full 1:1 running Auto Expo exhibition prototypes — trusted by industry leaders including Classic Legend (BSA / JAWA), Pluto Mobility, and Hindustan Motors. Operating under strict NDA &amp; IP protection protocols in our active Pune studio.
          </p>

          <div class="studio-hero-actions">
            <a href="#equipment" class="btn btn-primary">
              View Studio Equipments ↓
            </a>
            <a href="#inquiry" class="btn btn-secondary">
              Submit OEM Project RFP ↓
            </a>
            <a href="https://wa.me/919158228037" target="_blank" rel="noopener" class="studio-wa-btn">
              💬 WhatsApp Studio Desk
            </a>
          </div>

          <!-- Studio Core Stats Bar -->
          <div class="studio-stat-row">
            <div class="studio-stat-card">
              <span class="studio-stat-val">1:1 Scale</span>
              <span class="studio-stat-lbl">Full Vehicle CMM Coordinate Bench</span>
            </div>
            <div class="studio-stat-card">
              <span class="studio-stat-val">±0.02 mm</span>
              <span class="studio-stat-lbl">Blue Light Laser Metrology Scanner</span>
            </div>
            <div class="studio-stat-card">
              <span class="studio-stat-val">Turnkey</span>
              <span class="studio-stat-lbl">Running Prototypes &amp; Show Builds</span>
            </div>
            <div class="studio-stat-card">
              <span class="studio-stat-val">Strict NDA</span>
              <span class="studio-stat-lbl">Isolated OEM Bays &amp; IP Protection</span>
            </div>
          </div>
        </div>
      </section>

      <!-- OEM TRUST & CLIENTS BAR -->
      <section class="studio-trust-bar">
        <div class="studio-wrap">
          <div class="studio-trust-content">
            <span class="studio-trust-tag">OEM &amp; INDUSTRY PARTNERS:</span>
            <div class="studio-trust-pills">
              <span class="studio-trust-pill">Classic Legend (BSA / JAWA)</span>
              <span class="studio-trust-pill">Pluto Mobility</span>
              <span class="studio-trust-pill">Hindustan Motors</span>
              <span class="studio-trust-pill">SIAM &amp; MITID Lineage</span>
              <span class="studio-trust-pill">Confidential OEM Programs</span>
            </div>
          </div>
        </div>
      </section>

      <!-- STUDIO SERVICES SECTION -->
      <section class="studio-services-section">
        <div class="studio-wrap">
          <div class="section-kicker">Core Capabilities</div>
          <h2 class="section-heading">Automotive Prototyping Services</h2>
          <p class="section-sub">End-to-end mobility development spanning physical clay sculpting, reverse metrology, class-A CAD, and spaceframe engineering.</p>

          <div class="services-cards-grid">
            @for (svc of services; track svc.id) {
              <div class="service-card">
                <div class="service-card-media">
                  <img [src]="svc.image" [alt]="svc.title" loading="lazy">
                  <span class="service-card-badge">{{ svc.badge }}</span>
                </div>
                <div class="service-card-body">
                  <h3 class="service-card-title">{{ svc.title }}</h3>
                  <p class="service-card-lead">{{ svc.lead }}</p>
                  <ul class="service-points-list">
                    @for (pt of svc.points; track pt) {
                      <li>
                        <span class="point-check">✓</span>
                        <span>{{ pt }}</span>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- STUDIO EQUIPMENT DIRECTORY SECTION -->
      <section id="equipment" class="studio-equipment-section">
        <div class="studio-wrap">
          <div class="section-kicker">Studio Facilities &amp; Tooling</div>
          <h2 class="section-heading">Studio Equipment &amp; Required Tooling Directory</h2>
          <p class="section-sub">
            A comprehensive survey of the specialized industrial equipment, measuring jigs, laser metrology systems, and styling tools used daily inside the 2NOMADS automotive studio.
          </p>

          <!-- Filter Pills -->
          <div class="equipment-filter-bar">
            <button
              type="button"
              class="eq-filter-btn"
              [class.active]="selectedCategory() === 'all'"
              (click)="setCategory('all')">
              All Equipment ({{ allEquipment.length }})
            </button>
            <button
              type="button"
              class="eq-filter-btn"
              [class.active]="selectedCategory() === 'clay'"
              (click)="setCategory('clay')">
              Clay Modelling &amp; Surfacing
            </button>
            <button
              type="button"
              class="eq-filter-btn"
              [class.active]="selectedCategory() === 'scanning'"
              (click)="setCategory('scanning')">
              3D Metrology &amp; Scanning
            </button>
            <button
              type="button"
              class="eq-filter-btn"
              [class.active]="selectedCategory() === 'prototype'"
              (click)="setCategory('prototype')">
              Prototyping &amp; Fabrication
            </button>
            <button
              type="button"
              class="eq-filter-btn"
              [class.active]="selectedCategory() === 'cad'"
              (click)="setCategory('cad')">
              Digital CAD &amp; Lab
            </button>
          </div>

          <!-- Equipment Grid -->
          <div class="equipment-grid">
            @for (eq of filteredEquipment(); track eq.id) {
              <div class="eq-card">
                <div class="eq-card-image-wrap">
                  <img [src]="eq.image" [alt]="eq.name" loading="lazy">
                  <div class="eq-card-category-tag">{{ eq.categoryLabel }}</div>
                </div>

                <div class="eq-card-body">
                  <div class="eq-model-tag">{{ eq.model }}</div>
                  <h3 class="eq-card-title">{{ eq.name }}</h3>
                  
                  <div class="eq-spec-box">
                    <strong>Technical Specs:</strong>
                    <span>{{ eq.specs }}</span>
                  </div>

                  <p class="eq-card-desc">{{ eq.description }}</p>

                  <div class="eq-utility-box">
                    <span class="utility-icon">⚙</span>
                    <span class="utility-text"><strong>Studio Utility:</strong> {{ eq.utility }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CLIENT & OEM INQUIRY SECTION -->
      <section id="inquiry" class="studio-inquiry-section">
        <div class="studio-wrap">
          <div class="inquiry-layout-grid">
            <div class="inquiry-info-pane">
              <div class="section-kicker">Client Engagement</div>
              <h2 class="section-heading">Industry &amp; OEM Project RFP Desk</h2>
              <p class="inquiry-intro-text">
                Connect directly with founder R Donshong Koren and our studio leads. Whether you need a 1:4 aerodynamic scale study, a full 1:1 clay styling model, an exhibition showpiece for Auto Expo, or turnkey prototype engineering, our studio delivers with strict confidentiality.
              </p>

              <div class="inquiry-highlights">
                <div class="inquiry-highlight-item">
                  <span class="inq-hi-icon">🔒</span>
                  <div>
                    <h4>NDA &amp; IP Protection Protocol</h4>
                    <p>All client styling decks, CAD files, and clay models are developed in restricted-access bays under binding non-disclosure agreements.</p>
                  </div>
                </div>

                <div class="inquiry-highlight-item">
                  <span class="inq-hi-icon">⏱</span>
                  <div>
                    <h4>Fast Turnaround Capability</h4>
                    <p>Rapid armature fabrication, coordinate bench setup, and round-the-clock master clay sculptors to meet critical OEM gate reviews.</p>
                  </div>
                </div>

                <div class="inquiry-highlight-item">
                  <span class="inq-hi-icon">📍</span>
                  <div>
                    <h4>Direct Studio Visit in Bhosari, Pune</h4>
                    <p>Schedule an in-person facility inspection, coordinate bench review, or technical discussion at our Pune automotive cluster HQ.</p>
                  </div>
                </div>
              </div>

              <!-- Quick Contact Direct Box -->
              <div class="direct-contact-card">
                <h4>Direct Studio Hotline</h4>
                <div class="direct-links">
                  <a href="tel:+919158228037" class="direct-link-tel">📞 +91 91582 28037</a>
                  <a href="mailto:donnykoren@gmail.com" class="direct-link-mail">✉ donnykoren@gmail.com</a>
                  <a href="https://wa.me/919158228037" target="_blank" rel="noopener" class="direct-link-wa">💬 WhatsApp Studio Desk</a>
                </div>
                <div class="studio-address">
                  <strong>Studio Address:</strong> MSEI, Plot No. T-153/1, Bhosari Industrial Area, Pune 411026, Maharashtra, India.
                </div>
              </div>
            </div>

            <!-- Embedded Inquiry Form Component -->
            <div class="inquiry-form-pane">
              <app-inquiry></app-inquiry>
            </div>
          </div>
        </div>
      </section>

    </div>

    <app-footer></app-footer>
  `
})
export class StudioPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  selectedCategory = signal<'all' | 'clay' | 'scanning' | 'prototype' | 'cad'>('all');

  services: StudioService[] = [
    {
      id: 'clay-service',
      title: 'Automotive Clay Modelling (Scale 1:4 to Full 1:1)',
      badge: 'STUDIO SERVICE 01',
      image: '/images/gallery/full-scale-clay-coupe-studio.jpg',
      lead: 'Physical 1:1 scale and proportion study models for two-wheelers, passenger vehicles, and commercial platforms.',
      points: [
        'Rigid welded steel & aluminium coordinate bridge chassis armatures',
        '60°C heated industrial sulfur-free styling clay application',
        'Precision scraping & contour highlight tuning under calibrated neon rays',
        'High-gloss Dynoc foil wrapping for realistic sheet metal board reviews'
      ]
    },
    {
      id: 'prototype-service',
      title: 'Show & Running Vehicle Prototypes',
      badge: 'STUDIO SERVICE 02',
      image: '/images/gallery/bsa-bobber-350-show.jpg',
      lead: 'From exhibition turntable showpieces for Auto Expo to fully running testbeds with functional steering, suspension, and EV powertrain.',
      points: [
        'Turnkey show prototypes with operating bespoke LED optics & Class-A paint',
        'Tubular spaceframe chassis fabrication with road-tested suspension geometry',
        'In-house composite pattern milling & FRP vacuum bagging body panels',
        'Complete EV battery enclosure packaging, BMS wiring, and ICE integration'
      ]
    },
    {
      id: 'scanning-service',
      title: '3D Optical Scanning & Metrology Reverse Loop',
      badge: 'STUDIO SERVICE 03',
      image: '/images/gallery/studio-04.jpg',
      lead: 'Bridging tactile handcraft and mathematical engineering with sub-millimeter structured light optical metrology.',
      points: [
        'Sub-millimeter optical capture of compound curved clay surfaces',
        'Dense point cloud to watertight triangular STL mesh polygonization',
        'Class-A reverse parametric NURBS surfacing in Autodesk Alias',
        'False-color deviation heatmaps comparing clay scans to target CAD models'
      ]
    },
    {
      id: 'digital-service',
      title: 'Digital Sculpting & Class-A Surfacing',
      badge: 'STUDIO SERVICE 04',
      image: '/media/who-we-are.jpg',
      lead: 'Computer-aided styling transforming initial conceptual silhouettes into production-ready mathematical geometry.',
      points: [
        'G0, G1, G2, and G3 continuous Class-A surface math in Alias AutoStudio',
        'Rapid Sub-D polygonal exploration in Blender for rapid packaging studies',
        'Watertight CAM toolpath export for 5-axis CNC router gantry milling',
        'Photorealistic raytraced KeyShot CGI visualizations for executive review decks'
      ]
    }
  ];

  allEquipment: StudioEquipment[] = [
    {
      id: 'eq-cmm',
      name: '1:1 Scale Coordinate Measurement Bench & Bridge (CMM)',
      category: 'clay',
      categoryLabel: 'Clay Modelling & Surfacing',
      model: '2NOMADS 1:1 Full-Scale Bridge Bench',
      image: '/images/gallery/clay-bike-surfacing-grid.jpg',
      specs: '3800mm x 1600mm Bed · Dual Vernier Height Towers · ±0.05mm Datum Tolerance',
      description: 'Heavy ground-steel coordinate datum fixture designed for two-wheeler and vehicle scale clay blockouts with precision horizontal/vertical measuring calipers.',
      utility: 'Establishes symmetric reference points from centerline and verifies package hardpoints across clay surface sweeps.'
    },
    {
      id: 'eq-scanner',
      name: 'Optical Blue Light 3D Laser Scanner & Metrology Station',
      category: 'scanning',
      categoryLabel: '3D Metrology & Scanning',
      model: 'High-Density Industrial Metrology Scanner',
      image: '/images/gallery/studio-04.jpg',
      specs: '1,200,000 points/sec · 0.020mm Mesh Accuracy · PolyWorks Metrology Suite',
      description: 'Sub-millimeter structured light digitizer capturing intricate clay styling touches and transferring coordinate point-clouds into live digital models.',
      utility: 'Freezes approved physical clay revisions and passes scan data back to OEM CAD engineers within hours.'
    },
    {
      id: 'eq-oven',
      name: 'Heated 60°C Industrial Styling Clay Warming Chamber',
      category: 'clay',
      categoryLabel: 'Clay Modelling & Surfacing',
      model: 'Precision Thermal Clay Conditioner',
      image: '/images/gallery/clay-saddle-sidepanel-craft.jpg',
      specs: 'Constant 58°C - 62°C Convection · Multi-Tier Slabs · Sulfur-Free Synthetic Clay',
      description: 'Thermal conditioning chamber maintaining synthetic industrial styling clay at pliable consistency for bubble-free application.',
      utility: 'Allows rapid block-out over polyurethane foam substrates without internal air pockets or structural fractures.'
    },
    {
      id: 'eq-buck',
      name: 'Chassis Alignment Buck & Motorcycle Wheelbase Jig',
      category: 'prototype',
      categoryLabel: 'Prototyping & Fabrication',
      model: 'Rigid Frame & Wheelbase Geometry Jig',
      image: '/images/gallery/motorcycle-aero-buck-jig.jpg',
      specs: 'Adjustable Headstock Rake (18°-35°) · Variable Swingarm Datum · Ground Clearance Datum',
      description: 'Rigid steel bed fixture locking steering headstock angles, tire clearances, and ergonomic rider triangle constraints.',
      utility: 'Provides the exact structural hardpoints upon which fuel tanks, fairings, and seat cowl clay are sculpted.'
    },
    {
      id: 'eq-scrapers',
      name: 'Precision Spring Steel Rakes, Japanese Slickers & Scrapers',
      category: 'clay',
      categoryLabel: 'Clay Modelling & Surfacing',
      model: 'Master Modeller Styling Tool Suite',
      image: '/images/gallery/clay-bike-surfacing-stage-1.jpg',
      specs: 'Tempered Spring Steel · Serrated Contour Rakes · Flexible Slicker Blades · Radius Gauges',
      description: 'Hand-crafted scraping blades used by master modelers to shave micro-millimeters and refine continuous highlight tension lines.',
      utility: 'Shaves away excess clay to reveal pure highlight reflections that digital computer monitors cannot display.'
    },
    {
      id: 'eq-welder',
      name: 'Tubular Spaceframe Chassis Jig & TIG/MIG Welding Station',
      category: 'prototype',
      categoryLabel: 'Prototyping & Fabrication',
      model: 'Inverter Pulse TIG / MIG Welding Rig',
      image: '/images/gallery/shelby-cobra-427-making.jpg',
      specs: 'Seamless CDS Steel Tubing · 250A Pulse TIG · Precision Rotary Tube Notcher',
      description: 'Fabricates road-testable spaceframe chassis, functional suspension wishbones, and structural subframes for running vehicles.',
      utility: 'Brought to life the custom JAWA 42 build, the BSA Bobber showpiece, and the 1:1 Shelby Cobra capstone prototype.'
    },
    {
      id: 'eq-frp',
      name: 'Composite FRP Tooling, Moulding & Vacuum Bagging Station',
      category: 'prototype',
      categoryLabel: 'Prototyping & Fabrication',
      model: 'Composite Layup & Vacuum Infusion Bench',
      image: '/images/gallery/studio-13.jpg',
      specs: 'Multi-Piece Negative Mould Patterns · Epoxy & Vinylester Systems · Vacuum Consolidation',
      description: 'Manufactures lightweight, structural fiber-reinforced polymer bodywork from hand-finished clay master patterns.',
      utility: 'Produces exhibition-grade composite body panels, air dams, and aerodynamic cowls for Auto Expo premiere displays.'
    },
    {
      id: 'eq-lighting',
      name: 'Directional Longitudinal Fluorescent & LED Inspection Tunnel',
      category: 'clay',
      categoryLabel: 'Clay Modelling & Surfacing',
      model: 'Continuous Highlight Reflection Array',
      image: '/images/gallery/full-scale-clay-coupe-studio.jpg',
      specs: '5000K Daylight Balanced · High CRI 95+ · Parallel Longitudinal Tube Mounting',
      description: 'Casts continuous parallel light bars across compound surfaces to detect minute surface flat spots or highlight kinks.',
      utility: 'Essential inspection rig for validating Class-A surface continuity before client and executive reviews.'
    },
    {
      id: 'eq-dynoc',
      name: 'High-Gloss Metallic Dynoc Film Surface Freeze Rig',
      category: 'clay',
      categoryLabel: 'Clay Modelling & Surfacing',
      model: 'Automotive Dynoc Foil Wrapping Rig',
      image: '/images/gallery/clay-bike-full-tape-blueprint.jpg',
      specs: 'Silver Chrome & High-Gloss Wrap Films · Heat-Tension Tools · Magnetic Applicators',
      description: 'Applies stretchable metallic foil over finished styling clay to simulate painted metal and chrome trim.',
      utility: 'Transforms matte brown styling clay into photorealistic showroom finish for OEM executive board sign-offs.'
    },
    {
      id: 'eq-cad',
      name: 'Class-A Alias AutoStudio & KeyShot CGI Workstations',
      category: 'cad',
      categoryLabel: 'Digital CAD & Lab',
      model: 'Dual Calibrated 4K Workstations',
      image: '/media/who-we-are.jpg',
      specs: 'Autodesk Alias AutoStudio · KeyShot Pro GPU Engine · Blender Sub-D · Rhino 3D',
      description: 'Processes reverse-engineered laser scans into G2 and G3 continuous NURBS math surfaces ready for OEM tooling and CNC milling.',
      utility: 'Engineers watertight Class-A CAD models ready for 5-axis CNC router gantry milling and production tooling.'
    }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.fragment.subscribe((frag) => {
        if (frag) {
          setTimeout(() => {
            const el = document.getElementById(frag);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      });
    }
  }

  setCategory(cat: 'all' | 'clay' | 'scanning' | 'prototype' | 'cad'): void {
    this.selectedCategory.set(cat);
  }

  filteredEquipment(): StudioEquipment[] {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.allEquipment;
    return this.allEquipment.filter((e) => e.category === cat);
  }
}
