import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col justify-between">
        <h1 className="text-3xl font-bold">IG Library System</h1>
        <Button variant={"link"} className="cursor-pointer" asChild>
          <Link href="/temp" >
            Process to dashboard
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
