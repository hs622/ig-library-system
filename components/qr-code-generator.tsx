"use client";

import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  sequence: string; // The sequence string to display vertically (e.g., "123456")
  size?: number;    // Initial/default size of the QR code
}

export default function QRCodeWithSequence({ value, sequence, size = 256 }: QRCodeProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [qrSize, setQrSize] = useState<number>(size);
  const [inputValue, setInputValue] = useState<string>(String(size));

  // Layout calculations (derived from current qrSize, not the original prop)
  const textWidth = 60; // Space allocated for the vertical number column
  const totalWidth = qrSize + textWidth;
  const totalHeight = qrSize;

  const MIN_SIZE = 64;
  const MAX_SIZE = 1024;

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    const parsed = Number(raw);
    if (!raw || Number.isNaN(parsed)) return;

    const clamped = Math.min(MAX_SIZE, Math.max(MIN_SIZE, parsed));
    setQrSize(clamped);
  };

  const handleSizeBlur = () => {
    // Snap the visible input back to whatever the clamped value actually is
    setInputValue(String(qrSize));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white shadow-md border w-fit print:shadow-none print:border-none">

      {/* Controls - hidden when printing */}
      <div className="flex items-end gap-3 print:hidden">
        <div className="flex flex-col gap-1">
          <label htmlFor="qr-size" className="text-sm font-medium text-gray-700">
            QR Size (px)
          </label>
          <input
            id="qr-size"
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={inputValue}
            onChange={handleSizeChange}
            onBlur={handleSizeBlur}
            className="border rounded-md px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 border hover:bg-gray-50 bg-white font-medium rounded-lg transition-colors text-sm"
        >
          Print
        </button>
      </div>

      {/* Master SVG Canvas */}
      <svg
        ref={containerRef}
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* White Background for the entire layout */}
        <rect width={totalWidth} height={totalHeight} fill="#ffffff" />

        {/* Left Side: Vertical Text Sequence */}
        <text
          x={textWidth / 2}
          y={totalHeight / 2 - 10}
          fill="#000000"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace, sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90, ${textWidth / 2}, ${totalHeight / 2})`}
          letterSpacing="4"
        >
          {sequence}
        </text>

        {/* Right Side: Embedded QR Code */}
        <g transform={`translate(${textWidth}, 0)`}>
          <QRCodeSVG
            value={value}
            size={qrSize}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false} // False allows better manual alignment control
          />
        </g>
      </svg>

      {/* Print-only styling: hide everything except this component when printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden,
          .print\\:hidden * {
            visibility: hidden !important;
          }
          svg,
          svg * {
            visibility: visible;
          }
          svg {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}