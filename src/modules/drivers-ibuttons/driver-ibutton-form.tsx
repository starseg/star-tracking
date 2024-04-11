"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";
import { Driver, Fleet, IButton } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  driverId: z.number(),
  ibuttonId: z.number(),
  comments: z.string(),
});

export default function DriverIButtonForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      driverId: 0,
      ibuttonId: 0,
      comments: "",
    },
  });
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const fetchDrivers = async () => {
    try {
      const response = await api.get("driver");
      setDrivers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [ibuttons, setIButtons] = useState<IButton[]>([]);
  const fetchIButtons = async () => {
    try {
      const response = await api.get("ibutton");
      setIButtons(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchIButtons();
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      const response = await api.post("driver-ibutton", data);
      if (response.status === 201) {
        const ibutton = await api.put(`ibutton/${data.ibuttonId}`, {
          deviceStatusId: 2, // Muda status do ibutton para "em uso"
        });
        if (ibutton.status === 200) {
          router.push("/motoristas-ibuttons");
        }
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
          name="driverId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Motorista</FormLabel>
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
                        ? drivers.find((item) => item.driverId === field.value)
                            ?.name
                        : "Selecione o motorista"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar motorista..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {drivers.map((item) => (
                        <CommandItem
                          value={item.name}
                          key={item.driverId}
                          onSelect={() => {
                            form.setValue("driverId", item.driverId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.driverId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.name}
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

        <FormField
          control={form.control}
          name="ibuttonId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>IButton</FormLabel>
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
                        ? ibuttons.find(
                            (item) => item.ibuttonId === field.value
                          )?.number
                        : "Selecione o IButton"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar IButton..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {ibuttons.map((item) => (
                        <CommandItem
                          value={item.number}
                          key={item.ibuttonId}
                          onSelect={() => {
                            form.setValue("ibuttonId", item.ibuttonId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.ibuttonId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.deviceStatusId === 1 ? (
                            <p>
                              {item.number} - {item.code}
                            </p>
                          ) : (
                            <p className="text-red-400 font-semibold">
                              {item.number} - {item.code}
                            </p>
                          )}
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
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
