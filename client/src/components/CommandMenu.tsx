import { CreditCard, Settings, User } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect } from "react";
import { SiAwsorganizations } from "react-icons/si";
import { GoProjectSymlink } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCommonDataStore } from "@/stores/useCommonDataStore";

type CommandMenuProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const navigate = useNavigate();
  const { organizations } = useCommonDataStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/organizations");
              }}
            >
              <SiAwsorganizations />
              <span>Organizations</span>
            </CommandItem>

            {organizations.map((org) => (
              <CommandItem
                key={org.id}
                onSelect={() => {
                  setOpen(false);
                  navigate(`/organizations/${org.slug}`);
                }}
              >
                <div className="pl-10">{org.name}</div>
              </CommandItem>
            ))}

            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate("/projects");
              }}
            >
              <GoProjectSymlink />
              <span>Projects</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
