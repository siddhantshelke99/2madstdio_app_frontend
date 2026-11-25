import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentsComponent } from './pages/students/students.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { InquiriesComponent } from './pages/inquiries/inquiries.component';
import { LogsComponent } from './pages/logs/logs.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Admin Portal Login | 2NOMADS',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Admin Dashboard | 2NOMADS',
      },
      {
        path: 'students',
        component: StudentsComponent,
        title: 'Student Admissions | 2NOMADS Admin',
      },
      {
        path: 'courses',
        component: CoursesComponent,
        title: 'Course Management | 2NOMADS Admin',
      },
      {
        path: 'inquiries',
        component: InquiriesComponent,
        title: 'Client Inquiries | 2NOMADS Admin',
      },
      {
        path: 'logs',
        component: LogsComponent,
        title: 'Communication Audit Logs | 2NOMADS Admin',
      },
    ],
  },
];
