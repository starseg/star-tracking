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
import { Vehicle, Tracker } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  vehicleId: z.number(),
  trackerId: z.number(),
  comments: z.string(),
});

export default function VehicleTrackerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      vehicleId: 0,
      trackerId: 0,
      comments: "",
    },
  });
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const fetchVehicles = async () => {
    try {
      const response = await api.get("vehicle");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const fetchTrackers = async () => {
    try {
      const response = await api.get("tracker/available");
      setTrackers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchTrackers();
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await api.post("vehicle-tracker", data);
      if (response.status === 201) {
        const tracker = await api.put(`tracker/${data.trackerId}`, {
          deviceStatusId: 2, // Muda status do rastreador para "em uso"
        });
        if (tracker.status === 200) {
          router.push("/veiculos-rastreadores");
        }
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
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
          name="vehicleId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Veículo</FormLabel>
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
                        ? vehicles.find(
                            (item) => item.vehicleId === field.value
                          )?.licensePlate
                        : "Selecione o veículo"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar veículo..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {vehicles.map((item) => (
                        <CommandItem
                          value={item.licensePlate}
                          key={item.vehicleId}
                          onSelect={() => {
                            form.setValue("vehicleId", item.vehicleId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.vehicleId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.licensePlate} - {item.code}
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
          name="trackerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Rastreador</FormLabel>
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
                        ? trackers.find(
                            (item) => item.trackerId === field.value
                          )?.number
                        : "Selecione o rastreador"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar rastreador..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {trackers.map((item) => (
                        <CommandItem
                          value={item.number}
                          key={item.trackerId}
                          onSelect={() => {
                            form.setValue("trackerId", item.trackerId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.trackerId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.number} - {item.iccid}
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
        <Button type="submit" className="w-full text-lg">
          Registrar
        </Button>
      </form>
    </Form>
  );
}
