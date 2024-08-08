"use client";
import { Fleet } from "@prisma/client";
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
import { cn } from "@/lib/utils";
import { DriverValues } from "./services/interface";
import { useState } from "react";
import { Image } from "@phosphor-icons/react/dist/ssr";
import InputImage from "@/components/form/inputImage";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-3/4 lg:w-[40%] 2xl:w-1/3"
      >
        <FormField
          control={form.control}
          name="fleetId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Frota</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? fleets.find((item) => item.fleetId === field.value)
                            ?.name
                        : "Selecione a frota"}
                      <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar frota..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {fleets.map((item) => (
                        <CommandItem
                          value={item.name}
                          key={item.fleetId}
                          onSelect={() => {
                            form.setValue("fleetId", item.fleetId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.fleetId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <p
                            className="font-bold"
                            style={{ color: item.color }}
                          >
                            {item.name}
                          </p>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do motorista</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do motorista" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Digite o CPF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNH</FormLabel>
              <FormControl>
                <Input placeholder="Digite a CNH" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Ativo</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Inativo</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
