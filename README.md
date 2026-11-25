# 2NOMADS Design Studio & Academy — Web Client (Frontend)

Modern, responsive web application for **2NOMADS Transportation Design Studio & Academy** (Pune, India). Built with **Angular 22** using standalone components architecture and **Tailwind CSS v4**.

---

## 🏎️ Overview & Brand Aesthetic

Preserving and elevating the authentic craft ethos of 2NOMADS:
- **Dark Industrial Studio Aesthetic:** Deep tactical backgrounds (`#070708`, `#0e0f12`, `#141519`), contrasting borders (`#23252d`), and high-energy vermilion orange accents (`#ff4d1c`).
- **Typography:** `Space Grotesk` (expressive, precision geometric headlines), `Plus Jakarta Sans` (ultra-clean body readability), and `JetBrains Mono` (technical badges & data tables).
- **Responsive & Mobile-First:** Fluid layouts, collapsible navigation drawer on mobile, soft card elevation, and smooth transitions.

---

## 🧭 Pages & Routing

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Studio + Academy hero, dual pillar cards, Season 01 spotlight, partner OEM roll, testimonials, and dual CTAs. |
| `/studio` | **Design Studio** | OEM services breakdown (Clay Modeling, Show & Running Prototypes, 3D Laser Scanning) + Filterable portfolio gallery. |
| `/academy` | **Academy & Courses** | Dynamically fetched courses from `GET /api/v1/courses`, filterable by mode (`offline`, `hybrid`, `online`), interactive syllabus modal. |
| `/register` | **Student Enrollment** | Reactive Form with validation, pre-fillable `?courseId=`, "Same as phone" WhatsApp toggle, loading state, error alert, and confirmation card. |
| `/contact` | **Contact & Inquiries** | Connected to `POST /api/v1/inquiries`, dual inquiry selector (`studio_project` vs `academy_general`), studio location details. |

---

## 🧩 Key Components & Services

1. **`NavbarComponent` (`src/app/components/navbar`):**
   - Glassmorphic fixed navigation bar with active route indicators.
   - Responsive mobile hamburger menu drawer with smooth toggle.
   - Quick action CTA "Enroll — Season 01".

2. **`FooterComponent` (`src/app/components/footer`):**
   - Brand overview, studio services list, academy links, studio hours, and physical address in Bhosari, Pune.
   - Subtle lock-icon link to `/admin/login` for studio administrators.

3. **`WhatsappBtnComponent` (`src/app/components/whatsapp-btn`):**
   - Floating quick-chat button anchored to bottom-right with hover tooltip and animated ping pulse.
   - Directs to `https://wa.me/919158228037?text=...` configured via `environment.ts`.

4. **`ApiService` (`src/app/services/api.service.ts`):**
   - Clean shared HTTP client handling all API communication with the Express backend.
   - Methods: `getCourses()`, `getCourseById()`, `getCourseBySlug()`, `registerStudent()`, `submitInquiry()`, `getHealth()`.
   - SSR-safe execution with `isPlatformBrowser` checks.

---

## ⚙️ Environment Configuration

* **Development:** `src/environments/environment.ts`
* **Production:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5050/api/v1',
  whatsappNumber: '919158228037',
  whatsappDefaultMessage: 'Hello 2NOMADS! I am interested in learning more about your Transportation Design Studio & Academy.',
  studioEmail: 'donnykoren@gmail.com',
  studioPhone: '+91 91582 28037',
  studioAddress: 'MSEI, Plot No. T-153/1 Bhosari, Pune 411026, Maharashtra, India',
};
```

---

## 🚀 Running the Frontend

Navigate to `/frontend`:

```bash
cd /Users/apple/Projects/2nomads_app/frontend
```

### Development Server
```bash
npm start
# or: npx ng serve
```
Navigate to `http://localhost:4200/`.

### Production Build
```bash
npm run build
# or: npx ng build
```
Generates production distribution bundles in `/frontend/dist/2nomads`.
