"use client";
import InputDefault from "@/components/form/input-default";
import InputPassword from "@/components/form/input-password";
import InputRadio from "@/components/form/input-radio";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { status } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  name: z.string().min(5, {
    message: "Mínimo de 5 caracteres",
  }),
  username: z.string().min(5, {
    message: "Mínimo de 5 caracteres",
  }),
  password: z.string().min(8, {
    message: "Mínimo de 8 caracteres",
  }),
  type: z.enum(["USER", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export default function UserUpdateForm({
  preloadedValues,
  id,
}: {
  preloadedValues: User;
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
      const response = await api.put(`users/${id}`, data);
      if (response.status === 200) {
        router.push("/usuarios");
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  const type = [
    {
      value: "USER",
      label: "Usuário Comum",
    },
    {
      value: "ADMIN",
      label: "Administrador",
    },
  ];

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
          placeholder="Digite o nome completo"
        />
        <InputDefault
          control={form.control}
          name="username"
          label="Usuário"
          placeholder="Crie um nome de usuário para acessar o sistema"
        />
        <InputPassword
          control={form.control}
          name="password"
          label="Senha"
          placeholder="Crie uma senha forte"
        />
        <InputRadio
          control={form.control}
          name="type"
          label="Tipo"
          object={type}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
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
