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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { StringDateFormat, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Fleet } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { handleFileUpload } from "@/lib/firebase-upload";
import InputImage from "@/components/form/inputImage";
import ComboboxDefault from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";

const FormSchema = z.object({
  fleetId: z.number(),
  model: z.string(),
  licensePlate: z.string(),
  code: z.string(),
  renavam: z.string(),
  chassis: z.string(),
  year: z.string(),
  installationDate: z.string(),
  comments: z.string(),
  url: z.instanceof(File),
});

export default function VehicleForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fleetId: 0,
      model: "",
      licensePlate: "",
      code: "",
      renavam: "",
      chassis: "",
      year: "",
      installationDate: "",
      comments: "",
      url: new File([], ""),
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
    // upload do arquivo
    let file;
    if (data.url instanceof File && data.url.size > 0) {
      const fileExtension = data.url.name.split(".").pop();
      file = await handleFileUpload(
        data.url,
        `star-tracking/vehicles/foto-${timestamp}.${fileExtension}`
      );
    } else file = "";
    try {
      const info = {
        url: file,
        fleetId: data.fleetId,
        model: data.model,
        licensePlate: data.licensePlate,
        code: data.code,
        renavam: data.renavam,
        chassis: data.chassis,
        year: data.year,
        installationDate: data.installationDate,
        comments: data.comments,
      };
      const response = await api.post("vehicle", info);
      if (response.status === 201) {
        router.push("/veiculos");
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
          name="model"
          label="Modelo"
          placeholder="Digite o modelo"
        />

        <InputDefault
          control={form.control}
          name="licensePlate"
          label="Placa"
          placeholder="Digite a placa"
        />

        <InputDefault
          control={form.control}
          name="code"
          label="Código"
          placeholder="Digite o código"
        />

        <InputDefault
          control={form.control}
          name="renavam"
          label="Modelo"
          placeholder="Digite o número"
        />

        <InputDefault
          control={form.control}
          name="chassis"
          label="Chassis/Série"
          placeholder="Digite o número"
        />
        <InputDefault
          control={form.control}
          name="year"
          label="Ano"
          placeholder="Digite o ano"
        />

        <InputDefault
          control={form.control}
          name="installationDate"
          label="Data de instalação"
          placeholder="Digite o ano"
          type="date"
        />

        <InputImage control={form.control} name="url" />

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
