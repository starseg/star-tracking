"use client";
import DatePicker from "@/components/form/date-picker";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Problem } from "./services/interface";
import { Form } from "@/components/ui/form";
import { Toast } from "@/lib/utils";
import { useState } from "react";

interface DescriptionFormProps {
  problem: Problem;
  fetchData: () => void;
}

const FormSchema = z.object({
  date: z.date(),
  description: z.string().min(5, {
    message: "Digite uma mensagem.",
  }),
});

export default function DescriptionProblem({
  problem,
  fetchData,
}: DescriptionFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      date: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const values = {
      comunicationProblemId: problem.comunicationProblemId,
      description: data.description,
      date: data.date,
    };
    try {
      const response = await api.post("problem/description", values);
      if (response.status === 201) {
        fetchData();
        setIsDialogOpen(false);
        Toast("registro criado!", "success");
      }
      form.reset({
        description: "",
        date: undefined,
      });
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          title="Adicionar nova descrição"
          className="hover:bg-muted p-1 rounded-md transition-colors aspect-square"
        >
          <PlusCircle className="w-6 h-6 text-primary" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Criar nova descrição</DialogTitle>
              <DialogDescription>
                Descreva a data e a atividade tomada em relação a esse problema.
              </DialogDescription>
            </DialogHeader>
            <DatePicker control={form.control} name="date" label="Data" />

            <TextareaDefault
              control={form.control}
              name="description"
              label="Observação"
              placeholder="Descreva as ações tomadas"
            />
            <DialogFooter>
              <Button type="submit">Registrar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
