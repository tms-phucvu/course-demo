interface CourseEditProps {
  id: string;
}

function CourseEdit({ id }: CourseEditProps) {
  return <div>{`edit course ${id}`}</div>;
}

export default CourseEdit;
