"use client";
import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  number: z.string(),
  model: z.string(),
  chipOperator: z.string(),
  iccid: z.string(),
  output: z.string(),
  comments: z.string(),
});

export default function TrackerForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      number: "",
      model: "",
      chipOperator: "",
      iccid: "",
      output: "",
      comments: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      const response = await api.post("tracker", data);
      if (response.status === 201) {
        router.push("/rastreadores");
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
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
