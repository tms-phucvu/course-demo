interface LessonLayoutProps {
  children: React.ReactNode;
}

export default async function LessonLayout({ children }: LessonLayoutProps) {
  return <div>{children}</div>;
}
