// import { Button } from "@/components/ui/button";
// import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
// import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
import AddBook from "./forms/add-book-form";

export default function Page() {

  return (
    <div className="mt-10 max-w-6xl m-auto">
      <div className="md:p-4 lg:grid lg:grid-cols-3 lg:gap-4">
        {/* <AddcategoryForm /> */}
        <div className="flex flex-col pb-6">
          <h1 className="font-semibold">Book Ingestion</h1>
          <span className="text-sm">Book and author insertion form.</span>
        </div>
        <div className={"lg:col-span-2"}>
          <AddBook />
        </div>
      </div>
    </div>
  )
}

// function AddABook() {

//   return (
//     <div className={"flex flex-col gap-6"}>
//       <div className={"max-h-fit"}>
//         <FieldLegend>Book Details</FieldLegend>
//         <FieldDescription>
//           Book with author and other details.
//         </FieldDescription>
//       </div>
//       <div className={"grid grid-cols-2 gap-4"}>
//         <FieldGroup>
//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               Title
//             </FieldLabel>
//             <Input
//               id="checkout-7j9-card-name-43j"
//               placeholder="Book name"
//               required
//             />
//           </Field>
//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               Edition
//             </FieldLabel>
//             <Input id="checkout-7j9-card-name-43j" />
//           </Field>
//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               Language
//             </FieldLabel>
//             <Input
//               id="checkout-7j9-card-name-43j"
//             />
//           </Field>
//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
//               Short description (optional)
//             </FieldLabel>
//             <FieldDescription>
//               About the book and the author.
//             </FieldDescription>
//             <Textarea className="resize-none h-24"></Textarea>
//           </Field>
//         </FieldGroup>

//         <FieldGroup>
//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               Author Name
//             </FieldLabel>
//             <Input
//               id="checkout-7j9-card-name-43j"
//               placeholder="author full name"
//               required
//             />
//           </Field>

//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               ISBN 13 (optional)
//             </FieldLabel>
//             <InputGroup>
//               <InputGroupAddon>
//                 <InputGroupText>ISBN</InputGroupText>
//               </InputGroupAddon>
//               <InputGroupInput placeholder="123-1-123-12345-1" className="pl-0.5!" />
//             </InputGroup>
//           </Field>
//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               ISBN 10 (optional)
//             </FieldLabel>
//             <InputGroup>
//               <InputGroupAddon>
//                 <InputGroupText>ISBN</InputGroupText>
//               </InputGroupAddon>
//               <InputGroupInput placeholder="123-1-123-1234" className="pl-0.5!" />
//             </InputGroup>
//           </Field>

//           <Field>
//             <FieldLabel htmlFor="checkout-7j9-card-name-43j">
//               Publisher Name
//             </FieldLabel>
//             <Input
//               id="checkout-7j9-card-name-43j"
//               required
//             />
//           </Field>
//         </FieldGroup>
//       </div>
//       <Separator />

//       <div>
//         <Field orientation="horizontal">
//           <Button type="submit">Save</Button>
//           <Button variant="outline" type="button">
//             Cancel
//           </Button>
//         </Field>
//       </div>
//     </div>
//   )
// }