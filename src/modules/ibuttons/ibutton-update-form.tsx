"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeviceStatus, IButton } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { handleFileUpload } from "@/lib/firebase-upload";
import { useState } from "react";

const FormSchema = z.object({
  number: z.string(),
  code: z.string(),
  programmedField: z.string(),
  comments: z.string(),
  deviceStatusId: z.number(),
  url1: z.instanceof(File),
  url2: z.instanceof(File),
});

interface Values {
  number: string;
  code: string;
  programmedField: string;
  comments: string;
  deviceStatusId: number;
}

export default function IButtonUpdateForm({
  preloadedValues,
  id,
  status,
  ibutton,
}: {
  preloadedValues: Values;
  id: number;
  status: DeviceStatus[];
  ibutton: IButton;
}) {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const timestamp = new Date().toISOString();
    // upload imagem 1
    let file1;
    if (data.url1 instanceof File && data.url1.size > 0) {
      const fileExtension = data.url1.name.split(".").pop();
      file1 = await handleFileUpload(
        data.url1,
        `star-tracking/ibuttons/foto-${timestamp}.${fileExtension}`
      );
    } else if (ibutton?.url1) file1 = ibutton.url1;
    else file1 = "";
    let file2;
    if (data.url2 instanceof File && data.url2.size > 0) {
      const fileExtension = data.url2.name.split(".").pop();
      file2 = await handleFileUpload(
        data.url2,
        `star-tracking/ibuttons/foto-${timestamp}.${fileExtension}`
      );
    } else file2 = "";

    try {
      const info = {
        url1: file1,
        url2: file2,
        code: data.code,
        number: data.number,
        comments: data.comments,
        programmedField: data.programmedField,
        deviceStatusId: data.deviceStatusId,
      };
      const response = await api.put(`ibutton/${id}`, info);
      if (response.status === 200) {
        router.push("/ibuttons");
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Digite o código" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="programmedField"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campo programado</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto 1</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormDescription>
                Não preencha esse campo se quiser manter o arquivo anterior
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto 2</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormDescription>
                Não preencha esse campo se quiser manter o arquivo anterior
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deviceStatusId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Status do dispositivo</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? status.find(
                            (item) => item.deviceStatusId === field.value
                          )?.description
                        : "Selecione o status"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar visitante..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {status.map((item) => (
                        <CommandItem
                          value={item.description}
                          key={item.deviceStatusId}
                          onSelect={() => {
                            form.setValue(
                              "deviceStatusId",
                              item.deviceStatusId
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.deviceStatusId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.description}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
