import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";
import {
  CourseDetails,
  CreateCoursePayload,
  UpdateCoursePayload,
} from "@/features/course-management/types/course.types";
import { slugify } from "@/features/course-management/utils/course-management.utils";

export const transformCoursePayload = (
  data: CourseFormValues
): CreateCoursePayload | UpdateCoursePayload => {
  return {
    ...data,
    slug: slugify(data.title),
    price: 100000,
    isPublished: true,

    tags: data.tags.split(",").map((tag) => tag.trim()),
    requirements: data.requirements.map((r) => r.value),
    learningOutcomes: data.learningOutcomes.map((l) => l.value),

    sections: data.sections.map((section, sectionIndex) => ({
      ...section,
      order: sectionIndex + 1,
      lessons: section.lessons.map(({ videoId, ...lesson }, lessonIndex) => ({
        ...lesson,
        videoUrl: videoId,
        order: lessonIndex + 1,
      })),
    })),
  };
};

export const transformCourseToForm = (
  course: CourseDetails
): CourseFormValues => {
  return {
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    language: course.language,
    level: course.level,
    tags: course.tags.join(", "),

    requirements: course.requirements.map((r) => ({
      value: r,
    })),

    learningOutcomes: course.learningOutcomes.map((l) => ({
      value: l,
    })),

    sections: course.sections.map((section) => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        videoId: lesson.videoUrl,
      })),
    })),
  };
};
