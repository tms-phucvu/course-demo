"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/core/lib";
import { CourseDetails } from "@/features/course-management/types/course.types";
import { formatDuration } from "@/features/course/utils/course.utils";
import { Link } from "@/i18n";
import { MonitorPlay } from "lucide-react";
import { useParams } from "next/navigation";

interface ContentTabProps {
  course: CourseDetails;
  openedSectionId?: string;
}

export default function ContentTab({
  course,
  openedSectionId,
}: ContentTabProps) {
  const params = useParams();
  const currentLessonId = params.lessonId as string;

  return (
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
                      currentLessonId === lesson.id && "bg-muted"
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Checkbox disabled={true} />
                        </TooltipTrigger>
                        <TooltipContent>Coming soon</TooltipContent>
                      </Tooltip>
                    </div>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
