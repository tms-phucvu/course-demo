// BASE TYPE
export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  totalLessons: number;
  totalDurationSeconds: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  level: CourseLevel;
  language: string;
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  durationMinutes: number;
  totalSections: number;
  totalLessons: number;
  totalDurationSeconds: number;
  totalDuration?: number;
  sections: Section[];
}

// LIST
export interface CourseFilters {
  page: number;
  limit: number;
  title?: string;
}

export type CourseResponse = Omit<Course, "sections">;

export interface CourseListResponse {
  items: CourseResponse[];
  total: number;
  page: number;
  limit: number;
}

// COURSE DETAILS
export type CourseDetails = Course;

// CREATE
export type CreateLessonPayload = Omit<Lesson, "id">;

export type CreateSectionPayload = Omit<
  Section,
  "id" | "totalLessons" | "totalDurationSeconds" | "lessons"
> & {
  lessons: CreateLessonPayload[];
};

export type CreateCoursePayload = Omit<
  Course,
  | "id"
  | "publishedAt"
  | "createdAt"
  | "durationMinutes"
  | "totalSections"
  | "totalLessons"
  | "totalDurationSeconds"
  | "sections"
> & {
  sections: CreateSectionPayload[];
};

// UPDATE
export type UpdateLessonPayload = CreateLessonPayload;

export type UpdateSectionPayload = CreateSectionPayload;

export type UpdateCoursePayload = CreateCoursePayload;
