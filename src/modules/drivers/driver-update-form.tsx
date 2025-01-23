"use client";
import ComboboxDefault from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputRadio from "@/components/form/input-radio";
import InputImage from "@/components/form/inputImage";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "@phosphor-icons/react/dist/ssr";
import { Fleet } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DriverValues } from "./services/interface";
import { status } from "@/lib/utils";

const FormSchema = z.object({
  name: z.string(),
  cpf: z.string(),
  cnh: z.string(),
  comments: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  fleetId: z.number(),
  imageUrl: z.instanceof(File),
});

interface Values {
  driverId: number;
  name: string;
  cpf: string;
  cnh: string;
  imageUrl: File;
  comments: string;
  status: "ACTIVE" | "INACTIVE";
  fleetId: number;
}

export default function DriverUpdateForm({
  preloadedValues,
  driver,
  id,
  fleets,
}: {
  preloadedValues: Values;
  driver: DriverValues;
  id: number;
  fleets: Fleet[];
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

    let file;
    if (removeFile) {
      file = "";
      if (driver.imageUrl && driver.imageUrl.length > 0) {
        deleteFile(driver.imageUrl);
      }
    } else if (data.imageUrl instanceof File && data.imageUrl.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.imageUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.imageUrl,
        `pessoas/foto-perfil-${timestamp}.${fileExtension}`
      );
    } else if (driver?.imageUrl) file = driver.imageUrl;
    else file = "";

    const info = {
      name: data.name,
      cpf: data.cpf,
      cnh: data.cnh,
      comments: data.comments,
      status: data.status,
      fleetId: data.fleetId,
      imageUrl: file,
    };

    try {
      const response = await api.put(`driver/${id}`, info);
      if (response.status === 200) {
        router.push("/motoristas");
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  const fleetItem = fleets.map((fleet) => {
    return {
      label: fleet.name,
      value: fleet.fleetId,
      color: fleet.color,
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
          name="fleetId"
          object={fleetItem}
          label="Selecione a frota"
          searchLabel="Buscar frota..."
          selectLabel="Frota"
          onSelect={(value: number) => {
            form.setValue("fleetId", value);
          }}
        />
        <InputDefault
          control={form.control}
          name="name"
          label="Nome do motorista"
          placeholder="Digite o nome do motorista"
        />

        <InputDefault
          control={form.control}
          name="cpf"
          label="CPF"
          placeholder="Digite o CPF"
        />
        <InputDefault
          control={form.control}
          name="cnh"
          label="CNH"
          placeholder="Digite a CNH"
        />
        {/* /////////////// */}
        <div className="flex justify-center items-center gap-4">
          {driver.imageUrl && driver.imageUrl.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img
                src={driver.imageUrl}
                alt="Foto de perfil"
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
            <InputImage control={form.control} name="imageUrl" />

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
