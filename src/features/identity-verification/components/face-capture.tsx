"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
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
import type { VerifyOcrErrorCodeType } from "@/core/verify-ocr";
import { VerifyOcrErrorCode } from "@/core/verify-ocr";

export interface FaceCaptureProps {
  onCapture: (dataUrl: string) => void;
  loading?: boolean;
  errorCode?: VerifyOcrErrorCodeType | null;
  onClearError?: () => void;
  className?: string;
}

export function FaceCapture({
  onCapture,
  loading = false,
  errorCode = null,
  onClearError,
  className,
}: FaceCaptureProps) {
  const t = useTranslations("identityVerification.faceCapture");
  const tCommon = useTranslations("common");
  const webcamRef = useRef<Webcam | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleUserMediaError = useCallback(() => {
    setCameraError(true);
  }, []);

  const handleCapture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot() ?? null;
    if (screenshot) {
      setCapturedImage(screenshot);
      onCapture(screenshot);
    }
  }, [onCapture]);

  const handleTryAgain = useCallback(() => {
    setCapturedImage(null);
    setCameraError(false);
    onClearError?.();
  }, [onClearError]);

  const isCameraErr =
    cameraError || errorCode === VerifyOcrErrorCode.ERR_CAMERA;
  const isNoFaceErr = errorCode === VerifyOcrErrorCode.ERR_NO_FACE_IN_FRAME;
  const isRateLimitErr = errorCode === VerifyOcrErrorCode.ERR_RATE_LIMIT;
  const errorMessage = isCameraErr
    ? t("cameraError")
    : isRateLimitErr
      ? t("rateLimitExceeded")
      : isNoFaceErr
        ? t("noFaceInFrame")
        : null;

  const showWebcam = !capturedImage && !cameraError && mounted;
  const showPreview = !!capturedImage;

  return (
    <div className={cn("FaceCapture", className)}>
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
                  onClick={handleTryAgain}
                >
                  {t("tryAgain")}
                </Button>
              )}
            </Alert>
          )}
          {!cameraError && !mounted && !capturedImage && (
            <div className='bg-muted flex aspect-video max-w-lg items-center justify-center rounded-lg'>
              <span className='text-muted-foreground text-sm'>
                {tCommon("loading")}
              </span>
            </div>
          )}
          {showWebcam && (
            <div className='bg-muted relative aspect-video w-full max-w-full overflow-hidden rounded-lg'>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user",
                }}
                onUserMediaError={handleUserMediaError}
                className='absolute inset-0 h-full w-full object-cover'
              />
              <div
                className='pointer-events-none absolute inset-0 flex items-center justify-center'
                aria-hidden
              >
                <div
                  className='h-64 w-56 rounded-full border-4 border-white/80 sm:h-72 sm:w-60'
                  style={{ borderStyle: "solid" }}
                />
              </div>
            </div>
          )}
          {showPreview && (
            <div className='space-y-3'>
              <p className='text-muted-foreground text-center text-sm'>
                {loading ? t("sendingToAi") : t("captureSent")}
              </p>
              <div className='flex justify-center'>
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL from capture, not a static asset */}
                <img
                  src={capturedImage}
                  alt='Capture'
                  className='max-h-80 rounded-lg border object-contain'
                />
              </div>
              {loading && (
                <div className='bg-muted mx-auto h-2 w-32 animate-pulse rounded' />
              )}
              {!loading && errorMessage && (
                <div className='flex justify-center'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleTryAgain}
                  >
                    {t("tryAgain")}
                  </Button>
                </div>
              )}
            </div>
          )}
          {showWebcam && (
            <div className='flex flex-col items-center gap-2'>
              <p className='text-muted-foreground text-center text-sm'>
                {t("captureWhenReady")}
              </p>
              <Button type='button' onClick={handleCapture} disabled={loading}>
                {loading ? tCommon("loading") : t("capture")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
