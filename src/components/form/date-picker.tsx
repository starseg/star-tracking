import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";

interface DatePickerProps {
  control: any;
  name: string;
  label?: string;
  description?: string;
}

export default function DatePicker({
  control,
  name,
  label,
  description,
}: DatePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label ? <FormLabel>{label}</FormLabel> : null}
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "flex gap-2 w-60 text-left",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarBlank className="size-5" />
                    {field.value ? (
                      format(field.value, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                  locale={ptBR}
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription className="w-1/2">{description}</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
