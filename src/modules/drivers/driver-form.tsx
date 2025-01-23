"use client";
import ComboboxDefault from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/inputImage";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fleet } from "@prisma/client";
import { Value } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  fleetId: z.number(),
  name: z.string(),
  cpf: z.string(),
  cnh: z.string(),
  comments: z.string(),
  imageUrl: z.instanceof(File),
});

export default function DriverForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fleetId: 0,
      name: "",
      cpf: "",
      cnh: "",
      comments: "",
      imageUrl: new File([], ""),
    },
  });
  const router = useRouter();

  const [fleets, setFleets] = useState<Fleet[]>([]);
  const fetchFleets = async () => {
    try {
      const response = await api.get("fleet");
      setFleets(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchFleets();
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    const timestamp = new Date().toISOString();
    // upload imagem 1
    let file;
    if (data.imageUrl instanceof File && data.imageUrl.size > 0) {
      const fileExtension = data.imageUrl.name.split(".").pop();
      file = await handleFileUpload(
        data.imageUrl,
        `star-tracking/drivers/foto-${timestamp}.${fileExtension}`
      );
    } else file = "";
    const info = {
      fleetId: data.fleetId,
      name: data.name,
      cpf: data.cpf,
      cnh: data.cnh,
      comments: data.comments,
      imageUrl: file,
    };
    try {
      const response = await api.post("driver", info);
      if (response.status === 201) {
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
        <InputImage control={form.control} name="imageUrl" />
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
