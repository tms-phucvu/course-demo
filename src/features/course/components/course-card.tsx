import { MetaItem } from "@/features/course/components/meta-item";
import { Course } from "@/features/course/types/course.types";
import { CirclePlay, Clock, Library } from "lucide-react";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div className='group bg-card cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md'>
      <div className='relative aspect-5/3 w-full overflow-hidden'>
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-110'
        />
      </div>
      <div className='p-4'>
        <h3 className='line-clamp-2 leading-tight font-medium'>
          {course.title}
        </h3>
        <p className='text-muted-foreground mt-1 text-sm'>{course.author}</p>
      </div>
      <div className='border-border/50 text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-sm'>
        <MetaItem icon={Library} value={course.totalSections} />
        <MetaItem icon={CirclePlay} value={course.totalLessons} />
        <MetaItem icon={Clock} value={course.totalDuration} />
      </div>
    </div>
  );
}

export default CourseCard;
