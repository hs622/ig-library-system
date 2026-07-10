"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export type CameraStreamStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "error"
  | "unsupported";

interface UseCameraStreamOptions {
  /** Preferred facing mode. "environment" (rear camera) is the sensible default for scanning. */
  facingMode?: "user" | "environment";
  /** Request the camera as soon as the hook mounts. Defaults to true. */
  autoStart?: boolean;
}

interface UseCameraStreamResult {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: CameraStreamStatus;
  errorMessage: string | null;
  start: () => void;
  stop: () => void;
}

export function useCameraStream({
  facingMode = "environment",
  autoStart = true,
}: UseCameraStreamOptions = {}): UseCameraStreamResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStreamStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const start = useCallback(async () => {
    setErrorMessage(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });

      streamRef.current = stream;
      setStatus("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      const domError = err as DOMException;

      if (domError.name === "NotAllowedError" || domError.name === "PermissionDeniedError") {
        setStatus("denied");
        setErrorMessage("Camera access was denied. Please allow camera permission in your browser settings.");
      } else if (domError.name === "NotFoundError") {
        setStatus("error");
        setErrorMessage("No camera device was found.");
      } else if (domError.name === "NotReadableError") {
        setStatus("error");
        setErrorMessage("The camera is already in use by another application.");
      } else {
        setStatus("error");
        setErrorMessage(domError.message || "An unknown error occurred while accessing the camera.");
      }
    }
  }, [facingMode]);

  useEffect(() => {
    if (autoStart) {
      // Deferred so the initial setState calls aren't seen as synchronous
      // state updates directly inside the effect body.
      queueMicrotask(() => {
        start();
      });
    }

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, status, errorMessage, start, stop };
}