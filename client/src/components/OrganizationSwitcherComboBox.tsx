import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCommonDataStore } from "@/stores/useCommonDataStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function OrganizationSwitcherComboBox() {
  const { organizations, selectedOrg } = useCommonDataStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selectedOrg.slug
            ? organizations.find((framework) => framework.slug === selectedOrg.slug)?.name
            : "Select organization"}
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
                    navigate(`/organizations/${currentValue}`);
                    setOpen(false);
                  }}
                >
                  {framework.name}
                  <Check className={cn("ml-auto", selectedOrg.slug === framework.slug ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
