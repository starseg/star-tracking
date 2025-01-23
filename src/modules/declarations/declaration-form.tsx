"use client";
import InputDefault from "@/components/form/input-default";
import InputFile from "@/components/form/inputFile";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  title: z.string().min(4, { message: "Crie um nome válido" }),
  url: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Um arquivo deve ser selecionado",
  }),
});

export default function DeclarationForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      url: new File([], ""),
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const documentTitle = data.title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
    // upload imagem
    let file;
    if (data.url instanceof File && data.url.size > 0) {
      const fileExtension = data.url.name.split(".").pop();
      file = await handleFileUpload(
        data.url,
        `star-tracking/declarations/${documentTitle}.${fileExtension}`
      );
    } else file = "";

    try {
      const info = {
        title: data.title,
        url: file,
      };
      const response = await api.post("declaration", info);
      if (response.status === 201) {
        router.push("/declaracoes");
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
          name="title"
          label="Título"
          placeholder="Digite o título"
        />
        <InputFile control={form.control} name="url" />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
