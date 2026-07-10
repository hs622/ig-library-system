interface QrScannerViewfinderProps {
  /** Whether to show the moving scan line (true while actively decoding frames). */
  active?: boolean;
}

export function QrScannerViewfinder({ active = true }: QrScannerViewfinderProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-56 w-56">
        <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-md border-l-2 border-t-2 border-white/90" />
        <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-md border-r-2 border-t-2 border-white/90" />
        <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-md border-b-2 border-l-2 border-white/90" />
        <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-md border-b-2 border-r-2 border-white/90" />

        {active && (
          <span
            className="absolute left-0 right-0 h-0.5 bg-emerald-400/90"
            style={{
              boxShadow: "0 0 8px 2px rgba(52, 211, 153, 0.6)",
              animation: "qr-scan-line 2s ease-in-out infinite",
            }}
          />
        )}

        <style>{`
          @keyframes qr-scan-line {
            0% { top: 4%; }
            50% { top: 94%; }
            100% { top: 4%; }
          }
        `}</style>
      </div>
    </div>
  );
}