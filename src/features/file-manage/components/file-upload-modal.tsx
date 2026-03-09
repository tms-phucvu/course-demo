"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  useImageUpload,
  type UploadHandler,
  type UploadProgress,
} from "@/core/image-handle";
import { cn } from "@/core/lib/utils";
import { FileText, Plus, Trash2, Upload, Video } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

/** Mock upload: simulate progress and return a placeholder URL. Replace with real API when ready. */
const createMockUploadHandler = (): UploadHandler => {
  return async (file, { onProgress }) => {
    for (let p = 0; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 100));
      onProgress?.(p);
    }
    const name = file instanceof File ? file.name : "file";
    return `/files/${encodeURIComponent(name)}`;
  };
};

const ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/msword": [".doc"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
} as const;
const MAX_SIZE = 50 * 1024 * 1024; // 50MB for videos

export interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  dropzoneMainLabel: string;
  dropzoneHintLabel: string;
  cancelButtonLabel: string;
  startUploadButtonLabel: string;
  uploadingLabel?: string;
  doneButtonLabel?: string;
  onSuccess?: (urls: string[]) => void;
}

export function FileUploadModal({
  open,
  onOpenChange,
  title,
  description,
  dropzoneMainLabel,
  dropzoneHintLabel,
  cancelButtonLabel,
  startUploadButtonLabel,
  uploadingLabel = "Uploading…",
  doneButtonLabel = "Done",
  onSuccess: _onSuccess,
}: FileUploadModalProps) {
  const [progressMap, setProgressMap] = useState<
    Record<string, UploadProgress>
  >({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const uploadHandler = useMemo(() => createMockUploadHandler(), []);

  const { images, validationErrors, addFiles, removeById, clear } =
    useImageUpload({
      maxFiles: 10,
      uploadHandler: undefined,
      validationConfig: {
        maxSizeInMb: 50,
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/msword",
          "application/zip", // docx, xlsx, pptx detected as zip by file-type
          "video/mp4",
          "video/webm",
          "video/quicktime",
        ],
      },
    });

  const onDrop = useCallback(
    (accepted: File[]) => {
      addFiles(accepted);
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: true,
    disabled: isUploading || uploadComplete,
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        clear();
        setProgressMap({});
        setUploadComplete(false);
      }
      onOpenChange(next);
    },
    [onOpenChange, clear]
  );

  const handleCancel = useCallback(() => {
    clear();
    setProgressMap({});
    setUploadComplete(false);
    onOpenChange(false);
  }, [clear, onOpenChange]);

  const handleDone = useCallback(() => {
    clear();
    setProgressMap({});
    setUploadComplete(false);
    onOpenChange(false);
  }, [clear, onOpenChange]);

  const handleStartUpload = useCallback(async () => {
    if (images.length === 0) return;
    setIsUploading(true);
    setProgressMap({});
    const urls: string[] = [];
    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        setProgressMap((prev) => ({
          ...prev,
          [img.id]: { id: img.id, progress: 0, status: "uploading" },
        }));
        const url = await uploadHandler(img.file, {
          onProgress: (p) =>
            setProgressMap((prev) => ({
              ...prev,
              [img.id]: { id: img.id, progress: p, status: "uploading" },
            })),
        });
        urls.push(url);
        setProgressMap((prev) => ({
          ...prev,
          [img.id]: { id: img.id, progress: 100, status: "success" },
        }));
      }
      setUploadComplete(true);
      _onSuccess?.(urls);
    } finally {
      setIsUploading(false);
    }
  }, [images, uploadHandler, _onSuccess]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='FileUploadModal max-h-[90vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div
            className={cn(
              "FileUploadModal-dropzone flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
              "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
              isDragActive && "border-primary/50 bg-primary/5",
              images.length > 0 && "justify-start"
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} aria-label='Upload files' />
            {images.length === 0 ? (
              <>
                <Upload className='text-muted-foreground size-10' aria-hidden />
                <p className='text-center text-sm font-medium'>
                  {dropzoneMainLabel}
                </p>
                <p className='text-muted-foreground text-center text-xs'>
                  {dropzoneHintLabel}
                </p>
              </>
            ) : (
              <>
                <div className='image-preview-list grid w-full grid-cols-3 gap-3'>
                  {images.map((img) => {
                    const progress = progressMap[img.id];
                    const uploading = progress?.status === "uploading";
                    const isImage = img.file.type.startsWith("image/");
                    const isVideo = img.file.type.startsWith("video/");
                    return (
                      <div
                        key={img.id}
                        className='image-preview-list-item bg-muted/30 relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg border p-1'
                      >
                        {isImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                            <img
                              src={img.previewUrl}
                              alt=''
                              className='h-full w-full object-cover'
                              width={80}
                              height={80}
                            />
                          </>
                        ) : (
                          <div className='flex flex-1 flex-col items-center justify-center gap-1'>
                            {isVideo ? (
                              <Video className='text-muted-foreground size-8 shrink-0' />
                            ) : (
                              <FileText className='text-muted-foreground size-8 shrink-0' />
                            )}
                            <span className='min-w-0 truncate text-center text-[10px]'>
                              {img.file.name}
                            </span>
                          </div>
                        )}
                        {uploading && (
                          <div className='absolute inset-x-0 bottom-0 bg-black/60 p-1'>
                            <Progress
                              value={progress?.progress ?? 0}
                              className='h-1'
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!uploadComplete && images.length < 10 && (
                    <div
                      className='border-muted-foreground/40 bg-muted/20 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed'
                      aria-hidden
                    >
                      <Plus className='text-muted-foreground size-8' />
                    </div>
                  )}
                </div>
                <p className='text-muted-foreground text-center text-xs'>
                  {dropzoneHintLabel}
                </p>
              </>
            )}
          </div>
          {images.length > 0 && (
            <ul className='FileUploadModal-fileList flex flex-col gap-2'>
              {images.map((img) => (
                <li
                  key={img.id}
                  className='bg-muted/20 flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm'
                >
                  <span className='min-w-0 truncate' title={img.file.name}>
                    {img.file.name}
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-8 shrink-0'
                    aria-label='Remove file'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeById(img.id);
                    }}
                  >
                    <Trash2 className='text-muted-foreground size-4' />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {validationErrors.length > 0 && (
            <p className='text-destructive text-sm'>
              {validationErrors[0].message}
            </p>
          )}
        </div>
        <DialogFooter className='flex-row justify-end gap-2 sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={uploadComplete ? handleDone : handleCancel}
            disabled={isUploading}
          >
            {uploadComplete ? doneButtonLabel : cancelButtonLabel}
          </Button>
          <Button
            type='button'
            onClick={uploadComplete ? handleDone : handleStartUpload}
            disabled={!uploadComplete && (images.length === 0 || isUploading)}
          >
            {uploadComplete
              ? doneButtonLabel
              : isUploading
                ? uploadingLabel
                : startUploadButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
