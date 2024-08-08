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
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o modelo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="Digite a placa" {...field} />
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
          name="renavam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renavam</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chassis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chassis/Série</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input placeholder="Digite o ano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="installationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de instalação</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Digite o ano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InputImage control={form.control} name="url" />

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
