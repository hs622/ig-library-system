import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";



export default function page() {

  return (
    <React.Fragment>
      <div className="h-screen">
        <div className="flex flex-col justify-center items-center gap-4 h-full">
          <div className="text-2xl ms:text-3xl font-bold uppercase">
            Announcements
          </div>
          <Button variant={"outline"} asChild>
            <Link href={`/`}>
              <MoveLeft /><Home />
            </Link>
          </Button>
        </div>
      </div>
    </React.Fragment>
  )
} 