"use client";
import { Vehicle, Fleet } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { cn, englishDateFormat, status } from "@/lib/utils";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { useState } from "react";
import { Image } from "@phosphor-icons/react/dist/ssr";
import InputImage from "@/components/form/inputImage";
import { Checkbox } from "@/components/ui/checkbox";
import ComboboxDefault from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputRadio from "@/components/form/input-radio";
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
  status: z.enum(["ACTIVE", "INACTIVE"]),
  url: z.instanceof(File),
});

interface Values {
  fleetId: number;
  model: string;
  licensePlate: string;
  code: string;
  renavam: string;
  chassis: string;
  year: string;
  installationDate: Date;
  comments: string;
  status: "ACTIVE" | "INACTIVE";
  url: File;
}

export default function VehicleUpdateForm({
  preloadedValues,
  id,
  fleets,
  vehicle,
}: {
  preloadedValues: Values;
  id: number;
  fleets: Fleet[];
  vehicle: Vehicle;
}) {
  const data = {
    fleetId: preloadedValues.fleetId,
    model: preloadedValues.model,
    licensePlate: preloadedValues.licensePlate,
    code: preloadedValues.code,
    renavam: preloadedValues.renavam,
    chassis: preloadedValues.chassis,
    year: preloadedValues.year,
    installationDate: englishDateFormat(preloadedValues.installationDate),
    comments: preloadedValues.comments,
    status: preloadedValues.status,
    url: preloadedValues.url,
  };
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: data,
  });
  const router = useRouter();

  const [removeFile, setRemoveFile] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    // upload anexo
    const timestamp = new Date().toISOString();
    let file;
    if (removeFile) {
      file = "";
      if (vehicle.url && vehicle.url.length > 0) {
        deleteFile(vehicle.url);
      }
    } else if (data.url instanceof File && data.url.size > 0) {
      const fileExtension = data.url.name.split(".").pop();
      file = await handleFileUpload(
        data.url,
        `star-tracking/vehicles/foto-${timestamp}.${fileExtension}`
      );
    } else if (vehicle?.url) file = vehicle.url;
    else file = "";
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
        status: data.status,
      };
      const response = await api.put(`vehicle/${id}`, info);
      if (response.status === 200) {
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

        <div className="flex justify-center items-center gap-4">
          {vehicle.url && vehicle.url.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <img
                src={vehicle.url}
                alt="Foto veículo"
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
            <InputImage control={form.control} name="url" />

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
