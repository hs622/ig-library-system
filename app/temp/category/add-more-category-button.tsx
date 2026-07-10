"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubCategory } from "@/types/add-category-form.zod";
import { IAddCategorySchema } from "@/types/zod";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { Control, Controller, ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { v4 as uuidv4 } from "uuid"

interface AddMoreCategoryProps {
  control: Control<IAddCategorySchema>
}

interface FieldRow {
  id: string;
  value: string;
}

export default function AddMoreCategoryInput({ control }: AddMoreCategoryProps) {
  return (
    <Controller
      name="sub_category"
      control={control}
      render={({ field, fieldState }) => (
        <SubCategoryFields field={field} fieldState={fieldState} />
      )}
    />
  )
}

interface SubCategoryFieldsProps {
  field: ControllerRenderProps<IAddCategorySchema, "sub_category">
  fieldState: ControllerFieldState
}

function SubCategoryFields({ field, fieldState }: SubCategoryFieldsProps) {

  const id = uuidv4();

  const [inputFields, setInputFields] = React.useState<FieldRow[]>(() => {
    const initial = field.value?.length ? field.value : [""];
    return initial.map((v) => ({ id, value: v }))
  });

  const sync = (rows: FieldRow[]) => {
    setInputFields(rows);
    const cleaned = rows.map(r => r.value).filter(v => v.trim().length > 0);
    field.onChange(cleaned.length ? cleaned : undefined)
  }

  const handleAddField = () => {
    sync([...inputFields, { id, value: "" }])
  }

  const handleChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    sync(
      inputFields.map(f => f.id === id ? { ...f, value: event.target.value } : f)
    )
  };

  const handleRemoveField = (id: string) => {
    sync(inputFields.filter(f => f.id !== id));
  };

  return (
    <Field className="gap-0">
      <div className="flex justify-between">
        <Label htmlFor="add-sub-category-form-field">Sub Category</Label>
        <Button type="button" variant={"outline"} onClick={handleAddField}>
          <Plus />
        </Button>
      </div>

      <ScrollArea className="h-75 py-5">
        {inputFields?.map((inputField, index) => {

          const isRowInvalid =
            inputField.value.length > 0 &&
            !SubCategory.safeParse(inputField.value).success;

          return (
            <InputGroup key={inputField.id} className={"not-first:mt-4"}>
              <InputGroupInput
                id={`add-category-form-field-${index}`}
                type="text"
                value={inputField.value}
                onChange={(e) => handleChange(inputField.id, e)}
                aria-invalid={isRowInvalid}
              />
              {inputFields.length > 1 && (
                <InputGroupButton type="button" variant="ghost" size="sm" onClick={() => handleRemoveField(inputField.id)}>
                  <Minus />
                </InputGroupButton>
              )}
            </InputGroup>
          )
        })}
      </ScrollArea>
      {fieldState.invalid && <div className="text-red-400 text-xs">{fieldState.error?.message}</div>}
    </Field>
  )
}