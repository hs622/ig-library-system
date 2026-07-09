"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  sequence: string; // The sequence string to display vertically (e.g., "123456")
  size?: number;    // Size of the QR code itself
}

export default function QRCodeWithSequence({ value, sequence, size = 256 }: QRCodeProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  // Layout calculations
  const textWidth = 60; // Space allocated for the vertical number column
  const totalWidth = size + textWidth;
  const totalHeight = size;

  // const downloadSVG = () => {
  //   if (!containerRef.current) return;

  //   const serializer = new XMLSerializer();
  //   const svgString = serializer.serializeToString(containerRef.current);
  //   const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  //   const svgUrl = URL.createObjectURL(svgBlob);
    
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = svgUrl;
  //   downloadLink.download = `qrcode-${sequence}.svg`;
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  //   URL.revokeObjectURL(svgUrl);
  // };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white shadow-md border w-fit">
      
      {/* Master SVG Canvas */}
      <svg
        ref={containerRef}
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        xmlns="http://w3.org"
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
            size={size}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false} // False allows better manual alignment control
          />
        </g>
      </svg>
      
      {/* <button
        onClick={handlePrint}
        className="mt-2 px-4 py-2 hover:bg-blue-700 bg-white font-medium rounded-lg transition-colors text-sm"
      >
        Print
      </button> */}
    </div>
  );
}
