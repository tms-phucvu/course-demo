export interface Lesson {
  id: string;
  title: string;
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
  totalDuration: number;

  lessons: Lesson[];

  courseId: string;
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
