export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { CommandMenu } from "./CommandMenu";

const Search = React.forwardRef<HTMLInputElement, SearchProps>(({ className }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-10 items-center justify-between rounded-md border border-input bg-white pl-3 pr-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200 hover:bg-muted/70",
          className
        )}
      >
        <div className="flex items-center space-x-2">
          <SearchIcon className="h-[16px] w-[16px] text-muted-foreground transition-colors duration-200" />
          <span className="text-muted-foreground font-extralight text-xs transition-colors duration-200 hover:text-foreground">
            Search for resources, orgs, projects...
          </span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
});

Search.displayName = "Search";

export { Search };
