"use client";
import ComboboxDefault from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeviceStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TrackerValues } from "./services/interface";

const FormSchema = z.object({
  number: z.string(),
  model: z.string(),
  chipOperator: z.string(),
  iccid: z.string(),
  output: z.string(),
  comments: z.string(),
  deviceStatusId: z.number(),
});

export default function TrackerUpdateForm({
  preloadedValues,
  id,
  status,
}: {
  preloadedValues: TrackerValues;
  id: number;
  status: DeviceStatus[];
}) {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      const response = await api.put(`tracker/${id}`, data);
      if (response.status === 200) {
        router.push("/rastreadores");
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  const deviceStatusItem = status.map((status) => {
    return {
      label: status.description,
      value: status.deviceStatusId,
    };
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <InputDefault
          control={form.control}
          name="number"
          label="Número"
          placeholder="Digite o número"
        />
        <InputDefault
          control={form.control}
          name="model"
          label="Modelo"
          placeholder="Digite o modelo"
        />
        <InputDefault
          control={form.control}
          name="chipOperator"
          label="Operadora do chip"
          placeholder="Digite o nome da operadora"
        />
        <InputDefault
          control={form.control}
          name="iccid"
          label="ICCID do chip"
          placeholder="Digite o código"
        />
        <InputDefault
          control={form.control}
          name="output"
          label="Saída"
          placeholder="Digite o número"
        />
        <TextareaDefault
          control={form.control}
          name="comments"
          label="Observação"
          placeholder="Alguma informação adicional"
        />
        <ComboboxDefault
          control={form.control}
          name="deviceStatusId"
          object={deviceStatusItem}
          label="Selecione o status"
          searchLabel="Buscar status..."
          selectLabel="status"
          onSelect={(value: number) => {
            form.setValue("deviceStatusId", value);
          }}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
