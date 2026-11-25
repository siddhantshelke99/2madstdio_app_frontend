import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { Course, CourseMode } from '../../../models/course.model';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-wrap">
      
      <!-- Top Action Ribbon -->
      <div class="page-top-bar">
        <div>
          <span class="kicker-pill">Curriculum Management</span>
          <h1 class="page-title">Academy Courses</h1>
          <p class="page-sub">Manage masterclasses, tuition pricing, syllabus modules, and public publication status.</p>
        </div>

        <button
          (click)="openAddModal()"
          class="btn-primary">
          <span>+ Create New Course</span>
        </button>
      </div>

      <!-- Toast Feedback -->
      @if (toastMessage()) {
        <div class="toast-alert">
          <span>{{ toastMessage() }}</span>
          <button (click)="toastMessage.set(null)" class="toast-close">✕</button>
        </div>
      }

      <!-- COURSES LIST TABLE -->
      <div class="table-container">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title &amp; Slug</th>
                <th>Mode</th>
                <th>Duration</th>
                <th>Tuition Fee</th>
                <th>Modules</th>
                <th>Visibility</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (course of courses(); track course.id) {
                <tr class="table-row">
                  
                  <!-- Title & Slug -->
                  <td>
                    <div class="course-name">{{ course.title }}</div>
                    <div class="course-slug">{{ course.slug }}</div>
                  </td>

                  <!-- Mode Badge -->
                  <td>
                    <span class="mode-badge">
                      {{ course.mode }}
                    </span>
                  </td>

                  <!-- Duration -->
                  <td class="font-mono text-white">
                    {{ course.duration }}
                  </td>

                  <!-- Fee -->
                  <td class="font-mono text-white font-bold">
                    ₹{{ course.fee | number }}
                  </td>

                  <!-- Syllabus Count -->
                  <td class="text-[#8e909a]">
                    {{ course.syllabus?.length || 0 }} Units
                  </td>

                  <!-- Published Status Toggle -->
                  <td>
                    <button
                      (click)="togglePublish(course)"
                      [class.badge-emerald]="course.isPublished"
                      [class.badge-zinc]="!course.isPublished"
                      class="status-toggle-btn">
                      {{ course.isPublished ? '● Published' : '○ Draft' }}
                    </button>
                  </td>

                  <!-- Actions -->
                  <td class="actions-cell">
                    <button
                      (click)="openEditModal(course)"
                      class="btn-action">
                      Edit
                    </button>
                    <button
                      (click)="deleteCourse(course)"
                      class="btn-action btn-delete">
                      Delete
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty-table-cell">
                    No courses found in database.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- CREATE / EDIT COURSE MODAL -->
      @if (isModalOpen()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-card max-w-2xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            
            <div class="modal-top">
              <div>
                <span class="kicker-pill">
                  {{ isEditing() ? 'Update Program' : 'New Program' }}
                </span>
                <h3 class="modal-title">
                  {{ isEditing() ? 'Edit Academy Course' : 'Create Academy Course' }}
                </h3>
              </div>
              <button (click)="closeModal()" class="btn-close">✕</button>
            </div>

            <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="space-y-4">
              
              <!-- Title & Slug -->
              <div class="grid-2-cols">
                <div>
                  <label class="field-label">Course Title *</label>
                  <input
                    type="text"
                    formControlName="title"
                    (input)="onTitleInput()"
                    placeholder="e.g. Advanced Clay Surfacing"
                    class="form-input" />
                </div>
                <div>
                  <label class="field-label">URL Slug *</label>
                  <input
                    type="text"
                    formControlName="slug"
                    placeholder="e.g. advanced-clay-surfacing"
                    class="form-input font-mono" />
                </div>
              </div>

              <!-- Mode, Duration, Fee -->
              <div class="grid-3-cols">
                <div>
                  <label class="field-label">Delivery Mode *</label>
                  <select formControlName="mode" class="form-input">
                    <option value="offline">Offline (Studio)</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <label class="field-label">Duration *</label>
                  <input
                    type="text"
                    formControlName="duration"
                    placeholder="e.g. 10 Weeks"
                    class="form-input" />
                </div>
                <div>
                  <label class="field-label">Tuition Fee (₹) *</label>
                  <input
                    type="number"
                    formControlName="fee"
                    placeholder="e.g. 65000"
                    class="form-input" />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="field-label">Description *</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Overview of the program, practical outcomes, and target students..."
                  class="form-input"></textarea>
              </div>

              <!-- Published Toggle -->
              <div class="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  formControlName="isPublished"
                  id="isPub"
                  class="rounded bg-[#1a1b22] text-[#ff4d1c] focus:ring-0" />
                <label for="isPub" class="text-xs text-white cursor-pointer font-medium">
                  Publish on public academy website catalog
                </label>
              </div>

              <!-- Syllabus Builder -->
              <div class="pt-4 border-t border-[#1e2029]">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-xs font-bold uppercase text-[#ff4d1c]">Curriculum Syllabus Modules</span>
                  <button
                    type="button"
                    (click)="addSyllabusItem()"
                    class="btn-secondary text-[11px] py-1 px-3">
                    + Add Module
                  </button>
                </div>

                <div formArrayName="syllabus" class="space-y-2">
                  @for (mod of syllabusFormArray.controls; track $index) {
                    <div [formGroupName]="$index" class="syllabus-row">
                      <input
                        type="text"
                        formControlName="weekOrModule"
                        placeholder="e.g. Module 01"
                        class="form-input w-1/3 text-xs" />
                      <input
                        type="text"
                        formControlName="topic"
                        placeholder="Module Topic Title"
                        class="form-input flex-1 text-xs" />
                      <button
                        type="button"
                        (click)="removeSyllabusItem($index)"
                        class="p-2 text-[#6c6e7b] hover:text-red-400">
                        ✕
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="modal-actions gap-2">
                <button type="button" (click)="closeModal()" class="btn-secondary">Cancel</button>
                <button type="submit" [disabled]="courseForm.invalid || isSaving()" class="btn-primary">
                  {{ isSaving() ? 'Saving...' : 'Save Course' }}
                </button>
              </div>

            </form>

          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .page-wrap {
      padding: 32px;
      max-width: 1440px;
      margin: 0 auto;
      font-family: 'Neurial Grotesk', -apple-system, sans-serif;
      color: #f5f5f7;
    }

    .page-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      padding-bottom: 24px;
      margin-bottom: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }
    .kicker-pill {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #ff4d1c;
      display: inline-block;
      margin-bottom: 6px;
    }
    .page-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin: 0 0 6px;
      line-height: 1.2;
    }
    .page-sub {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    .btn-primary {
      background: #ff4d1c;
      color: #ffffff;
      border: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(255, 77, 28, 0.35);
      transition: all 0.2s;
    }
    .btn-primary:hover:not(:disabled) {
      background: #ff6538;
      transform: translateY(-1px);
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-secondary {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary:hover { background: #1d1f27; color: #ffffff; }

    /* TABLE */
    .table-container {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    .data-table thead {
      background: #121318;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .data-table th {
      padding: 14px 16px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
    }
    .data-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      vertical-align: middle;
    }
    .table-row:hover { background: rgba(255, 255, 255, 0.02); }

    .course-name { font-weight: 700; color: #ffffff; }
    .course-slug { font-size: 10px; color: #ff4d1c; font-family: 'JetBrains Mono', monospace; }
    .mode-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      background: #181920;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      color: #ffffff;
    }

    .status-toggle-btn {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .badge-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }
    .badge-zinc { background: rgba(113, 113, 122, 0.15); color: #a1a1aa; border-color: rgba(113, 113, 122, 0.3); }

    .actions-cell { text-align: right; white-space: nowrap; }
    .btn-action {
      background: #14151a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      margin-left: 6px;
    }
    .btn-action:hover { background: #20222c; border-color: rgba(255, 255, 255, 0.25); }
    .btn-delete { color: #f87171; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08); }
    .btn-delete:hover { background: rgba(239, 68, 68, 0.2); }

    .empty-table-cell { padding: 40px; text-align: center; color: rgba(255, 255, 255, 0.4); font-style: italic; }

    .toast-alert {
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .toast-close { background: none; border: none; color: #34d399; cursor: pointer; }

    /* MODAL */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card {
      background: #111216;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }
    .modal-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .modal-title { font-size: 18px; font-weight: 700; color: #ffffff; margin: 4px 0 0; }
    .btn-close { background: none; border: none; color: rgba(255, 255, 255, 0.6); font-size: 16px; cursor: pointer; padding: 4px; }
    .btn-close:hover { color: #ffffff; }

    .grid-2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .grid-3-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .field-label { display: block; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.65); margin-bottom: 4px; }
    .form-input {
      width: 100%;
      background: #15161c;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 13px;
      color: #ffffff;
      outline: none;
      box-sizing: border-box;
    }
    .form-input:focus { border-color: #ff4d1c; }

    .syllabus-row {
      display: flex;
      gap: 8px;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
      padding: 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .modal-actions {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .grid-2-cols, .grid-3-cols { grid-template-columns: 1fr; }
      .page-wrap { padding: 20px 16px; }
    }
  `],
})
export class CoursesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);

  courses = signal<Course[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  isModalOpen = signal(false);
  isEditing = signal(false);
  currentEditingId: string | null = null;
  toastMessage = signal<string | null>(null);

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    duration: ['', Validators.required],
    fee: [0, [Validators.required, Validators.min(0)]],
    mode: ['offline' as CourseMode, Validators.required],
    isPublished: [true],
    syllabus: this.fb.array([]),
  });

  get syllabusFormArray(): FormArray {
    return this.courseForm.get('syllabus') as FormArray;
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.adminApi.getCourses().subscribe({
      next: (res) => {
        if (res.data) this.courses.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        this.isLoading.set(false);
      },
    });
  }

  onTitleInput(): void {
    if (!this.isEditing()) {
      const val = this.courseForm.get('title')?.value || '';
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.courseForm.patchValue({ slug });
    }
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.currentEditingId = null;
    this.courseForm.reset({
      mode: 'offline',
      isPublished: true,
      fee: 65000,
      duration: '8 Weeks',
    });
    this.syllabusFormArray.clear();
    this.isModalOpen.set(true);
  }

  openEditModal(c: Course): void {
    this.isEditing.set(true);
    this.currentEditingId = c.id;
    this.courseForm.patchValue({
      title: c.title,
      slug: c.slug,
      description: c.description,
      duration: c.duration,
      fee: c.fee,
      mode: c.mode,
      isPublished: c.isPublished,
    });

    this.syllabusFormArray.clear();
    if (c.syllabus && c.syllabus.length > 0) {
      c.syllabus.forEach((s) => {
        this.syllabusFormArray.push(
          this.fb.group({
            weekOrModule: [s.weekOrModule, Validators.required],
            topic: [s.topic, Validators.required],
          })
        );
      });
    }
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  addSyllabusItem(): void {
    this.syllabusFormArray.push(
      this.fb.group({
        weekOrModule: ['Module ' + (this.syllabusFormArray.length + 1), Validators.required],
        topic: ['', Validators.required],
      })
    );
  }

  removeSyllabusItem(index: number): void {
    this.syllabusFormArray.removeAt(index);
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    this.isSaving.set(true);
    const formVal = this.courseForm.value;

    if (this.isEditing() && this.currentEditingId) {
      this.adminApi.updateCourse(this.currentEditingId, formVal).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res.success && res.data) {
            this.showToast(`Updated course "${res.data.title}" successfully`);
            this.loadCourses();
            this.closeModal();
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Failed to update course:', err);
        },
      });
    } else {
      this.adminApi.createCourse(formVal).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res.success && res.data) {
            this.showToast(`Created new course "${res.data.title}" successfully`);
            this.loadCourses();
            this.closeModal();
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Failed to create course:', err);
        },
      });
    }
  }

  togglePublish(course: Course): void {
    const newStatus = !course.isPublished;
    this.adminApi.updateCourse(course.id, { isPublished: newStatus }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          course.isPublished = res.data.isPublished;
          this.showToast(
            `Course "${course.title}" is now ${course.isPublished ? 'PUBLISHED' : 'DRAFT'}`
          );
        }
      },
      error: (err) => console.error('Failed to toggle publish status:', err),
    });
  }

  deleteCourse(course: Course): void {
    if (!confirm(`Are you sure you want to permanently delete "${course.title}"?`)) return;

    this.adminApi.deleteCourse(course.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast(`Course "${course.title}" deleted.`);
          this.courses.update((list) => list.filter((c) => c.id !== course.id));
        }
      },
      error: (err) => console.error('Failed to delete course:', err),
    });
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
