import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, Lesson } from "@/features/course/types/course.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LessonMainProps {
  lesson: Lesson;
  course: Course;
}

function LessonMain({ lesson, course }: LessonMainProps) {
  return (
    <div className='w-full'>
      <div>
        <iframe
          className='aspect-video w-full'
          src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0`}
          title={lesson.title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
        <div className='flex flex-col items-center gap-4 rounded-b-xl border p-6 sm:flex-row'>
          <div className='flex-1'>{`Lesson '${lesson.title}' of course: ${course.title}`}</div>
          <Button variant={"outline"}>
            <ChevronLeft />
            Prev Lesson
          </Button>
          <Button>
            Next Lesson
            <ChevronRight />
          </Button>
        </div>
        <Tabs defaultValue='overview' className='mt-6'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='resources'>Resources</TabsTrigger>
            <TabsTrigger value='notion'>Notion</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

export default LessonMain;
