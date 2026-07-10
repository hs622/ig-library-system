"use client";

import { useCameraStream } from "@/hooks/useCameraStream";
import { useQrScanner } from "@/hooks/useQRSanner";
import React, { useCallback, useState } from "react";
import { QrScannerViewfinder } from "./qr-scanner-view-finder";
import { QrScannerStatus } from "./qr-scanner-status";

interface QrCodeReaderProps {
  /** Called with the decoded string every time a QR code is successfully read. */
  paused: boolean;
  onScan: (value: string) => void;
  facingMode?: "user" | "environment";
  /** Pause scanning after a hit until the user chooses to scan again. Defaults to true. */
  pauseAfterScan?: boolean;
  className?: string;
}

export default function QrCodeReader({
  onScan,
  facingMode = "environment",
  pauseAfterScan = true,
  className = "",
}: QrCodeReaderProps) {
  const { videoRef, status, errorMessage, start } = useCameraStream({ facingMode });
  const [paused, setPaused] = useState(false);

  const handleResult = useCallback(
    (value: string) => {
      onScan(value);
      if (pauseAfterScan) setPaused(true);
    },
    [onScan, pauseAfterScan],
  );

  const { isScanning } = useQrScanner({
    videoRef,
    active: status === "granted" && !paused,
    onResult: handleResult,
  });

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

        {status === "granted" && !paused && <QrScannerViewfinder active={isScanning} />}

        <QrScannerStatus status={status} errorMessage={errorMessage} onRetry={start} />
      </div>
    </div>
  );
}