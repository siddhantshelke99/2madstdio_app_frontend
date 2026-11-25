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
    <div class="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      <!-- Top Action Ribbon -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2029]">
        <div>
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#ff4d1c]">
            Curriculum Management
          </span>
          <h1 class="font-['Space_Grotesk'] text-3xl font-extrabold text-white mt-1">
            Academy Courses
          </h1>
        </div>

        <button
          (click)="openAddModal()"
          class="px-5 py-2.5 rounded-lg bg-[#ff4d1c] hover:bg-[#ff6538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2">
          <span>+ Create New Course</span>
        </button>
      </div>

      <!-- Toast Feedback -->
      @if (toastMessage()) {
        <div class="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <span>{{ toastMessage() }}</span>
          <button (click)="toastMessage.set(null)" class="text-emerald-400 hover:text-white">✕</button>
        </div>
      }

      <!-- COURSES LIST TABLE -->
      <div class="rounded-xl bg-[#0c0d10] border border-[#1e2029] overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121318] border-b border-[#1e2029] text-[#717380] font-mono uppercase tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Title &amp; Slug</th>
                <th class="py-3.5 px-4">Mode</th>
                <th class="py-3.5 px-4">Duration</th>
                <th class="py-3.5 px-4">Tuition Fee</th>
                <th class="py-3.5 px-4">Modules</th>
                <th class="py-3.5 px-4">Visibility</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#181920] text-[#c2c4cf]">
              @for (course of courses(); track course.id) {
                <tr class="hover:bg-[#121319] transition-colors">
                  
                  <!-- Title & Slug -->
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-white text-sm">{{ course.title }}</div>
                    <div class="font-mono text-[10px] text-[#ff4d1c]">{{ course.slug }}</div>
                  </td>

                  <!-- Mode Badge -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#171821] border border-[#272938] text-white">
                      {{ course.mode }}
                    </span>
                  </td>

                  <!-- Duration -->
                  <td class="py-3.5 px-4 font-mono text-white whitespace-nowrap">
                    {{ course.duration }}
                  </td>

                  <!-- Fee -->
                  <td class="py-3.5 px-4 font-mono text-white whitespace-nowrap">
                    ₹{{ course.fee | number }}
                  </td>

                  <!-- Syllabus Count -->
                  <td class="py-3.5 px-4 font-mono text-[#8a8c99] whitespace-nowrap">
                    {{ course.syllabus?.length || 0 }} Units
                  </td>

                  <!-- Published Status Toggle -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <button
                      (click)="togglePublish(course)"
                      [class.bg-emerald-950]="course.isPublished"
                      [class.text-emerald-400]="course.isPublished"
                      [class.border-emerald-500/30]="course.isPublished"
                      [class.bg-zinc-900]="!course.isPublished"
                      [class.text-zinc-500]="!course.isPublished"
                      [class.border-zinc-700]="!course.isPublished"
                      class="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border transition-colors">
                      {{ course.isPublished ? 'Published' : 'Draft' }}
                    </button>
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      (click)="openEditModal(course)"
                      class="px-3 py-1 rounded bg-[#171820] hover:bg-[#20222c] border border-[#2a2c3a] text-white text-[11px] font-mono transition-colors">
                      Edit
                    </button>
                    <button
                      (click)="deleteCourse(course)"
                      class="px-3 py-1 rounded bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 text-[11px] font-mono transition-colors">
                      Delete
                    </button>
                  </td>

                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-12 text-center text-[#676974] italic">
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
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111216] border border-[#262835] shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div class="flex items-center justify-between pb-4 border-b border-[#20222d]">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-[#ff4d1c]">
                  {{ isEditing() ? 'Update Program' : 'New Program' }}
                </span>
                <h3 class="font-['Space_Grotesk'] text-xl font-bold text-white">
                  {{ isEditing() ? 'Edit Academy Course' : 'Create Academy Course' }}
                </h3>
              </div>
              <button
                (click)="closeModal()"
                class="p-2 rounded-lg text-[#8e909a] hover:text-white hover:bg-[#1a1b24] transition-colors">
                ✕
              </button>
            </div>

            <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="space-y-4 text-xs">
              
              <!-- Title & Slug -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-mono uppercase text-[#a0a2ad] mb-1">Course Title *</label>
                  <input
                    type="text"
                    formControlName="title"
                    (input)="onTitleInput()"
                    placeholder="e.g. Advanced Clay Surfacing"
                    class="w-full px-3.5 py-2.5 rounded-lg bg-[#181921] border border-[#2b2d3c] text-white text-xs focus:outline-none focus:border-[#ff4d1c]" />
                </div>
                <div>
                  <label class="block font-mono uppercase text-[#a0a2ad] mb-1">URL Slug *</label>
                  <input
                    type="text"
                    formControlName="slug"
                    placeholder="e.g. advanced-clay-surfacing"
                    class="w-full px-3.5 py-2.5 rounded-lg bg-[#181921] border border-[#2b2d3c] text-white text-xs font-mono focus:outline-none focus:border-[#ff4d1c]" />
                </div>
              </div>

              <!-- Mode, Duration, Fee -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block font-mono uppercase text-[#a0a2ad] mb-1">Delivery Mode *</label>
                  <select
                    formControlName="mode"
                    class="w-full px-3.5 py-2.5 rounded-lg bg-[#181921] border border-[#2b2d3c] text-white text-xs font-mono focus:outline-none focus:border-[#ff4d1c]">
                    <option value="offline">Offline (Studio)</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <label class="block font-mono uppercase text-[#a0a2ad] mb-1">Duration *</label>
                  <input
                    type="text"
                    formControlName="duration"
                    placeholder="e.g. 10 Weeks"
                    class="w-full px-3.5 py-2.5 rounded-lg bg-[#181921] border border-[#2b2d3c] text-white text-xs focus:outline-none focus:border-[#ff4d1c]" />
                </div>
                <div>
                  <label class="block font-mono uppercase text-[#a0a2ad] mb-1">Tuition Fee (₹) *</label>
                  <input
                    type="number"
                    formControlName="fee"
                    placeholder="e.g. 65000"
                    class="w-full px-3.5 py-2.5 rounded-lg bg-[#181921] border border-[#2b2d3c] text-white text-xs font-mono focus:outline-none focus:border-[#ff4d1c]" />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block font-mono uppercase text-[#a0a2ad] mb-1">Description *</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Overview of the program, practical outcomes, and target students..."
                  class="w-full px-3.5 py-2.5 rounded-lg bg-[#181921] border border-[#2b2d3c] text-white text-xs focus:outline-none focus:border-[#ff4d1c]"></textarea>
              </div>

              <!-- Published Toggle -->
              <div class="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  formControlName="isPublished"
                  id="isPub"
                  class="rounded border-[#343744] bg-[#1a1b22] text-[#ff4d1c] focus:ring-0" />
                <label for="isPub" class="font-mono text-xs text-white cursor-pointer">
                  Publish on public academy catalog
                </label>
              </div>

              <!-- Syllabus Builder -->
              <div class="space-y-3 pt-3 border-t border-[#20222d]">
                <div class="flex items-center justify-between">
                  <span class="font-mono uppercase text-[#ff4d1c] font-bold">Curriculum Syllabus Modules</span>
                  <button
                    type="button"
                    (click)="addSyllabusItem()"
                    class="px-2.5 py-1 rounded bg-[#1a1b22] hover:bg-[#252733] border border-[#2e3040] text-[10px] font-mono text-white">
                    + Add Module
                  </button>
                </div>

                <div formArrayName="syllabus" class="space-y-2.5">
                  @for (mod of syllabusFormArray.controls; track $index) {
                    <div [formGroupName]="$index" class="p-3 rounded-lg bg-[#161720] border border-[#242633] flex items-start gap-2">
                      <div class="w-1/3">
                        <input
                          type="text"
                          formControlName="weekOrModule"
                          placeholder="Module / Week"
                          class="w-full px-2.5 py-1.5 rounded bg-[#1f202b] border border-[#2c2e3d] text-white text-[11px]" />
                      </div>
                      <div class="flex-1">
                        <input
                          type="text"
                          formControlName="topic"
                          placeholder="Module Topic Title"
                          class="w-full px-2.5 py-1.5 rounded bg-[#1f202b] border border-[#2c2e3d] text-white text-[11px]" />
                      </div>
                      <button
                        type="button"
                        (click)="removeSyllabusItem($index)"
                        class="p-1.5 text-[#6c6e7b] hover:text-red-400">
                        ✕
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="pt-4 border-t border-[#20222d] flex justify-end gap-3">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 rounded text-xs font-mono text-[#8e909a] hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="courseForm.invalid || isSaving()"
                  class="px-5 py-2.5 rounded bg-[#ff4d1c] hover:bg-[#ff6538] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md">
                  {{ isSaving() ? 'Saving...' : 'Save Course' }}
                </button>
              </div>

            </form>

          </div>
        </div>
      }

    </div>
  `,
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
      const titleVal = this.courseForm.get('title')?.value || '';
      const slug = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      this.courseForm.patchValue({ slug });
    }
  }

  addSyllabusItem(weekOrModule = '', topic = ''): void {
    this.syllabusFormArray.push(
      this.fb.group({
        weekOrModule: [weekOrModule, Validators.required],
        topic: [topic, Validators.required],
      })
    );
  }

  removeSyllabusItem(index: number): void {
    this.syllabusFormArray.removeAt(index);
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.currentEditingId = null;
    this.courseForm.reset({
      mode: 'offline',
      fee: 50000,
      duration: '8 Weeks',
      isPublished: true,
    });
    this.syllabusFormArray.clear();
    this.addSyllabusItem('Module 01', 'Foundations & Tooling');
    this.isModalOpen.set(true);
  }

  openEditModal(course: Course): void {
    this.isEditing.set(true);
    this.currentEditingId = course.id;
    this.courseForm.patchValue({
      title: course.title,
      slug: course.slug,
      description: course.description,
      duration: course.duration,
      fee: course.fee,
      mode: course.mode,
      isPublished: course.isPublished,
    });
    this.syllabusFormArray.clear();
    if (course.syllabus && Array.isArray(course.syllabus)) {
      course.syllabus.forEach((item) => {
        this.addSyllabusItem(item.weekOrModule, item.topic);
      });
    }
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    this.isSaving.set(true);
    const formVal = this.courseForm.value;

    if (this.isEditing() && this.currentEditingId) {
      this.adminApi.updateCourse(this.currentEditingId, formVal).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.closeModal();
          this.showToast(`Updated course: ${res.data?.title}`);
          this.loadCourses();
        },
        error: (err) => {
          this.isSaving.set(false);
          alert(err.error?.message || 'Update failed');
        },
      });
    } else {
      this.adminApi.createCourse(formVal).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          this.closeModal();
          this.showToast(`Created course: ${res.data?.title}`);
          this.loadCourses();
        },
        error: (err) => {
          this.isSaving.set(false);
          alert(err.error?.message || 'Creation failed');
        },
      });
    }
  }

  togglePublish(course: Course): void {
    const updatedStatus = !course.isPublished;
    this.adminApi.updateCourse(course.id, { isPublished: updatedStatus }).subscribe({
      next: () => {
        course.isPublished = updatedStatus;
        this.showToast(`Course "${course.title}" is now ${updatedStatus ? 'Published' : 'Draft'}`);
      },
    });
  }

  deleteCourse(course: Course): void {
    if (confirm(`Are you sure you want to delete course "${course.title}"?`)) {
      this.adminApi.deleteCourse(course.id).subscribe({
        next: () => {
          this.showToast(`Deleted course: ${course.title}`);
          this.loadCourses();
        },
        error: (err) => alert(err.error?.message || 'Delete failed'),
      });
    }
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 4000);
  }
}
