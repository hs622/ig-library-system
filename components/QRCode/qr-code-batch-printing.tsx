"use client";

import React, { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { Button } from "../ui/button";

// Returns true only once the component is running on the client,
// without needing a useEffect + setState round-trip.
function useIsClient() {
  return useSyncExternalStore(
    () => () => { }, // subscribe: no-op, this "external store" never changes
    () => true,     // getSnapshot: on the client, it's always true
    () => false     // getServerSnapshot: during SSR, it's always false
  );
}

interface QRBatchPrintProps {
  resourceIds: string[];
  resourceTags: string[];
  size?: number;
  columns?: number;
}

export default function QRBatchPrint({
  resourceIds,
  resourceTags,
  size = 100,
  columns = 6,
}: QRBatchPrintProps) {
  const [qrSize, setQrSize] = useState<number>(size);
  const [cols, setCols] = useState<number>(columns);
  const [sizeInput, setSizeInput] = useState<string>(String(size));
  const [colsInput, setColsInput] = useState<string>(String(columns));
  const isClient = useIsClient();

  const MIN_SIZE = 48;
  const MAX_SIZE = 512;
  const MIN_COLS = 1;
  const MAX_COLS = 8;
  const TEXT_WIDTH = 32;

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeInput(e.target.value);
    const parsed = Number(e.target.value);
    if (e.target.value && !Number.isNaN(parsed)) {
      setQrSize(Math.min(MAX_SIZE, Math.max(MIN_SIZE, parsed)));
    }
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColsInput(e.target.value);
    const parsed = Number(e.target.value);
    if (e.target.value && !Number.isNaN(parsed)) {
      setCols(Math.min(MAX_COLS, Math.max(MIN_COLS, parsed)));
    }
  };

  const handlePrint = () => window.print();

  const totalWidth = qrSize + TEXT_WIDTH;
  const totalHeight = qrSize;

  const grid = (
    <div
      id="qr-grid" 
      style={{ 
        width: "fit",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "16px",
      }}
    >
      {resourceIds.map((item, i) => (
        <div
          key={`${item}-${i}`}
          className="qr-cell"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            breakInside: "avoid",
          }}
        >
          <svg
            width={totalWidth}
            height={totalHeight}
            viewBox={`0 0 ${totalWidth} ${totalHeight}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width={totalWidth} height={totalHeight} fill="#ffffff" />

            <text
              x={TEXT_WIDTH / 2}
              y={totalHeight / 2 - 10}
              fill="#000000"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace, sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
              letterSpacing="2"
              transform={`rotate(-90, ${TEXT_WIDTH / 2}, ${totalHeight / 2})`}
            >
              {resourceTags[i]}
            </text>

            <g transform={`translate(${TEXT_WIDTH}, 0)`}>
              <QRCodeSVG
                value={item}
                size={qrSize}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* headers */}
      <div id="qr-controls" className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label htmlFor="qr-size" className="text-sm font-medium text-gray-700">
            QR Size (px)
          </label>
          <input
            id="qr-size"
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={sizeInput}
            onChange={handleSizeChange}
            className="border rounded-md px-3 py-2 text-sm w-24"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="qr-cols" className="text-sm font-medium text-gray-700">
            Columns
          </label>
          <input
            id="qr-cols"
            type="number"
            min={MIN_COLS}
            max={MAX_COLS}
            value={colsInput}
            onChange={handleColsChange}
            className="border rounded-md px-3 py-2 text-sm w-24"
          />
        </div>

        <Button
          variant={"outline"}
          onClick={handlePrint}
        >
          <Printer />
        </Button>
      </div>

      <div id="qr-preview">{grid}</div>

      {isClient &&
        createPortal(
          <div id="qr-print-only">{grid}</div>,
          document.body
        )}

      <style jsx global>{`
        #qr-print-only {
          display: none;
        }

        @media print {
          /* Hide only top-level siblings of the print container.
             We never select #qr-print-only's own descendants, so their
             inline grid/flex styles are left completely untouched. */
          body > *:not(#qr-print-only) {
            display: none !important;
          }

          #qr-print-only {
            display: block !important;
            position: static;
            width: 100%;
          }

          .qr-cell {
            break-inside: avoid;
          }

          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}