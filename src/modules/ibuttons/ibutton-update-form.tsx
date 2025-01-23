"use client";
import ComboboxDefault from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/inputImage";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "@phosphor-icons/react/dist/ssr";
import { DeviceStatus, IButton } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  number: z.string(),
  code: z.string(),
  programmedField: z.string(),
  comments: z.string(),
  deviceStatusId: z.number(),
  url1: z.instanceof(File),
  url2: z.instanceof(File),
});

interface Values {
  number: string;
  code: string;
  programmedField: string;
  comments: string;
  deviceStatusId: number;
}

export default function IButtonUpdateForm({
  preloadedValues,
  id,
  status,
  ibutton,
}: {
  preloadedValues: Values;
  id: number;
  status: DeviceStatus[];
  ibutton: IButton;
}) {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });
  const router = useRouter();

  const [removeFile, setRemoveFile] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const timestamp = new Date().toISOString();
    // upload imagem 1
    let file1;
    if (removeFile) {
      file1 = "";
      if (ibutton.url1 && ibutton.url1.length > 0) {
        deleteFile(ibutton.url1);
      }
    } else if (data.url1 instanceof File && data.url1.size > 0) {
      const fileExtension = data.url1.name.split(".").pop();
      file1 = await handleFileUpload(
        data.url1,
        `star-tracking/ibuttons/foto-${timestamp}.${fileExtension}`
      );
    } else if (ibutton?.url1) file1 = ibutton.url1;
    else file1 = "";
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
        url1: file1,
        url2: file2,
        code: data.code,
        number: data.number,
        comments: data.comments,
        programmedField: data.programmedField,
        deviceStatusId: data.deviceStatusId,
      };
      const response = await api.put(`ibutton/${id}`, info);
      if (response.status === 200) {
        router.push("/ibuttons");
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
        <div className="flex justify-center items-center gap-4">
          {ibutton.url1 && ibutton.url1.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img
                src={ibutton.url1}
                alt="Foto ibutton"
                className="rounded w-20 h-20 object-cover"
              />
              <p className="mt-2 text-center text-sm">Foto atual</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Image className="w-20 h-20" />
              <p className="mt-2 text-center text-sm">Sem foto</p>
            </div>
          )}
          <div className="w-10/12">
            <InputImage control={form.control} name="url1" />

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="check"
                onClick={() => {
                  setRemoveFile(!removeFile);
                }}
              />
              <label
                htmlFor="check"
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
              >
                Remover foto - {removeFile ? "sim" : "não"}
              </label>
            </div>
          </div>
        </div>
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
