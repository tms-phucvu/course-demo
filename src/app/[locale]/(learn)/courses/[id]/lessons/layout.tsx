import LessonLayoutClient from "@/features/course/components/lesson/lesson-layout-client";

interface LessonLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function LessonLayout({
  children,
  params,
}: LessonLayoutProps) {
  const { id } = await params;

  return <LessonLayoutClient courseId={id}>{children}</LessonLayoutClient>;
}
