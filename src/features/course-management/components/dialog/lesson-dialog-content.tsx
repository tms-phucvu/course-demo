import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useYoutubeVideoInfo } from "@/features/course-management/hooks/use-youtube-video-info";
import { LessonFormValues } from "@/features/course-management/schemas/lesson.schemas";
import { extractVideoId } from "@/features/course-management/utils/youtube.utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LessonDialogContentProps {
  videoUrl: string;
  onSave: (lessonValues: LessonFormValues) => void;
  onCancel: () => void;
  isAdd?: boolean;
}

export function LessonDialogContent({
  videoUrl,
  onSave,
  onCancel,
  isAdd = true,
}: LessonDialogContentProps) {
  const { loading, error, fetchInfo } = useYoutubeVideoInfo();
  const [urlInput, setUrlInput] = useState(videoUrl);

  useEffect(() => {
    setUrlInput(videoUrl);
  }, [videoUrl]);

  const handleSave = async () => {
    if (loading) return;
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      toast.error("Please enter URL!");
      return;
    }
    if (!extractVideoId(trimmedUrl)) {
      toast.error("Invalid Video URL");
      return;
    }
    const info = await fetchInfo(trimmedUrl);
    if (info?.videoId && !loading && !error) {
      onSave({
        videoId: info.videoId,
        title: info.title,
        duration: info.durationSeconds,
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isAdd ? "Add Lesson" : "Edit Lesson"}</DialogTitle>
        <DialogDescription className='sr-only'>
          {isAdd ? "Create the lesson." : "Update the lesson."}
        </DialogDescription>
      </DialogHeader>

      <div className='space-y-4 py-4'>
        <div className='space-y-2'>
          <Label htmlFor='lesson-url'>YouTube Video URL</Label>
          <Input
            id='lesson-url'
            autoFocus
            placeholder='https://www.youtube.com/watch?v=xxxxxxxx'
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className='text-destructive text-sm'>{error}</p>}
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button onClick={handleSave} disabled={loading || !urlInput.trim()}>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isAdd ? "Add Lesson" : "Save"}
        </Button>
      </DialogFooter>
    </>
  );
}
