import * as z from "zod";

export const lessonSchema = z.object({
  videoId: z.string().min(1, "Lesson video is required"),
  title: z.string(),
  duration: z.number(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
