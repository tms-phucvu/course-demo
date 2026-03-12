"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/core/lib";
import { Course } from "@/features/course/types/course.types";
import { formatDuration } from "@/features/course/utils/course.utils";
import { Link } from "@/i18n";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { MonitorPlay } from "lucide-react";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface LessonSidebarProps {
  course: Course;
  isOpen: boolean;
  setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

function LessonSidebar({
  course,
  isOpen,
  setIsOpenSidebar,
}: LessonSidebarProps) {
  const isMobile = useIsMobile();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const openedSectionId = course.sections.find((section) =>
    section.lessons.some((lesson) => lesson.id === lessonId)
  )?.id;

  const sidebarContent = (
    <>
      <div className='flex items-center justify-between border-b p-4'>
        <div>
          <h3 className='font-semibold'>Course Content</h3>
          <p className='text-xs'>{`0/${course.totalLessons} completed`}</p>
        </div>
        <div className='mr-2'>0%</div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='mr-2'>
          <Accordion
            type='multiple'
            className='max-w-lg'
            defaultValue={openedSectionId ? [openedSectionId] : []}
          >
            {course.sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className='bg-muted group px-4 hover:no-underline'>
                  <div className='flex flex-col'>
                    <div className='text-lg group-hover:underline'>
                      {`Section ${section.order}. ${section.title}`}
                    </div>
                    <div className='ml-0.5 space-x-2 text-xs font-normal'>
                      <span>{`${section.totalLessons} lessons`}</span>
                      <span>•</span>
                      <span>{formatDuration(section.totalDuration)}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='p-0'>
                  <div className='flex flex-col'>
                    {section.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`./${lesson.id}`}
                        className={cn(
                          "hover:bg-muted px-8 py-2",
                          lessonId === lesson.id && "bg-muted"
                        )}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex flex-col gap-1.5'>
                            <div>{`${lesson.order}. ${lesson.title}`}</div>
                            <div className='flex items-center gap-1.5 text-xs font-light'>
                              <MonitorPlay size={16} />
                              {formatDuration(lesson.duration)}
                            </div>
                          </div>
                          <Checkbox />
                        </div>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Sheet
          open={isOpen}
          onOpenChange={() => setIsOpenSidebar((prev) => !prev)}
        >
          <SheetContent
            side='right'
            className='flex h-full w-[85%] flex-col p-0 pt-10'
          >
            <SheetTitle className='sr-only'>Course Content</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        <aside
          className={cn(
            "bg-background fixed top-17 right-0 flex h-[calc(100vh-68px)] w-1/4 flex-col border",
            "transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      )}
    </>
  );
}

export default LessonSidebar;
