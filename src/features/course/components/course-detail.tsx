import { BookOpen, Check, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Course } from "@/features/course/types/course.types";
import { formatDuration } from "@/features/course/utils/course.utils";

interface CourseDetailProps {
  course: Course;
}

export default function CourseDetail({ course }: CourseDetailProps) {
  return (
    <div className='mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8'>
      <Breadcrumb>
        <ol className='text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm sm:gap-2.5'>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/courses'>Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </ol>
      </Breadcrumb>

      <div className='mt-4 sm:mt-6 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-8'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              {course.title}
            </h1>
            <p className='text-muted-foreground'>{course.description}</p>
            <div className='text-muted-foreground text-sm'>
              Created by{" "}
              <span className='text-foreground font-medium'>
                {course.author}
              </span>
              <span>{" for "}</span>
              <Badge variant='default' className='uppercase'>
                {course.level}
              </Badge>
            </div>
          </div>
          <section className='border-border/50 bg-background space-y-3 rounded-lg border p-5'>
            <h3 className='text-xl font-semibold'>{"What You'll Learn"}</h3>
            <div className='grid grid-cols-2 gap-2'>
              {course.learningOutcomes.map((outcome) => (
                <div key={outcome} className='flex items-start gap-2'>
                  <Check className='mt-0.5 h-4 w-4 shrink-0' />
                  <span className='text-muted-foreground text-sm'>
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-4'>
            <div className='flex items-center gap-2'>
              <h2 className='text-xl font-semibold'>Explore Related Topics</h2>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {course.tags.map((tag) => (
                <Badge key={tag} variant='outline'>
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <section className='space-y-4'>
            <div className='flex items-center gap-2'>
              <h2 className='text-xl font-semibold'>Course Content Overview</h2>
            </div>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center justify-center gap-2 text-sm'>
                <BookOpen className='text-primary h-4 w-4' />
                <div className='text-muted-foreground'>
                  {course.totalSections} sections
                </div>
              </div>
            </div>

            <Accordion
              type='multiple'
              className='border-border/50 bg-background w-full rounded-lg border shadow-sm'
            >
              {course.sections
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className='border-b last:border-b-0'
                  >
                    <AccordionTrigger className='hover:bg-muted/50 px-5 py-4 transition-colors hover:no-underline'>
                      <div className='flex flex-col gap-1 text-left'>
                        <span className='text-base font-medium'>
                          {section.order}. {section.title}
                        </span>
                        <span className='text-muted-foreground text-sm'>
                          {section.totalLessons} lessons
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className='px-5 pt-2 pb-5'>
                      <div className='space-y-2'>
                        {section.lessons
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              className='group hover:bg-muted/40 hover:border-border/30 flex items-center justify-between gap-4 rounded-md border border-transparent px-4 py-3 transition-colors'
                            >
                              <div className='flex min-w-0 flex-1 items-center gap-3'>
                                <Play className='text-primary h-4 w-4 shrink-0' />
                                <div className='min-w-0'>
                                  <p className='truncate text-sm font-medium'>
                                    {lesson.order}. {lesson.title}
                                  </p>
                                  <p className='text-muted-foreground mt-0.5 text-xs'>
                                    {formatDuration(lesson.duration)}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`./${course.id}/lessons/${lesson.id}`}
                                className='text-primary hover:text-primary/80 text-sm font-medium whitespace-nowrap transition'
                              >
                                Open lesson
                              </Link>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </section>
          <section className='border-border/50 bg-background space-y-3'>
            <h3 className='text-xl font-semibold'>Requirements</h3>
            <ul className='space-y-2'>
              {course.requirements.map((requirement) => (
                <li key={requirement} className='flex items-start gap-2'>
                  <Check className='text-success mt-1 h-4 w-4' />
                  <span className='text-muted-foreground text-sm'>
                    {requirement}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className='lg:sticky lg:top-20'>
          <div className='space-y-4'>
            <div className='border-border/50 bg-background overflow-hidden rounded-xl border shadow-sm'>
              <div className='relative aspect-video w-full'>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-5'>
                <Button asChild className='w-full' size='lg' variant='default'>
                  <Link
                    href={`./${course.id}/lessons/${course.sections[0].lessons[0].id}`}
                  >
                    Start Learning Now
                  </Link>
                </Button>
                <div className='mt-5 space-y-3'>
                  <div className='text-muted-foreground flex items-center justify-between text-sm'>
                    <span>Total Lessons</span>
                    <span className='text-foreground font-medium'>
                      {course.totalLessons}
                    </span>
                  </div>
                  <div className='text-muted-foreground flex items-center justify-between text-sm'>
                    <span>Total Duration</span>
                    <span className='text-foreground font-medium'>
                      {formatDuration(course.totalDuration)}
                    </span>
                  </div>
                  <div className='text-muted-foreground flex items-center justify-between text-sm'>
                    <span>Level</span>
                    <span className='text-foreground font-medium'>
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
