"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/core/lib/utils";
import { useVerificationFlow } from "../hooks/use-verification-flow";
import { DocumentUpload } from "./document-upload";
import { FaceCapture } from "./face-capture";
import { VerificationSummary } from "./verification-summary";
import { DocumentConfirmModal } from "./document-confirm-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function VerificationFlow() {
  const t = useTranslations("identityVerification");
  const {
    step,
    session,
    pendingConfirmDocument,
    loading,
    errorCode,
    setStep,
    clearError,
    loadSession,
    runOcr,
    runFaceMatch,
    reset,
    confirmDocumentAndGoToStep2,
    cancelDocumentConfirm,
  } = useVerificationFlow();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!session || step !== 1) return;
    if (session.selfieDataUrl && session.faceMatchResult) {
      setStep(3);
    }
    // Do NOT auto-advance to step 2 here: after OCR we show the confirm modal first.
    // Step 2 is only reached via confirmDocumentAndGoToStep2() when user clicks OK.
  }, [session, step, setStep]);
  const steps = [
    { key: "stepDocument", value: 1 },
    { key: "stepFace", value: 2 },
    { key: "stepSummary", value: 3 },
  ] as const;

  return (
    <div className='VerificationFlow space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold'>{t("title")}</h1>
        <p className='text-muted-foreground mt-1'>{t("description")}</p>
      </div>

      <nav
        aria-label='Verification steps'
        className='flex w-full items-stretch'
      >
        {steps.map(({ key, value }, index) => {
          const isActive = step === value;
          const isCompleted = step > value;
          const isLast = index === steps.length - 1;
          const lineCompleted = step > value;
          return (
            <React.Fragment key={key}>
              <div className='flex shrink-0 flex-col items-center'>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isActive &&
                      "border-primary bg-primary text-primary-foreground",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    !isActive &&
                      !isCompleted &&
                      "border-muted-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  ) : (
                    value
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 max-w-[100px] text-center text-xs font-medium md:max-w-[140px] md:text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {t(key)}
                </span>
              </div>
              {isLast ? null : (
                <div className='flex min-w-[24px] flex-1 items-center px-2'>
                  <div
                    className={cn(
                      "h-0.5 w-full",
                      lineCompleted ? "bg-primary" : "bg-muted"
                    )}
                    aria-hidden
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {step === 1 && (
        <DocumentUpload
          onOcrStart={(file) => runOcr(file)}
          loading={loading}
          errorCode={errorCode}
          onClearError={clearError}
        />
      )}

      <DocumentConfirmModal
        open={step === 1 && pendingConfirmDocument && !!session}
        session={session}
        onConfirm={confirmDocumentAndGoToStep2}
        onCancel={cancelDocumentConfirm}
      />

      {step === 2 && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) reset();
          }}
        >
          <DialogContent className='FaceVerificationModal max-h-[90vh] max-w-4xl overflow-y-auto'>
            <FaceCapture
              onCapture={(dataUrl) => runFaceMatch(dataUrl)}
              loading={loading}
              errorCode={errorCode}
              onClearError={clearError}
            />
          </DialogContent>
        </Dialog>
      )}

      {step === 3 && session && (
        <VerificationSummary
          session={session}
          onStartOver={reset}
          onConfirm={reset}
        />
      )}
    </div>
  );
}
