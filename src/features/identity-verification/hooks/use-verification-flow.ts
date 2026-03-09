"use client";

import { useCallback, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  DocumentValidator,
  getSession,
  setSession,
  clearSession,
  DEFAULT_DOCUMENT_VALIDATION,
  VerifyOcrErrorCode,
  type DocumentType,
  type VerificationSessionData,
  type VerifyOcrErrorCodeType,
} from "@/core/verify-ocr";

const documentValidator = new DocumentValidator(DEFAULT_DOCUMENT_VALIDATION);

/** OCR and verification use only Mistral AI APIs (no Tesseract / face-api). Requires MISTRAL_API_KEY. */
export type VerificationStep = 1 | 2 | 3;

export function useVerificationFlow() {
  const [step, setStep] = useState<VerificationStep>(1);
  const [session, setSessionState] = useState<VerificationSessionData | null>(
    null
  );
  const [pendingConfirmDocument, setPendingConfirmDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<VerifyOcrErrorCodeType | null>(
    null
  );

  const loadSession = useCallback(() => {
    const data = getSession();
    setSessionState(data);
    // If we have document data but no selfie yet, show confirm modal so user can OK → step 2
    if (data?.referenceFaceDataUrl && !data?.selfieDataUrl) {
      setPendingConfirmDocument(true);
    }
    return data;
  }, []);

  const clearError = useCallback(() => setErrorCode(null), []);

  const runOcr = useCallback(
    async (file: File, documentType: DocumentType = "id_card") => {
      setErrorCode(null);
      const validation = documentValidator.validate(file);
      if (!validation.valid) {
        setErrorCode(VerifyOcrErrorCode.ERR_FORMAT);
        return;
      }

      setLoading(true);
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const documentDataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.onerror = () => reject(r.error);
          r.readAsDataURL(compressed);
        });

        const res = await fetch("/api/identity-verification/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: documentDataUrl }),
        });

        if (res.status === 503) {
          await res.json().catch(() => ({}));
          setErrorCode(VerifyOcrErrorCode.ERR_INVALID_DOC);
          return;
        }
        if (!res.ok) {
          setErrorCode(VerifyOcrErrorCode.ERR_INVALID_DOC);
          return;
        }

        const data = (await res.json()) as {
          rawText?: string;
          fields?: Record<string, string | null>;
        };
        const ocrResult = {
          rawText: data.rawText ?? "",
          fields: {
            fullName: null,
            idNumber: null,
            dateOfBirth: null,
            expiryDate: null,
            ...data.fields,
          },
          referenceFaceDataUrl: documentDataUrl,
          hasFace: true,
        };

        const sessionData: VerificationSessionData = {
          documentType,
          ocrResult,
          documentImageDataUrl: documentDataUrl,
          referenceFaceDataUrl: documentDataUrl,
          createdAt: new Date().toISOString(),
        };
        setSession(sessionData);
        setSessionState(sessionData);
        setPendingConfirmDocument(true);
      } catch {
        setErrorCode(VerifyOcrErrorCode.ERR_INVALID_DOC);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const runFaceMatch = useCallback(async (captureDataUrl: string) => {
    const current = getSession();
    if (!current?.referenceFaceDataUrl) {
      setErrorCode(VerifyOcrErrorCode.ERR_INVALID_DOC);
      return;
    }

    setErrorCode(null);
    setLoading(true);
    try {
      const res = await fetch("/api/identity-verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceImage: current.referenceFaceDataUrl,
          captureImage: captureDataUrl,
        }),
      });

      if (res.status === 429) {
        setErrorCode(VerifyOcrErrorCode.ERR_RATE_LIMIT);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        matched?: boolean;
        similarity?: number;
        error?: string;
      };
      if (res.status === 500 && data?.error && /rate limit/i.test(data.error)) {
        setErrorCode(VerifyOcrErrorCode.ERR_RATE_LIMIT);
        return;
      }
      if (res.status === 503) {
        setErrorCode(VerifyOcrErrorCode.ERR_NO_FACE_IN_FRAME);
        return;
      }
      if (!res.ok) {
        setErrorCode(VerifyOcrErrorCode.ERR_NO_FACE_IN_FRAME);
        return;
      }
      const matchResult = {
        matched: data.matched ?? false,
        similarity: typeof data.similarity === "number" ? data.similarity : 0,
      };
      const updated: VerificationSessionData = {
        ...current,
        selfieDataUrl: captureDataUrl,
        faceMatchResult: matchResult,
      };
      setSession(updated);
      setSessionState(updated);
      setStep(3);
    } catch {
      setErrorCode(VerifyOcrErrorCode.ERR_NO_FACE_IN_FRAME);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    clearSession();
    setSessionState(null);
    setStep(1);
    setPendingConfirmDocument(false);
    setErrorCode(null);
  }, []);

  const confirmDocumentAndGoToStep2 = useCallback(() => {
    setPendingConfirmDocument(false);
    setStep(2);
  }, []);

  const cancelDocumentConfirm = useCallback(() => {
    setPendingConfirmDocument(false);
    clearSession();
    setSessionState(null);
  }, []);

  return {
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
  };
}
