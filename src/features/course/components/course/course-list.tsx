import CourseCard from "@/features/course/components/course/course-card";
import { MOCK_COURSES } from "@/features/course/mock/course-data";

function CourseList() {
  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-bold'>Course List</h2>
      <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
        {MOCK_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
