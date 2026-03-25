"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import OverviewTab from "@/features/course/components/lesson-main-tab/overview-tab";
import ResourcesTab from "@/features/course/components/lesson-main-tab/resources-tab";
import ReviewsTab from "@/features/course/components/lesson-main-tab/reviews-tab";
import { useCourseDetail } from "@/features/course/hooks/use-course-detail";
import { Link } from "@/i18n";
import { useRef } from "react";
import ReactPlayer from "react-player";

interface LessonMainProps {
  selectedLessonId: string;
  courseId: string;
}

function LessonMain({ selectedLessonId, courseId }: LessonMainProps) {
  const { data: course, isLoading, isError, error } = useCourseDetail(courseId);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  if (isLoading) {
    return (
      <div className='w-full p-6 text-center text-gray-500'>
        Loading lesson...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-destructive w-full p-6 text-center'>
        Failed to load course: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!course) {
    return (
      <div className='w-full p-6 text-center text-gray-500'>
        Course not found
      </div>
    );
  }

  // Find the selected lesson across all sections
  // Find the selected lesson + its position
  let selectedLesson = null;
  let prevLessonId: string | null = null;
  let nextLessonId: string | null = null;

  outer: for (let secIdx = 0; secIdx < course.sections.length; secIdx++) {
    const section = course.sections[secIdx];
    for (let lesIdx = 0; lesIdx < section.lessons.length; lesIdx++) {
      const lesson = section.lessons[lesIdx];

      if (lesson.id === selectedLessonId) {
        selectedLesson = lesson;

        // Previous lesson
        if (lesIdx > 0) {
          prevLessonId = section.lessons[lesIdx - 1].id;
        } else if (secIdx > 0) {
          const prevSection = course.sections[secIdx - 1];
          prevLessonId =
            prevSection.lessons[prevSection.lessons.length - 1]?.id || null;
        }

        // Next lesson
        if (lesIdx < section.lessons.length - 1) {
          nextLessonId = section.lessons[lesIdx + 1].id;
        } else if (secIdx < course.sections.length - 1) {
          const nextSection = course.sections[secIdx + 1];
          nextLessonId = nextSection.lessons[0]?.id || null;
        }

        break outer;
      }
    }
  }

  if (!selectedLesson) {
    return (
      <div className='w-full p-6 text-center text-gray-500'>
        Lesson not found in this course
      </div>
    );
  }

  const prevHref = prevLessonId
    ? `/courses/${courseId}/lessons/${prevLessonId}`
    : "#";
  const nextHref = nextLessonId
    ? `/courses/${courseId}/lessons/${nextLessonId}`
    : "#";

  return (
    <div className='w-full'>
      <div>
        <div className='aspect-video max-h-[min(80vh,800px)] w-full'>
          {selectedLesson.videoUrl.includes("youtube") ? (
            <ReactPlayer
              ref={playerRef}
              src={selectedLesson.videoUrl}
              controls
              width='100%'
              height='100%'
              onClick={() => {
                console.log(playerRef.current?.currentTime);
              }}
            />
          ) : (
            <iframe
              src={selectedLesson.videoUrl}
              width='1280'
              height='720'
              frameBorder='0'
              scrolling='no'
              allowFullScreen
              title='YTSave.com_YouTube_Dan-dau-xu-huong-Tri-Tue-Nhan-Tao-AI-cun_Media_bOvxqoVhKW0_002_720p.mp4'
              style={{
                border: "none",
                height: "100%",
                width: "100%",
                maxWidth: "100%",
              }}
            ></iframe>
          )}
        </div>

        <div className='flex flex-col items-center gap-4 rounded-b-xl border p-6 sm:flex-row'>
          <div className='flex-1 text-lg font-semibold'>
            {selectedLesson.title}
          </div>
          <div className='flex gap-4 self-end'>
            <Link href={prevHref}>
              <Button variant='outline' disabled={!prevLessonId}>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Prev Lesson
              </Button>
            </Link>
            <Link href={nextHref}>
              <Button disabled={!nextLessonId}>
                Next Lesson
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs
          defaultValue='overview'
          className='mt-6 flex flex-col items-center gap-5'
        >
          <TabsList className='self-start'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='resources'>Resources</TabsTrigger>
            <TabsTrigger value='reviews'>Reviews</TabsTrigger>
          </TabsList>
          <Separator className='mx-6' />
          <div className='mr-2 mb-16 flex w-11/12 sm:w-1/2'>
            <TabsContent value='overview'>
              <OverviewTab course={course} />
            </TabsContent>
            <TabsContent value='resources'>
              <ResourcesTab />
            </TabsContent>
            <TabsContent value='reviews'>
              <ReviewsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default LessonMain;
