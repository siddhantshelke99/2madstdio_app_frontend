import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';
import { StudentRegistrationPayload, StudentRegistrationResponse } from '../models/student.model';
import { InquiryPayload, InquiryResponse } from '../models/inquiry.model';
import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Fetch all published courses (supports optional filters like mode and search query)
   */
  getCourses(filters?: { mode?: string; search?: string }): Observable<ApiResponse<Course[]>> {
    if (!this.isBrowser) {
      return of({ success: true, data: [] });
    }

    let params = new HttpParams();
    if (filters?.mode) {
      params = params.set('mode', filters.mode);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<ApiResponse<Course[]>>(`${this.baseUrl}/courses`, { params });
  }

  /**
   * Fetch single course details by UUID
   */
  getCourseById(id: string): Observable<ApiResponse<Course>> {
    if (!this.isBrowser) {
      return of({ success: true, data: null as any });
    }
    return this.http.get<ApiResponse<Course>>(`${this.baseUrl}/courses/${id}`);
  }

  /**
   * Fetch single course details by URL slug
   */
  getCourseBySlug(slug: string): Observable<ApiResponse<Course>> {
    if (!this.isBrowser) {
      return of({ success: true, data: null as any });
    }
    return this.http.get<ApiResponse<Course>>(`${this.baseUrl}/courses/slug/${slug}`);
  }

  /**
   * Submit student course registration
   */
  registerStudent(
    payload: StudentRegistrationPayload
  ): Observable<ApiResponse<StudentRegistrationResponse>> {
    return this.http.post<ApiResponse<StudentRegistrationResponse>>(
      `${this.baseUrl}/students/register`,
      payload
    );
  }

  /**
   * Submit studio or academy contact inquiry
   */
  submitInquiry(payload: InquiryPayload): Observable<ApiResponse<InquiryResponse>> {
    return this.http.post<ApiResponse<InquiryResponse>>(`${this.baseUrl}/inquiries`, payload);
  }

  /**
   * API health status check
   */
  getHealth(): Observable<any> {
    if (!this.isBrowser) {
      return of({ status: 'healthy' });
    }
    return this.http.get<any>(`${this.baseUrl}/health`);
  }
}
