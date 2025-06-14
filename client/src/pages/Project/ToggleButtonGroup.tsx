import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ToggleButtonGroupProps = {
  options: Array<{ name: string; note?: string; documentation?: string }>;
  selected: string[] | string;
  setSelected: (value: string | string[] | ((prev: string | string[]) => string | string[])) => void;
  multi?: boolean;
};

const ToggleButtonGroup = ({ options, selected, setSelected, multi = false }: ToggleButtonGroupProps) => {
  const handleClick = (option: string) => {
    if (multi) {
      const selectedArray = selected as string[];
      if (selectedArray.includes(option)) {
        setSelected(selectedArray.filter((item) => item !== option));
      } else {
        setSelected([...selectedArray, option]);
      }
    } else {
      // Toggle off if selected again
      setSelected(selected === option ? "" : option);
    }
  };

  const isSelected = (option: string) => {
    return multi ? (selected as string[]).includes(option) : selected === option;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Button
          key={opt.name}
          type="button"
          variant={isSelected(opt.name) ? "default" : "outline"}
          className={cn("rounded-full px-6 py-5", isSelected(opt.name) && "bg-black text-white")}
          onClick={() => handleClick(opt.name)}
        >
          <div className="flex flex-col items-center leading-tight">
            <span className="font-medium text-md truncate">{opt.name}</span>
            {opt.note && <span className="text-xs text-gray-400">{opt.note}</span>}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ToggleButtonGroup;
