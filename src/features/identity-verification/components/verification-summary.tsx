"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/core/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VerificationSessionData } from "@/core/verify-ocr";

export interface VerificationSummaryProps {
  session: VerificationSessionData;
  onStartOver?: () => void;
  onConfirm?: () => void;
  className?: string;
}

const SUCCESS_THRESHOLD = 0.8;

const fieldKeys = [
  "fullName",
  "idNumber",
  "dateOfBirth",
  "expiryDate",
] as const;

export function VerificationSummary({
  session,
  onStartOver,
  onConfirm,
  className,
}: VerificationSummaryProps) {
  const t = useTranslations("identityVerification.summary");
  const tFields = useTranslations("identityVerification.summary.fields");
  const matchResult = session.faceMatchResult;
  const similarityPercent =
    matchResult?.similarity != null
      ? Math.round(matchResult.similarity * 100)
      : null;
  const matched = matchResult?.matched ?? false;
  const isSuccess =
    matchResult?.similarity != null &&
    matchResult.similarity >= SUCCESS_THRESHOLD;

  return (
    <div className={cn("VerificationSummary", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            Document and face verification result.
          </CardDescription>
          <div className='flex flex-col items-center pt-4'>
            <div className='flex justify-center' aria-hidden>
              {isSuccess ? (
                <CheckCircle2
                  className='h-20 w-20 text-green-600 sm:h-24 sm:w-24'
                  strokeWidth={1.5}
                />
              ) : (
                <XCircle
                  className='text-destructive h-20 w-20 sm:h-24 sm:w-24'
                  strokeWidth={1.5}
                />
              )}
            </div>
            <p
              className={cn(
                "mt-3 text-center text-base font-semibold",
                isSuccess ? "text-green-600" : "text-destructive"
              )}
            >
              {isSuccess ? t("successStatus") : t("failedStatus")}
            </p>
            <p
              className={cn(
                "mt-1 max-w-sm text-center text-sm font-medium",
                isSuccess ? "text-green-600" : "text-destructive"
              )}
            >
              {isSuccess
                ? t("successReason", { percent: similarityPercent ?? "—" })
                : t("failedReason", { percent: similarityPercent ?? "—" })}
            </p>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                {t("document")}
              </p>
              {session.documentImageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL from session
                <img
                  src={session.documentImageDataUrl}
                  alt='Document'
                  className='max-h-48 w-auto rounded border object-contain'
                />
              ) : (
                <div className='bg-muted h-32 animate-pulse rounded' />
              )}
            </div>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                {t("selfie")}
              </p>
              {session.selfieDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL from session
                <img
                  src={session.selfieDataUrl}
                  alt='Selfie'
                  className='max-h-48 w-auto rounded border object-contain'
                />
              ) : (
                <div className='bg-muted h-32 animate-pulse rounded' />
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm font-medium'>
              {t("matchScore")}
            </p>
            <p className='text-lg font-semibold'>
              {similarityPercent != null ? `${similarityPercent}%` : "—"}{" "}
              {matched ? (
                <span className='text-green-600'>{t("matched")}</span>
              ) : (
                <span className='text-destructive'>{t("notMatched")}</span>
              )}
            </p>
          </div>

          <div className='border-t pt-4'>
            <p className='text-muted-foreground mb-2 text-sm font-medium'>
              Extracted info
            </p>
            <dl className='grid gap-2 sm:grid-cols-2'>
              {fieldKeys.map((key) => {
                const value = session.ocrResult?.fields?.[key] ?? null;
                return (
                  <div key={key}>
                    <dt className='text-muted-foreground text-xs'>
                      {tFields(key)}
                    </dt>
                    <dd className='font-medium'>{value ?? "—"}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {isSuccess
            ? onConfirm && (
                <Button type='button' onClick={onConfirm}>
                  {t("confirm")}
                </Button>
              )
            : onStartOver && (
                <Button type='button' variant='outline' onClick={onStartOver}>
                  {t("retry")}
                </Button>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
