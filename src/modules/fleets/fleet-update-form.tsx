"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useState } from "react";
import InputDefault from "@/components/form/input-default";
import ColorPicker from "@/components/form/color-picker";
import TextareaDefault from "@/components/form/textarea-default";
import InputRadio from "@/components/form/input-radio";
import { status } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string(),
  color: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  comments: z.string(),
});

interface Values {
  name: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
  comments: string;
}

export default function FleetUpdateForm({
  preloadedValues,
  id,
}: {
  preloadedValues: Values;
  id: number;
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
      const response = await api.put(`fleet/${id}`, data);
      if (response.status === 200) {
        router.push("/frotas");
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
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <InputDefault
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Digite o nome da frota"
        />
        <ColorPicker
          name="color"
          valueControlBy="form"
          defaultValue={preloadedValues.color}
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
