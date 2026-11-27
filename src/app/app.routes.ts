import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: '2NOMADS — Transportation Design Studio & Academy',
  },
  {
    path: 'studio',
    loadComponent: () => import('./pages/studio/studio.component').then((m) => m.StudioPageComponent),
    title: 'Studio & Services — 2NOMADS Automotive Design Studio',
  },
  {
    path: 'services',
    redirectTo: 'studio',
  },
  {
    path: 'academy',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Academy & Courses — 2NOMADS',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterPageComponent),
    title: 'Enroll — Season 01 — 2NOMADS Academy',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
    title: 'Studio Gallery & Fullscreen Archive — 2NOMADS',
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers.component').then((m) => m.CareersComponent),
    title: 'Careers & Studio Apprenticeships — 2NOMADS Transportation Design',
  },
  {
    path: 'career',
    redirectTo: 'careers',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactPageComponent),
    title: 'Contact & Inquiries — 2NOMADS',
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
