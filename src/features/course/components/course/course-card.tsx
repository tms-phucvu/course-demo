import Link from "next/link";

import { CourseResponse } from "@/features/course-management/types/course.types";
import { MetaItem } from "@/features/course/components/course/meta-item";
import { formatDuration } from "@/features/course/utils/course.utils";
import { CirclePlay, Clock, Library } from "lucide-react";
import Image from "next/image";

interface CourseCardProps {
  course: CourseResponse;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className='group bg-card flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md'
      aria-label={`Show course detail ${course.title}`}
    >
      <div className='relative aspect-5/3 w-full overflow-hidden'>
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-110'
        />
      </div>
      <div className='flex-1 p-4'>
        <h3 className='line-clamp-2 leading-tight font-medium'>
          {course.title}
        </h3>
        <p className='text-muted-foreground mt-1 text-sm'>{course.language}</p>
      </div>
      <div className='border-border/50 text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-sm'>
        <MetaItem icon={Library} value={course.totalSections} />
        <MetaItem icon={CirclePlay} value={course.totalLessons} />
        <MetaItem icon={Clock} value={formatDuration(course.totalDuration)} />
      </div>
    </Link>
  );
}

export default CourseCard;
