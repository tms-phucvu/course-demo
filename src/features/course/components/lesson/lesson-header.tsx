import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { LocaleSwitcher } from "@/shared";
import { ChevronLeft, MessageCircleQuestion, PanelLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface LessonHeaderProps {
  courseName: string;
  setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

export default function LessonHeader({
  courseName,
  setIsOpenSidebar,
}: LessonHeaderProps) {
  return (
    <div className='bg-background fixed top-0 flex w-full flex-col items-center justify-between gap-4 px-6 py-4 shadow-2xs sm:flex-row'>
      <Link href={`../`} className='self-start'>
        <Button variant={"outline"}>
          <ChevronLeft />
          {courseName}
        </Button>
      </Link>
      <div className='self-end'>
        <ThemeModeToggle />
        <LocaleSwitcher variantButton='ghost' />
        <Button
          variant='ghost'
          size='icon'
          className={"h-9 w-9 transition-colors"}
          onClick={() => setIsOpenSidebar((prev) => !prev)}
        >
          <PanelLeft className='h-5 w-5' />
          <span className='sr-only'>Toggle Sidebar</span>
        </Button>
        <Button variant={"outline"} className='ml-2'>
          <MessageCircleQuestion />
          Need help?
        </Button>
      </div>
    </div>
  );
}
