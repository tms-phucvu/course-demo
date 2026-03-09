"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import { cn } from "@/core/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  VerifyOcrErrorCode,
  type VerifyOcrErrorCodeType,
} from "@/core/verify-ocr";

export interface DocumentUploadProps {
  onOcrStart: (file: File) => void;
  loading?: boolean;
  errorCode?: VerifyOcrErrorCodeType | null;
  onClearError?: () => void;
  className?: string;
}

const errorCodeToMessageKey: Record<string, string> = {
  [VerifyOcrErrorCode.ERR_FORMAT]: "format",
  [VerifyOcrErrorCode.ERR_NO_FACE]: "noFace",
  [VerifyOcrErrorCode.ERR_BLUR]: "blur",
  [VerifyOcrErrorCode.ERR_INVALID_DOC]: "invalidDoc",
};

export function DocumentUpload({
  onOcrStart,
  loading = false,
  errorCode = null,
  onClearError,
  className,
}: DocumentUploadProps) {
  const t = useTranslations("identityVerification.documentUpload");
  const tCommon = useTranslations("common");

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onOcrStart(acceptedFiles[0]);
      }
    },
    [onOcrStart]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: loading,
  });

  const errorKey = errorCode ? errorCodeToMessageKey[errorCode] : null;
  const errorMessage = errorKey ? t(errorKey) : null;

  return (
    <div className={cn("DocumentUpload", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("hint")}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {errorMessage && (
            <Alert variant='destructive' role='alert'>
              <AlertDescription>{errorMessage}</AlertDescription>
              {onClearError && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-2'
                  onClick={onClearError}
                >
                  {tCommon("close")}
                </Button>
              )}
            </Alert>
          )}
          <div
            className={cn(
              "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
              isDragActive && "border-primary/50 bg-primary/5",
              loading && "pointer-events-none opacity-70"
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} aria-label={t("title")} />
            {loading ? (
              <div className='flex flex-col items-center gap-2'>
                <div className='bg-muted h-2 w-32 animate-pulse rounded' />
                <span className='text-muted-foreground text-sm'>
                  {t("processing")}
                </span>
              </div>
            ) : (
              <span className='text-muted-foreground text-center text-sm'>
                {t("hint")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
