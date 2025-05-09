import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ToolTip({
  children,
  tooltipText,
  tooltipSide,
}: {
  children: React.ReactNode;
  tooltipText: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={tooltipSide}
          className="w-fit h-8 flex items-center justify-center text-[12px] font-medium"
        >
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
