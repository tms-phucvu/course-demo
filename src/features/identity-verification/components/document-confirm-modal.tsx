"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { VerificationSessionData } from "@/core/verify-ocr";

export interface DocumentConfirmModalProps {
  open: boolean;
  session: VerificationSessionData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const fieldKeys = [
  "fullName",
  "idNumber",
  "dateOfBirth",
  "expiryDate",
] as const;

export function DocumentConfirmModal({
  open,
  session,
  onConfirm,
  onCancel,
}: DocumentConfirmModalProps) {
  const t = useTranslations("identityVerification.documentConfirm");
  const tFields = useTranslations("identityVerification.summary.fields");

  if (!session) return null;

  const fields = session.ocrResult?.fields ?? {};
  const documentImage = session.documentImageDataUrl;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className='DocumentConfirmModal max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          {documentImage && (
            <div className='flex justify-center'>
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL from session, not a static asset */}
              <img
                src={documentImage}
                alt='Document'
                className='max-h-64 rounded-lg border object-contain'
              />
            </div>
          )}
          <div className='grid gap-2 sm:grid-cols-2'>
            {fieldKeys.map((key) => {
              const value = fields[key];
              if (value == null || value === "") return null;
              return (
                <div key={key} className='text-sm'>
                  <span className='text-muted-foreground font-medium'>
                    {tFields(key)}:
                  </span>{" "}
                  {value}
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type='button' onClick={onConfirm}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
