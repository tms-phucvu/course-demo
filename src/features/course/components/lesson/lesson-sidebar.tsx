"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/core/lib";
import { CourseDetails } from "@/features/course-management/types/course.types";
import AssistantTab from "@/features/course/components/sidebar-tab/assistant-tab";
import ContentTab from "@/features/course/components/sidebar-tab/content-tab";
import NoteTab from "@/features/course/components/sidebar-tab/note-tab";
import { CircularProgress } from "@/features/course/components/ui/circular-progress";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface LessonSidebarProps {
  course: CourseDetails;
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
    <Tabs defaultValue='content' className='flex h-full flex-col'>
      <div>
        <div className='flex items-center justify-between p-4'>
          <div>
            <h3 className='font-semibold'>Course Content</h3>
            <p className='text-xs'>{`0/${course.totalLessons} completed`}</p>
          </div>
          <div className='mr-2 flex items-center gap-2'>
            <CircularProgress value={55} />
          </div>
        </div>
        <TabsList className='inline-flex h-auto w-full justify-start rounded-none border-b bg-transparent p-0'>
          <TabsTrigger
            value='content'
            className='text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-5 py-3 text-sm font-medium shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:shadow-none'
          >
            Content
          </TabsTrigger>
          <TabsTrigger
            value='note'
            className='text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-5 py-3 text-sm font-medium shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:shadow-none'
          >
            Note
          </TabsTrigger>
          <TabsTrigger
            value='assistant'
            className='text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative rounded-none border-b-2 border-b-transparent bg-transparent px-5 py-3 text-sm font-medium shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:shadow-none'
          >
            AI Assistant
          </TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea className='flex-1'>
        <TabsContent value='content' className='mr-2'>
          <ContentTab course={course} openedSectionId={openedSectionId} />
        </TabsContent>
        <TabsContent value='note'>
          <NoteTab />
        </TabsContent>
        <TabsContent value='assistant'>
          <AssistantTab />
        </TabsContent>
      </ScrollArea>
    </Tabs>
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
