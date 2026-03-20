import { lessonSchema } from "@/features/course-management/schemas/lesson.schemas";
import * as z from "zod";

export const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Section title is required"),
  lessons: z
    .array(lessonSchema)
    .min(1, "Each section must have at least one lesson"),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
