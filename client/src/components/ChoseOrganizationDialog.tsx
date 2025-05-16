import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

type ChoseOrganizationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  organizations: Array<{ id: string; name: string; slug: string }>;
};

export const ChoseOrganizationDialog = ({ open, setOpen, organizations }: ChoseOrganizationDialogProps) => {
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chose an Organization</DialogTitle>
          <DialogDescription>
            To create a project, please choose one of your available organizations from the list below.
          </DialogDescription>
        </DialogHeader>

        <Popover open={comboBoxOpen} onOpenChange={setComboBoxOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {value
                ? organizations.find((organization) => organization.slug === value)?.name
                : "Select organization..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search organization..." />
              <CommandList>
                <CommandEmpty>No organization found.</CommandEmpty>
                <CommandGroup>
                  {organizations.map((organization) => (
                    <CommandItem
                      key={organization.name}
                      value={organization.slug}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setComboBoxOpen(false);
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", value === organization.slug ? "opacity-100" : "opacity-0")}
                      />
                      {organization.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {value && (
          <div className="mt-4">
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => {
                navigate(`/organizations/${value}/projects/create`);
              }}
            >
              Create a project in {organizations.find((org) => org.slug === value)?.name}
            </Button>
          </div>
        )}

        <DialogFooter className="sm:justify-start mt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
