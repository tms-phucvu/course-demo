export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;

  totalLessons: number;
  totalSections: number;
  totalDuration: number;

  createdAt: number;
}
