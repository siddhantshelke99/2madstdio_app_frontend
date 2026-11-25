import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api.model';
import { Course } from '../../models/course.model';

export interface DashboardStats {
  courses: {
    total: number;
    published: number;
  };
  students: {
    total: number;
    byStatus: {
      new: number;
      contacted: number;
      enrolled: number;
      dropped: number;
    };
    totalEnrolledRevenue: number;
  };
  inquiries: {
    total: number;
    byStatus: {
      open: number;
      resolved: number;
    };
    byType: {
      studio_project: number;
      academy_general: number;
    };
  };
  recentStudents: StudentRecord[];
  recentInquiries: InquiryRecord[];
}

export type StudentStatus = 'new' | 'contacted' | 'enrolled' | 'dropped';

export interface StudentRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string | null;
  courseId: string;
  status: StudentStatus;
  notes?: string | null;
  registeredAt: string;
  course?: {
    id: string;
    title: string;
    slug: string;
    fee: number;
    duration: string;
    mode: string;
  };
}

export type InquiryStatus = 'open' | 'resolved';
export type InquiryType = 'studio_project' | 'academy_general';

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: InquiryType;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface CommunicationLogRecord {
  id: string;
  recipientType: 'student' | 'inquiry';
  recipientId: string;
  channel: 'email' | 'whatsapp';
  templateName: string;
  payload: Record<string, any>;
  status: 'sent' | 'failed';
  errorMessage?: string | null;
  sentAt: string;
}

export interface SendMessagePayload {
  recipientType: 'student' | 'inquiry';
  recipientId: string;
  channel: 'email' | 'whatsapp';
  subject?: string;
  message: string;
  templateName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Get KPI metrics & overview stats
   */
  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.baseUrl}/dashboard/stats`);
  }

  // --- Students Management ---

  getStudents(filters?: {
    status?: string;
    courseId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<StudentRecord[]>> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.courseId) params = params.set('courseId', filters.courseId);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ApiResponse<StudentRecord[]>>(`${this.baseUrl}/admin/students`, { params });
  }

  updateStudentStatus(
    id: string,
    status: StudentStatus,
    notes?: string | null
  ): Observable<ApiResponse<StudentRecord>> {
    return this.http.patch<ApiResponse<StudentRecord>>(
      `${this.baseUrl}/admin/students/${id}/status`,
      { status, notes }
    );
  }

  // --- Courses CRUD ---

  getCourses(filters?: {
    isPublished?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<Course[]>> {
    let params = new HttpParams();
    if (filters?.isPublished !== undefined)
      params = params.set('isPublished', filters.isPublished.toString());
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ApiResponse<Course[]>>(`${this.baseUrl}/admin/courses`, { params });
  }

  createCourse(courseData: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(`${this.baseUrl}/admin/courses`, courseData);
  }

  updateCourse(id: string, courseData: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(`${this.baseUrl}/admin/courses/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/courses/${id}`);
  }

  // --- Inquiries Management ---

  getInquiries(filters?: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<InquiryRecord[]>> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ApiResponse<InquiryRecord[]>>(`${this.baseUrl}/admin/inquiries`, { params });
  }

  updateInquiryStatus(id: string, status: InquiryStatus): Observable<ApiResponse<InquiryRecord>> {
    return this.http.patch<ApiResponse<InquiryRecord>>(
      `${this.baseUrl}/admin/inquiries/${id}/status`,
      { status }
    );
  }

  // --- Communications ---

  sendCommunication(payload: SendMessagePayload): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/communications/send`, payload);
  }

  getCommunicationLogs(filters?: {
    recipientId?: string;
    recipientType?: string;
    channel?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<CommunicationLogRecord[]>> {
    let params = new HttpParams();
    if (filters?.recipientId) params = params.set('recipientId', filters.recipientId);
    if (filters?.recipientType) params = params.set('recipientType', filters.recipientType);
    if (filters?.channel) params = params.set('channel', filters.channel);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ApiResponse<CommunicationLogRecord[]>>(
      `${this.baseUrl}/communications/logs`,
      { params }
    );
  }

  getLogs(filters?: {
    recipientId?: string;
    recipientType?: string;
    channel?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<CommunicationLogRecord[]>> {
    return this.getCommunicationLogs(filters);
  }
}
