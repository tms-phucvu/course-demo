import { Course } from "@/features/course/types/course.types";

export const MOCK_COURSES: Course[] = [
  {
    id: "course-react-01",
    title: "React for Beginners",
    description:
      "Learn the fundamentals of React including components, props, state, and hooks to build modern web applications.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    author: "John Doe",

    totalLessons: 24,
    totalSections: 6,
    totalDuration: 7200, // seconds (2 hours)

    createdAt: 1709251200000,
  },
  {
    id: "course-nextjs-01",
    title: "Next.js Full Course",
    description:
      "Build production-ready fullstack applications with Next.js, Server Components, routing, and API integration.",
    thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3",
    author: "Jane Smith",

    totalLessons: 32,
    totalSections: 8,
    totalDuration: 10800, // 3 hours

    createdAt: 1709337600000,
  },
  {
    id: "course-typescript-01",
    title: "TypeScript Complete Guide",
    description:
      "Master TypeScript from basics to advanced types to write scalable and maintainable JavaScript applications.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    author: "Michael Lee",

    totalLessons: 28,
    totalSections: 7,
    totalDuration: 9600, // 2h40m

    createdAt: 1709424000000,
  },
  {
    id: "course-nodejs-01",
    title: "Node.js Backend Development",
    description:
      "Learn how to build REST APIs with Node.js, Express, authentication, and database integration.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    author: "David Kim",

    totalLessons: 30,
    totalSections: 7,
    totalDuration: 10200,

    createdAt: 1709510400000,
  },
];
