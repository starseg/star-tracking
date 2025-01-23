"use client";
import ColorPicker from "@/components/form/color-picker";
import InputDefault from "@/components/form/input-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  name: z.string(),
  responsible: z.string(),
  telephone: z.string(),
  email: z.string(),
  color: z.string(),
});

export default function FleetForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      responsible: "",
      telephone: "",
      email: "",
      color: "#ffffff",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      const response = await api.post("fleet", data);
      if (response.status === 201) {
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
        <InputDefault
          control={form.control}
          name="responsible"
          label="Responsável"
          placeholder="Digite o nome do responsável da frota"
        />
        <InputDefault
          control={form.control}
          name="telephone"
          label="Telefone"
          placeholder="Adicione um telefone ao responsável"
        />
        <InputDefault
          control={form.control}
          name="email"
          type="email"
          label="E-mail"
          placeholder="Adicione um e-mail ao responsável"
        />

        <ColorPicker name="color" valueControlBy="form" />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
