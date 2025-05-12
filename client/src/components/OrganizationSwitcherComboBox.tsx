"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const organizations = [
  {
    slug: "novo-nordisk",
    name: "Novo Nordisk",
  },
];

export function OrganizationSwitcherComboBox() {
  const [open, setOpen] = React.useState(false);
  const [slug, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {slug ? organizations.find((framework) => framework.slug === slug)?.name : "Select organization"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." className="h-9" />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {organizations.map((framework) => (
                <CommandItem
                  key={framework.slug}
                  value={framework.slug}
                  onSelect={(currentValue) => {
                    setValue(currentValue === slug ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.name}
                  <Check className={cn("ml-auto", slug === framework.slug ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
