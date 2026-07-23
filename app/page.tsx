"use client";

import { Button } from "@/components/ui/button";
import { useBookCount } from "@/hooks/use-bookCount";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; 
import { useEffect, useState } from "react";

const LIBRARY_NAME = "Inaara Gardan Library";

function useTypewriter(text: string, speed = 90) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setDisplay(text)
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { display, done };
}

const services = () => [
  { label: "Become a member", href: `/g/new-account`, hue: "#6B7A3D" },
  // { label: "Get book details", href: `/g/book-finder`, hue: "#8A9A5B" },
  { label: "Announcements", href: "/g/accouncements", hue: "#4E5B2E" },
  { label: "Book Cataglog", href: "/g/book-catalog", hue: "#8A9A5B" },
];

export default function Home() {
  const { count, status } = useBookCount();
  
  const { display, done } = useTypewriter(LIBRARY_NAME);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 sm:px-10 md:py-24"
      style={{ backgroundColor: "#F1E9D2" }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left: hero */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* <span
            className="text-[11px] tracking-[0.35em] uppercase font-mono"
            style={{ color: "#8A7A4E" }}
          >
            Est. Library System
          </span> */}

          <div className="flex items-center">

            <div className={"max-h-80  overflow-hidden"}>
              {/* <Image 
                alt="girl"
                src={"/girl.png"} 
                width={600}
                height={800}
                className="object-cover"
              /> */}
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="text-xl sm:text-2xl italic font-serif"
                style={{ color: "#4E5B2E" }}
              >
                Welcome to
              </span>
              <h1
                className="font-serif font-semibold leading-[1.08] break-words"
                style={{
                  color: "#2C2A20",
                  fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
                }}
              >
                {display}
                <span
                  className={`inline-block w-[2px] sm:w-[3px] h-[0.85em] ml-1 align-middle bg-[#4E5B2E] ${done ? "animate-pulse" : ""
                    }`}
                />
              </h1>
            </div>
          </div>


          {/* <p
            className="text-base sm:text-lg leading-relaxed max-w-md"
            style={{ color: "#5C5644" }}
          >
            {status === "loading" && "Counting the shelves…"}
            {status === "error" && "Catalogue temporarily unavailable."}
            {status === "success" &&
              `${count?.toLocaleString()} volumes catalogued and counting.`}
          </p> */}
        </div>

        {/* Right: services, styled as book spines */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] tracking-[0.35em] uppercase font-mono"
              style={{ color: "#8A7A4E" }}
            >
              Services
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "#C9BE9A" }} />
          </div>

          {services().map((service) => (
            <Button
              key={service.label}
              variant="outline"
              asChild
              className="group h-auto justify-start gap-4 border-none shadow-none py-5 sm:py-6 pl-4 sm:pl-5 pr-5 sm:pr-6 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: "#E8DFC4" }}
            >
              <Link href={service.href} className="flex items-center gap-4 w-full">
                <span
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: service.hue }}
                />
                <span
                  className="text-lg sm:text-xl font-serif flex-1 text-left"
                  style={{ color: "#2C2A20" }}
                >
                  {service.label}
                </span>
                <ArrowRight
                  size={18}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                  style={{ color: "#4E5B2E" }}
                />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}