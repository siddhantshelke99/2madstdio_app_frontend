export type CourseMode = 'online' | 'offline' | 'hybrid';

export interface SyllabusItem {
  weekOrModule: string;
  topic: string;
  details?: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  fee: number;
  mode: CourseMode;
  syllabus: SyllabusItem[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
