"use client";
import ComboboxDefault from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import InputRadio from "@/components/form/input-radio";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { status } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Driver, DriverIButton, IButton } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  driverId: z.number(),
  ibuttonId: z.number(),
  comments: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export default function DriverIButtonUpdateForm({
  preloadedValues,
  id,
  drivers,
  ibuttons,
}: {
  preloadedValues: DriverIButton;
  id: number;
  drivers: Driver[];
  ibuttons: IButton[];
}) {
  const [isSending, setIsSendind] = useState(false);
  const values = {
    driverId: preloadedValues.driverId,
    ibuttonId: preloadedValues.ibuttonId,
    startDate: new Date(preloadedValues.startDate),
    endDate:
      preloadedValues.endDate !== null ? preloadedValues.endDate : undefined,
    comments: preloadedValues.comments,
    status: preloadedValues.status,
  };
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
      const response = await api.put(`driver-ibutton/${id}`, data);
      if (response.status === 200) {
        if (data.status === "INACTIVE") {
          await api.put(`ibutton/${data.ibuttonId}`, {
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

  const driverItem = drivers.map((driver) => {
    return {
      label: driver.name,
      value: driver.driverId,
    };
  });

  const ibuttonItem = ibuttons.map((ibutton) => {
    return {
      label: ibutton.number + " - " + ibutton.code,
      value: ibutton.ibuttonId,
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
          name="driverId"
          object={driverItem}
          label="Selecione o motorista"
          searchLabel="Buscar motorista..."
          selectLabel="Motorista"
          onSelect={(value: number) => {
            form.setValue("driverId", value);
          }}
        />
        <ComboboxDefault
          control={form.control}
          name="ibuttonId"
          object={ibuttonItem}
          label="Selecione o IButton"
          searchLabel="Buscar IButton..."
          selectLabel="IButton"
          onSelect={(value: number) => {
            form.setValue("ibuttonId", value);
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
