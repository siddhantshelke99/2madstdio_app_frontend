import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api.model';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'staff';
  isActive: boolean;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly tokenKey = 'nomads_admin_token';
  private readonly userKey = 'nomads_admin_user';

  currentUser = signal<AdminUser | null>(null);
  token = signal<string | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!this.isBrowser) return;

    try {
      const storedToken = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.userKey);

      if (storedToken && storedUser) {
        this.token.set(storedToken);
        this.currentUser.set(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Could not read admin credentials from localStorage:', e);
      this.clearStorage();
    }
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setSession(res.data.token, res.data.admin);
          }
        })
      );
  }

  private setSession(token: string, admin: AdminUser): void {
    this.token.set(token);
    this.currentUser.set(admin);

    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(admin));
    }
  }

  logout(): void {
    this.clearStorage();
    this.router.navigate(['/admin/login']);
  }

  private clearStorage(): void {
    this.token.set(null);
    this.currentUser.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return this.token() || localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
