"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ImageDropzone,
  ImageEditorDialog,
  ImageLightbox,
  useImageLightbox,
  validateFiles,
  cropImageToBlob,
  type CropData,
} from "@/core/image-handle";
import { DEFAULT_AVATAR_PATH } from "@/core/constants";

const AVATAR_VALIDATION = {
  maxSizeInMb: 2,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 1,
};

interface ChangeAvatarSectionProps {
  currentImageUrl?: string;
}

export function ChangeAvatarSection({
  currentImageUrl,
}: ChangeAvatarSectionProps) {
  const t = useTranslations("profile.settings.changeAvatar");

  const [cropOpen, setCropOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  /** When true, user removed avatar → show dropzone only */
  const [removedByUser, setRemovedByUser] = useState(false);
  const { lightboxSrc, openLightbox, closeLightbox } = useImageLightbox();

  const displayUrl = removedByUser
    ? (croppedPreviewUrl ?? undefined)
    : (croppedPreviewUrl ?? currentImageUrl ?? undefined);
  const showDropzone = !displayUrl;
  const showRemoveButton = Boolean(displayUrl);

  const openCropForFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPendingFile(file);
    setObjectUrl(url);
    setValidationError(null);
    setCropOpen(true);
  }, []);

  const closeCrop = useCallback(() => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    setObjectUrl(null);
    setPendingFile(null);
    setCropOpen(false);
  }, [objectUrl]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const { validFiles, errors } = await validateFiles(
        [file],
        AVATAR_VALIDATION
      );

      if (errors.length > 0) {
        const msg = errors[0].message.includes("Invalid file type")
          ? t("invalidType")
          : t("fileTooBig");
        setValidationError(msg);
        return;
      }

      if (validFiles[0]) {
        setValidationError(null);
        openCropForFile(validFiles[0]);
      }
    },
    [openCropForFile, t]
  );

  const handleCropApply = useCallback(
    async (cropData: CropData) => {
      if (!pendingFile) return;
      try {
        const blob = await cropImageToBlob(pendingFile, cropData, {
          outputFormat: "image/webp",
          quality: 0.9,
        });
        const url = URL.createObjectURL(blob);
        if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
        setCroppedPreviewUrl(url);
      } finally {
        closeCrop();
      }
    },
    [pendingFile, closeCrop, croppedPreviewUrl]
  );

  const handleSaveAvatar = useCallback(() => {
    if (!croppedPreviewUrl) return;
    setIsSaving(true);
    toast.success(t("saved"));
    setIsSaving(false);
    // Frontend-only: keep croppedPreviewUrl so user sees new avatar.
    // Later: call API to upload cropped blob and update profile.image.
  }, [croppedPreviewUrl, t]);

  const handleRemoveAvatar = useCallback(() => {
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
    setCroppedPreviewUrl(null);
    setValidationError(null);
    setRemovedByUser(true);
    // Later: call API to remove avatar on server.
  }, [croppedPreviewUrl]);

  return (
    <Card className='change-avatar-section'>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-start gap-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          <button
            type='button'
            onClick={() => openLightbox(displayUrl ?? DEFAULT_AVATAR_PATH)}
            className='change-avatar-section-avatar focus:ring-ring rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none'
            aria-label='View avatar'
          >
            <Avatar className='border-border h-24 w-24 shrink-0 overflow-hidden rounded-full border-2'>
              <AvatarImage src={displayUrl ?? DEFAULT_AVATAR_PATH} alt='' />
              <AvatarFallback className='text-2xl'>U</AvatarFallback>
            </Avatar>
          </button>
          <div className='min-w-0'>
            <p className='text-sm font-medium'>
              {croppedPreviewUrl ? t("newAvatar") : t("currentAvatar")}
            </p>
            <p className='text-muted-foreground text-xs'>{t("uploadHint")}</p>
          </div>
        </div>

        {validationError && (
          <Alert variant='destructive' className='change-avatar-section-alert'>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {showRemoveButton && (
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handleRemoveAvatar}
              className='change-avatar-section-remove'
            >
              {t("removeAvatar")}
            </Button>
            {croppedPreviewUrl && (
              <Button
                type='button'
                onClick={handleSaveAvatar}
                disabled={isSaving}
                className='change-avatar-section-save'
              >
                {t("saveAvatar")}
              </Button>
            )}
          </div>
        )}

        {showDropzone && (
          <ImageDropzone
            onDrop={handleDrop}
            multiple={false}
            maxSize={AVATAR_VALIDATION.maxSizeInMb * 1024 * 1024}
            label={t("chooseImage")}
            className='w-full max-w-sm'
          />
        )}

        <ImageEditorDialog
          open={cropOpen}
          onOpenChange={setCropOpen}
          imageSrc={objectUrl}
          aspectRatio='square'
          onApply={handleCropApply}
          onClose={closeCrop}
          title={t("cropTitle")}
          applyLabel={t("cropApply")}
        />
        <ImageLightbox src={lightboxSrc} onClose={closeLightbox} alt='' />
      </CardContent>
    </Card>
  );
}
