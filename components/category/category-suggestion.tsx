"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/hooks/use-categories";

const SELECT = "_id,title" as const;

interface CategorySuggestionDropdownProps {
  /** Either an existing category id, or a new free-text name */
  value?: string;
  onChange: (value: string, meta: { isNew: boolean }) => void;
  placeholder?: string;
  disabled?: boolean;
  minSearchLength?: number
}

export function CategorySuggestionDropdown({
  value,
  onChange,
  placeholder = "Search or create category...",
  disabled,
  minSearchLength = 1
}: CategorySuggestionDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { categories, isLoading, error } = useCategories<typeof SELECT>({
    params: { type: "parent", select: SELECT },
    search,
    enabled: open,
  });

  const options = categories ?? [];

  // Trigger label: if value matches a fetched id show its name,
  // otherwise fall back to the raw value (covers the "new string" case,
  // and the initial render before that id's name has been fetched).
  const selectedOption = options.find((c) => c._id === value);
  const displayLabel = selectedOption?.title ?? value ?? "";

  const trimmedSearch = search.trim();
  const exactMatch = options.some(
    (c) => c.title.toLowerCase() === trimmedSearch.toLowerCase()
  );
  const canCreate = trimmedSearch.length > 0 && !exactMatch;

  function handleSelect(option: { _id: string; title: string }) {
    onChange(option._id, { isNew: false });
    setOpen(false);
    setSearch("");
  }

  function handleCreate() {
    if (!trimmedSearch) return;
    onChange(trimmedSearch, { isNew: true });
    setOpen(false);
    setSearch("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !displayLabel && "text-muted-foreground")}>
            {displayLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Type to search..."
          />
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {!isLoading && error && (
              <div className="py-6 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {!isLoading && !error && (
              <React.Fragment>
                <CommandEmpty>
                  {trimmedSearch.length >= minSearchLength
                    ? "No matching categories."
                    : `Type at least ${minSearchLength} character${minSearchLength === 1 ? "" : "s"} to search.`}
                </CommandEmpty>

                {options.length > 0 && (
                  <CommandGroup heading="Existing categories">
                    {options.map((option) => (
                      <CommandItem
                        key={option._id}
                        value={option._id}
                        onMouseDown={(e) => e.preventDefault()}
                        onSelect={() => handleSelect(option)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option._id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {canCreate && (
                  <CommandGroup heading="Create new">
                    <CommandItem
                      value={`__create__${trimmedSearch}`}
                      onSelect={handleCreate}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {`Create ${trimmedSearch}`}
                    </CommandItem>
                  </CommandGroup>
                )}
              </React.Fragment>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}