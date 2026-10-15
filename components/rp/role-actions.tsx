"use client";

import { createRole } from "@/app/actions/mutation/create.role";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { useCreateDialog } from "@/store/use-create-dialog-store";
import { RoleFormSchema, type RoleFormValues } from "@/types/role-form.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

interface PermissionOption {
  id: string;
  title: string;
  module: string;
  action: string;
}

export function RoleActions({ permissions }: { permissions: PermissionOption[] }) {
  const isOpen = useCreateDialog((state) => state.isOpen);
  const resource = useCreateDialog((state) => state.resource);
  const closeDialog = useCreateDialog((state) => state.closeDialog);
  const router = useRouter();
  const permissionComboboxAnchor = useComboboxAnchor();
  const isRoleDialogOpen = isOpen && resource?.dialog === "add-role";

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      level: 1,
      status: false,
      permissionIds: [],
    },
  });

  const title = useWatch({ control, name: "title" });
  useEffect(() => {
    const slug = title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", slug, { shouldValidate: true });
  }, [title, setValue]);

  function closeRoleDialog() {
    reset();
    closeDialog();
  }

  async function onSubmit(values: RoleFormValues) {
    try {
      const response = await createRole(values);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      closeRoleDialog();
      router.refresh();
    } catch (error) {
      console.error("[RoleActions]", error);
      toast.error("Failed to create role. Please try again.");
    }
  }

  return (
    <>
      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeRoleDialog();
        }}
      >

        <DialogContent className="overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add new role</DialogTitle>
            <DialogDescription>
              Configure a role and choose at least one permission.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="role-title">Title</FieldLabel>
              <Input
                id="role-title"
                maxLength={250}
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="role-slug">Slug</FieldLabel>
              <Input
                id="role-slug"
                readOnly={true}
                aria-invalid={!!errors.slug}
                {...register("slug")}
              />
              <FieldError>{errors.slug?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="role-level">Level</FieldLabel>
              <Input
                id="role-level"
                type="number"
                min={1}
                step={1}
                aria-invalid={!!errors.level}
                {...register("level", { valueAsNumber: true })}
              />
              <FieldError>{errors.level?.message}</FieldError>
            </Field>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Field className="flex-row items-center justify-between">
                  <FieldLabel htmlFor="role-status">Visible</FieldLabel>
                  <Switch
                    id="role-status"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="permissionIds"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Permissions</FieldLabel>
                  <Combobox
                    multiple
                    items={permissions.map((permission) =>  permission.id)}
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                  >
                    <ComboboxChips
                      ref={permissionComboboxAnchor}
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <ComboboxValue>
                        {(values) => (
                          <>
                            {values.map((id: string) => {
                              const permission = permissions.find((item) => item.id === id);
                              return (
                                <ComboboxChip key={id}>
                                  {permission
                                    ? `${permission.module}:${permission.action}`
                                    : id}
                                </ComboboxChip>
                              );
                            })}
                            <ComboboxChipsInput
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              placeholder="Select permissions..."
                            />
                          </>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={permissionComboboxAnchor}>
                      <ComboboxEmpty>No permissions found.</ComboboxEmpty>
                      <ComboboxList>
                        {(id: string) => {
                          const permission = permissions.find((item) => item.id === id);
                          return (
                            <ComboboxItem key={id} value={id}>
                              {permission
                                ? `${permission.module}:${permission.action}`
                                : id}
                            </ComboboxItem>
                          );
                        }}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="role-description">Description (optional)</FieldLabel>
              <Textarea
                id="role-description"
                maxLength={300}
                className="resize-none"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeRoleDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={isSubmitting || permissions.length === 0}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                Create role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
