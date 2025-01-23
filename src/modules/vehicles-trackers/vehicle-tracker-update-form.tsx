"use client";
import { VehicleTracker, Vehicle, Tracker } from "@prisma/client";
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
  FormDescription,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn, status } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import ComboboxDefault from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import TextareaDefault from "@/components/form/textarea-default";
import InputRadio from "@/components/form/input-radio";

const FormSchema = z.object({
  vehicleId: z.number(),
  trackerId: z.number(),
  comments: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export default function VehicleTrackerUpdateForm({
  preloadedValues,
  id,
  vehicles,
  trackers,
}: {
  preloadedValues: VehicleTracker;
  id: number;
  vehicles: Vehicle[];
  trackers: Tracker[];
}) {
  const values = {
    vehicleId: preloadedValues.vehicleId,
    trackerId: preloadedValues.trackerId,
    startDate: new Date(preloadedValues.startDate),
    endDate:
      preloadedValues.endDate !== null ? preloadedValues.endDate : undefined,
    comments: preloadedValues.comments,
    status: preloadedValues.status,
  };
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: values,
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    if (data.status === "INACTIVE" && data.endDate === undefined) {
      data.endDate = new Date();
    }

    try {
      const response = await api.put(`vehicle-tracker/${id}`, data);
      if (response.status === 200) {
        if (data.status === "INACTIVE") {
          await api.put(`tracker/${data.trackerId}`, {
            deviceStatusId: 1,
          });
        }
        router.back();
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
        <DatePicker
          control={form.control}
          name="startDate"
          label="Data de início"
        />
        <DatePicker
          control={form.control}
          name="endDate"
          label="Data de fim"
          description="Este campo já será preenchido com a data atual se o status for alterado para inativo"
        />

        <TextareaDefault
          control={form.control}
          name="comments"
          label="Observação"
          placeholder="Alguma informação adicional"
        />

        <InputRadio
          control={form.control}
          name="status"
          label="Status"
          object={status}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
