import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FaSpinner } from "react-icons/fa";

interface ComboboxDefaultProps {
  control: any;
  name: string;
  label?: string;
  selectLabel: string | React.JSX.Element;
  searchLabel: string;
  object: any[] | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?:
    | "destructive"
    | "ghost"
    | "outline"
    | "default"
    | "link"
    | "secondary";
  onSelect: (value: number) => void;
}

export default function ComboboxDefault({
  control,
  name,
  label,
  selectLabel,
  searchLabel,
  object,
  isLoading = false,
  disabled = isLoading ? true : false,
  className,
  buttonVariant = "outline",
  onSelect,
}: ComboboxDefaultProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label ? <FormLabel>{label}</FormLabel> : null}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={buttonVariant}
                  role="combobox"
                  className={cn(
                    "flex justify-between",
                    className,
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    object?.find((item) => item.value == field.value)?.label
                  ) : isLoading ? (
                    <FaSpinner />
                  ) : (
                    selectLabel
                  )}
                  {!isLoading ? <ChevronsUpDown className="size-5" /> : null}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput placeholder={searchLabel} />
                <CommandList>
                  <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                  <CommandGroup>
                    {object?.map((item) => (
                      <CommandItem
                        className="flex gap-2"
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          onSelect(item.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "size-3",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <p
                          className="font-bold"
                          style={{ color: item.color ? item.color : "#ffffff" }}
                        >
                          {item.label}
                        </p>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
