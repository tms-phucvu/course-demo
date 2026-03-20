import { sectionSchema } from "@/features/course-management/schemas/section.schema";
import * as z from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Please enter course title"),
  description: z.string().min(5, "Please enter course description more"),
  language: z.string().min(1, "Please enter course language"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.string(),
  requirements: z.array(
    z.object({
      value: z.string().min(1),
    })
  ),
  learningOutcomes: z.array(
    z.object({
      value: z.string().min(1),
    })
  ),
  sections: z.array(sectionSchema).min(1, "Please add at least one section"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
