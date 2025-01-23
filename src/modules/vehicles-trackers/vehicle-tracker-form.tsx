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
import ComboboxDefault from "@/components/form/combobox-default";
import TextareaDefault from "@/components/form/textarea-default";

const FormSchema = z.object({
  vehicleId: z.number(),
  trackerId: z.number(),
  comments: z.string(),
});

export default function VehicleTrackerForm() {
  const [isSending, setIsSendind] = useState(false);
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
      const response = await api.get("tracker");
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
    setIsSendind(true);
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
    } finally {
      setIsSendind(false);
    }
  };

  const vehicleItem = vehicles.map((vehicle) => {
    return {
      label: `${vehicle.licensePlate} - ${vehicle.code}`,
      value: vehicle.vehicleId,
    };
  });

  const trackerItem = trackers.map((tracker) => {
    return {
      label: `${tracker.number} - ${tracker.iccid}`,
      value: tracker.trackerId,
      color: tracker.deviceStatusId !== 1 ? "#ff6467" : "",
    };
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <ComboboxDefault
          control={form.control}
          name="vehicleId"
          object={vehicleItem}
          label="Selecione o veículo"
          searchLabel="Buscar veículo..."
          selectLabel="Veículo"
          onSelect={(value: number) => {
            form.setValue("vehicleId", value);
          }}
        />

        <ComboboxDefault
          control={form.control}
          name="trackerId"
          object={trackerItem}
          label="Selecione o Rastreador"
          searchLabel="Buscar rastreado..."
          selectLabel="Rastreador"
          onSelect={(value: number) => {
            form.setValue("trackerId", value);
          }}
        />

        <TextareaDefault
          control={form.control}
          name="comments"
          label="Observação"
          placeholder="Alguma informação adicional"
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
