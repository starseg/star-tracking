"use client";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/inputImage";
import TextareaDefault from "@/components/form/textarea-default";
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
  number: z.string(),
  code: z.string(),
  programmedField: z.string(),
  comments: z.string(),
  url1: z.instanceof(File),
  url2: z.instanceof(File),
});

export default function IButtonForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      number: "",
      code: "",
      programmedField: "",
      comments: "",
      url1: new File([], ""),
      url2: new File([], ""),
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const timestamp = new Date().toISOString();
    // upload imagem 1
    let file1;
    if (data.url1 instanceof File && data.url1.size > 0) {
      const fileExtension = data.url1.name.split(".").pop();
      file1 = await handleFileUpload(
        data.url1,
        `star-tracking/ibuttons/foto-${timestamp}.${fileExtension}`
      );
    } else file1 = "";
    // upload imagem 2
    let file2;
    if (data.url2 instanceof File && data.url2.size > 0) {
      const fileExtension = data.url2.name.split(".").pop();
      file2 = await handleFileUpload(
        data.url2,
        `star-tracking/ibuttons/foto-${timestamp}.${fileExtension}`
      );
    } else file2 = "";

    try {
      const info = {
        number: data.number,
        code: data.code,
        programmedField: data.programmedField,
        comments: data.comments,
        url1: file1,
        url2: file2,
      };
      const response = await api.post("ibutton", info);
      if (response.status === 201) {
        router.push("/ibuttons");
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
          name="code"
          label="Código"
          placeholder="Digite o código"
        />
        <InputDefault
          control={form.control}
          name="programmedField"
          label="Campo programado"
          placeholder="Digite o número"
        />
        <InputImage control={form.control} name="url1" />
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
