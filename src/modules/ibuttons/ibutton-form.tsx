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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleFileUpload } from "@/lib/firebase-upload";
import { useState } from "react";

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
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Digite o código" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="programmedField"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campo programado</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto 1 (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto 2 (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
}
