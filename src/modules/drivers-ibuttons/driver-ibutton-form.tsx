"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Driver, IButton } from "@prisma/client";
import ComboboxDefault from "@/components/form/combobox-default";
import TextareaDefault from "@/components/form/textarea-default";

const FormSchema = z.object({
  driverId: z.number(),
  ibuttonId: z.number(),
  comments: z.string(),
});

export default function DriverIButtonForm() {
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      driverId: 0,
      ibuttonId: 0,
      comments: "",
    },
  });
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const fetchDrivers = async () => {
    try {
      const response = await api.get("driver");
      setDrivers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [ibuttons, setIButtons] = useState<IButton[]>([]);
  const fetchIButtons = async () => {
    try {
      const response = await api.get("ibutton");
      setIButtons(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchIButtons();
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      const response = await api.post("driver-ibutton", data);
      if (response.status === 201) {
        const ibutton = await api.put(`ibutton/${data.ibuttonId}`, {
          deviceStatusId: 2, // Muda status do ibutton para "em uso"
        });
        if (ibutton.status === 200) {
          router.push("/motoristas-ibuttons");
        }
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  const driverItem = drivers.map((driver) => {
    return {
      label: driver.name,
      value: driver.driverId,
    };
  });

  const ibuttonItem = ibuttons.map((ibutton) => {
    return {
      label: ibutton.number + " - " + ibutton.code,
      value: ibutton.ibuttonId,
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
          name="driverId"
          object={driverItem}
          label="Selecione o motorista"
          searchLabel="Buscar motorista..."
          selectLabel="Motorista"
          onSelect={(value: number) => {
            form.setValue("driverId", value);
          }}
        />
        <ComboboxDefault
          control={form.control}
          name="ibuttonId"
          object={ibuttonItem}
          label="Selecione o IButton"
          searchLabel="Buscar IButton..."
          selectLabel="IButton"
          onSelect={(value: number) => {
            form.setValue("ibuttonId", value);
          }}
        />
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
