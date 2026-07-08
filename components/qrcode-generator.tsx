"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";

const SIZE_OPTIONS = [
  { label: "Small", value: 160 },
  { label: "Medium", value: 240 },
  { label: "Large", value: 320 },
];

export function QRCodeGenerator({ resourceId }: { resourceId: string }) {
  const [submittedValue, setSubmittedValue] = useState("");
  const [size, setSize] = useState(240);

  useEffect(() => {
    const handleGenerate = () => {
      if (resourceId.trim()) {
        setSubmittedValue(resourceId.trim());
      }
    };

    handleGenerate()
  }, [resourceId])

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="w-full max-w-sm">

        {/* <ButtonGroup className="flex justify-end w-">
          {SIZE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={"outline"}
              size="sm"
              onClick={() => setSize(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup> */}

        {submittedValue && (
          <div className="flex justify-center border rounded-md p-2">
            <QRCodeSVG
              id="qr-code-svg"
              value={submittedValue}
              size={size}
              level="M"
              marginSize={2}
            />
          </div>
        )}

      {/* {submittedValue && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </CardFooter>
      )} */}
    </div>
  );
}