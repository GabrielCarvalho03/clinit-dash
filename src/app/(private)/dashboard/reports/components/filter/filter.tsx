import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterProps = {
  label?: string;
  htmlfor?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
};

export const Filter = ({
  label,
  value,
  options,
  htmlfor,
  placeholder,
  onValueChange,
}: FilterProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={htmlfor}>{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={htmlfor}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((options, index) => (
            <SelectItem key={index} value={options.value}>
              {options.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
