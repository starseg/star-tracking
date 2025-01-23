import React, { ChangeEvent, FocusEvent } from "react";
import InputMask from "react-input-mask";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface InputMaskedProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  mask: string;
  type?: string;
  description?: string;
  className?: string;
  inputClassname?: string;
  readOnly?: boolean;
  disabled?: boolean;
  maxLength?: number | undefined;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputMasked({
  control,
  name,
  label,
  placeholder,
  mask,
  type = "text",
  description,
  className,
  inputClassname,
  readOnly = false,
  disabled = false,
  maxLength = undefined,
  onBlur,
  onChange,
}: InputMaskedProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputMask
              mask={mask}
              {...field}
              readOnly={readOnly}
              disabled={disabled}
              onBlur={(event) => onBlur && onBlur(event)}
              onChange={(event) => {
                field.onChange(event);
                onChange && onChange(event);
              }}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    inputClassname
                  )}
                  placeholder={placeholder}
                  type={type}
                  autoComplete="off"
                  maxLength={maxLength}
                />
              )}
            </InputMask>
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
