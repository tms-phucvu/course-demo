"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import type { TaskAttachment } from "@/features/kanban/types";
import type { UploadHandler } from "@/core/image-handle";

/** Mock upload: returns a placeholder URL. Replace with real API when ready. */
const createMockUploadHandler = (): UploadHandler => {
  return async (file, { onProgress }) => {
    for (let p = 0; p <= 100; p += 25) {
      await new Promise((r) => setTimeout(r, 80));
      onProgress?.(p);
    }
    const name = file instanceof File ? file.name : "file";
    return `/files/${encodeURIComponent(name)}?t=${Date.now()}`;
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

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10;

export interface TaskAttachmentUploadProps {
  value: TaskAttachment[];
  onChange: (attachments: TaskAttachment[]) => void;
  disabled?: boolean;
  label?: string;
  dropzoneLabel?: string;
  dropzoneHint?: string;
}

export function TaskAttachmentUpload({
  value,
  onChange,
  disabled = false,
  label = "Attachments",
  dropzoneLabel = "Drag & drop files or click to upload",
  dropzoneHint = "Images, PDF, DOCX, XLSX, PPTX, MP4. Max 50MB.",
}: TaskAttachmentUploadProps) {
  const [uploading, setUploading] = useState<Record<string, number>>({});
  const uploadHandler = useMemo(() => createMockUploadHandler(), []);

  const doUpload = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      setUploading((p) => ({ ...p, [id]: 0 }));
      try {
        const url = await uploadHandler(file, {
          onProgress: (percent) =>
            setUploading((p) => ({ ...p, [id]: percent })),
        });
        const type = file.type.startsWith("image/") ? "image" : "file";
        onChange([...value, { id, name: file.name, url, type }]);
      } finally {
        setUploading((p) => {
          const next = { ...p };
          delete next[id];
          return next;
        });
      }
    },
    [value, onChange, uploadHandler]
  );

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const remaining = MAX_FILES - value.length;
      const toAdd = accepted.slice(0, remaining);
      for (const file of toAdd) {
        await doUpload(file);
      }
    },
    [value.length, doUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: true,
    disabled: disabled || value.length >= MAX_FILES,
  });

  const removeAttachment = useCallback(
    (id: string) => {
      onChange(value.filter((a) => a.id !== id));
    },
    [value, onChange]
  );

  const isUploading = Object.keys(uploading).length > 0;

  return (
    <div className='TaskAttachmentUpload space-y-2'>
      <span className='text-sm font-medium'>{label}</span>
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 transition-colors",
          "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
          isDragActive && "border-primary/50 bg-primary/5",
          (disabled || value.length >= MAX_FILES) &&
            "cursor-not-allowed opacity-60"
        )}
      >
        <input {...getInputProps()} aria-label={label} />
        {value.length === 0 && !isUploading ? (
          <>
            <Upload className='text-muted-foreground h-8 w-8' />
            <p className='text-center text-sm'>{dropzoneLabel}</p>
            <p className='text-muted-foreground text-center text-xs'>
              {dropzoneHint}
            </p>
          </>
        ) : (
          <p className='text-muted-foreground text-center text-xs'>
            {dropzoneHint}
          </p>
        )}
      </div>
      {value.length > 0 && (
        <ul className='space-y-1.5'>
          {value.map((att) => (
            <li
              key={att.id}
              className='bg-muted/30 flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
            >
              {att.type === "image" ? (
                <ImageIcon className='text-muted-foreground h-4 w-4 shrink-0' />
              ) : (
                <FileText className='text-muted-foreground h-4 w-4 shrink-0' />
              )}
              <a
                href={att.url}
                target='_blank'
                rel='noopener noreferrer'
                className='min-w-0 flex-1 truncate hover:underline'
              >
                {att.name}
              </a>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-7 w-7 shrink-0'
                aria-label='Remove attachment'
                onClick={(e) => {
                  e.stopPropagation();
                  removeAttachment(att.id);
                }}
                disabled={disabled}
              >
                <Trash2 className='h-3.5 w-3.5' />
              </Button>
            </li>
          ))}
          {isUploading && (
            <li className='bg-muted/20 text-muted-foreground flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm'>
              <Upload className='h-4 w-4 animate-pulse' />
              Uploading…
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
