"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CameraStatus = "idle" | "requesting" | "granted" | "denied" | "error" | "unsupported";

interface CameraAccessProps {
  /** Preferred facing mode. Defaults to "user" (front camera). */
  facingMode?: "user" | "environment";
  /** Called with the active MediaStream once permission is granted. */
  onStreamReady?: (stream: MediaStream) => void;
  /** Called when the stream is stopped (unmount or manual stop). */
  onStreamStop?: () => void;
  className?: string;
}

export default function CameraAccess({
  facingMode = "user",
  onStreamReady,
  onStreamStop,
  className = "",
}: CameraAccessProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    onStreamStop?.();
  }, [onStreamStop]);

  const requestCamera = useCallback(async () => {
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

      onStreamReady?.(stream);
    } catch (err) {
      const domError = err as DOMException;

      if (
        domError.name === "NotAllowedError" ||
        domError.name === "PermissionDeniedError"
      ) {
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
  }, [facingMode, onStreamReady]);

  // Request camera access automatically on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: requesting camera on mount
    requestCamera();

    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />

        {status !== "granted" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-4 text-center text-sm text-white">
            {status === "idle" && "Camera preview will appear here."}
            {status === "requesting" && "Requesting camera access…"}
            {status === "denied" && (errorMessage ?? "Camera access denied.")}
            {status === "error" && (errorMessage ?? "Something went wrong.")}
            {status === "unsupported" && "Camera access is not supported in this browser."}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {status === "granted" && (
          <button
            type="button"
            onClick={() => {
              stopStream();
              setStatus("idle");
            }}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Stop Camera
          </button>
        )}

        {(status === "denied" || status === "error") && (
          <button
            type="button"
            onClick={requestCamera}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}