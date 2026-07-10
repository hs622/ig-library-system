"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import jsQR from "jsqr";

interface UseQrScannerOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Scanning only runs while this is true (e.g. camera granted and not paused). */
  active: boolean;
  /** Called once per successfully decoded frame. The loop stops after a hit. */
  onResult: (value: string) => void;
  /** Minimum ms between decode attempts, to keep CPU usage reasonable. */
  scanIntervalMs?: number;
}

interface UseQrScannerResult {
  isScanning: boolean;
}

export function useQrScanner({
  videoRef,
  active,
  onResult,
  scanIntervalMs = 150,
}: UseQrScannerOptions): UseQrScannerResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScanRef = useRef(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: requesting camera on mount
      setIsScanning(false);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    setIsScanning(true);

    const tick = (timestamp: number) => {
      const video = videoRef.current;

      if (
        video &&
        context &&
        video.readyState === video.HAVE_ENOUGH_DATA &&
        timestamp - lastScanRef.current >= scanIntervalMs
      ) {
        lastScanRef.current = timestamp;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code?.data) {
          onResult(code.data);
          return; // stop the loop; caller decides whether/when to restart via `active`
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsScanning(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, scanIntervalMs]);

  return { isScanning };
}