import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";

export default function Page() {
  return (
    <div className="grid grid-cols-12 w-full">
      {/* Book Search engine
        Statictis (Books, Categories, members, e-content) */}

      <div className="col-span-8 flex justify-center items-center h-screen w-full">
        Search Box
      </div>
      {/* <Separator className="col-start-9" orientation="vertical" /> */}
      <div className="col-start-10 col-span-3 w-full flex flex-col gap-4">
        <div className="leading-6">
          <div className="text-[16px] font-bold">Activity</div>
          <small>Lorem, ipsum dolor.</small>
        </div>

        <div className="pr-4">
          <Accordion type="single" className="max-w-lg">
            <AccordionItem value="hello">
              <AccordionTrigger>What&apos;s in your mind?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum aliquid eaque repellat dolores!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="next-step">
              <AccordionTrigger  >What should be a next step?</AccordionTrigger>
              <AccordionContent>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius modi amet nulla rerum. Cum ipsam ratione quod tenetur! Ducimus illum repellat nihil optio deserunt cumque autem rerum, iure expedita distinctio tenetur ipsa?
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="next-step-2">
              <AccordionTrigger  >What should be a next step?</AccordionTrigger>
              <AccordionContent>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius modi amet nulla rerum. Cum ipsam ratione quod tenetur! Ducimus illum repellat nihil optio deserunt cumque autem rerum, iure expedita distinctio tenetur ipsa?
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="next-step-3">
              <AccordionTrigger  >What should be a next step?</AccordionTrigger>
              <AccordionContent>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius modi amet nulla rerum. Cum ipsam ratione quod tenetur! Ducimus illum repellat nihil optio deserunt cumque autem rerum, iure expedita distinctio tenetur ipsa?
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}