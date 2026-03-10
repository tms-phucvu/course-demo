export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoId: string;

  order: number;
  duration: number;

  courseId: string;
  sectionId: string;
}

export interface Section {
  id: string;
  title: string;
  order: number;

  totalLessons: number;
  courseId: string;

  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;

  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];

  totalLessons: number;
  totalSections: number;
  totalDuration: number;

  createdAt: number;

  sections: Section[];
}
