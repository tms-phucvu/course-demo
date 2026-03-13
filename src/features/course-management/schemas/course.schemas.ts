import * as z from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Please enter course title"),
  description: z.string().min(5, "Please enter course description more"),
  author: z.string().min(1, "Please enter course author"),
  level: z.string(),
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
  sections: z
    .array(
      z.object({
        title: z.string().min(1, "Section title is required"),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1, "Lesson title is required"),
            })
          )
          .min(1, "Each section must have at least one lesson"),
      })
    )
    .min(1, "Please add at least one section"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
