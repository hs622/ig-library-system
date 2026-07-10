import { CameraStreamStatus } from "@/hooks/useCameraStream";

interface QrScannerStatusProps {
  status: CameraStreamStatus;
  errorMessage: string | null;
  onRetry: () => void;
}

const STATUS_MESSAGES: Record<CameraStreamStatus, string> = {
  idle: "Camera preview will appear here.",
  requesting: "Requesting camera access…",
  granted: "",
  denied: "Camera access denied.",
  error: "Something went wrong.",
  unsupported: "Camera access is not supported in this browser.",
};

export function QrScannerStatus({ status, errorMessage, onRetry }: QrScannerStatusProps) {
  if (status === "granted") return null;

  const message = errorMessage ?? STATUS_MESSAGES[status];
  const canRetry = status === "denied" || status === "error";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-4 text-center text-sm text-white">
      <p>{message}</p>
      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-white/40 px-3 py-1.5 text-xs font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
}