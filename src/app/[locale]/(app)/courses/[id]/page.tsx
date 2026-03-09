interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetails({ params }: PageProps) {
  const { id } = await params;

  return <div>Course details of ID: {id}</div>;
}
