import { CourseDetails } from "@/features/course-management/types/course.types";
import { formatCreatedAt } from "@/features/user-management/lib/user.util";
import { Clock10, Globe, GraduationCap } from "lucide-react";

interface OverviewTabProps {
  course: CourseDetails;
}

export default function OverviewTab({ course }: OverviewTabProps) {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='text-3xl'>{course.title}</div>
        <div>{course.description}</div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Globe size={18} />
            <div>{course.language}</div>
          </div>
          <div className='flex items-center gap-2'>
            <GraduationCap size={18} />
            <div>{course.level}</div>
          </div>
          <div className='flex items-center gap-2'>
            <Clock10 size={18} />
            <div>{`Last updated ${formatCreatedAt(course.publishedAt)}`}</div>
          </div>
        </div>
      </div>
    </>
  );
}
