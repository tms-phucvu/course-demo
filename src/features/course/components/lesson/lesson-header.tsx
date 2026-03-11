import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { LocaleSwitcher } from "@/shared";
import { ChevronLeft, MessageCircleQuestion } from "lucide-react";

export default function LessonHeader({ courseName }: { courseName: string }) {
  return (
    <div className='fixed top-0 flex w-full items-center justify-between gap-4 px-6 py-4 shadow-2xs backdrop-blur-lg'>
      <Link href={`../`}>
        <Button variant={"outline"}>
          <ChevronLeft />
          {courseName}
        </Button>
      </Link>
      <div>
        <ThemeModeToggle />
        <LocaleSwitcher variantButton='ghost' />
        <Button variant={"outline"} className='ml-2'>
          <MessageCircleQuestion />
          Need help?
        </Button>
      </div>
    </div>
  );
}
