"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import {
  CheckCircle,
  PencilLine,
  PlusCircle,
  Trash,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import Swal from "sweetalert2";
import { Problem } from "./services/interface";
import { cn, dateFormat } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ProblemCardProps {
  problem: Problem;
  fetchData: () => void;
}

const FormSchema = z.object({
  date: z.date(),
  description: z.string().min(5, {
    message: "Digite uma mensagem.",
  }),
});

export default function ProblemCard({ problem, fetchData }: ProblemCardProps) {
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

  const deleteItem = async (id: number) => {
    Swal.fire({
      title: "Excluir registro?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43C04F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`problem/${id}`);
          fetchData();
          Swal.fire({
            title: "Excluído!",
            text: "Esse registro acabou de ser apagado.",
            icon: "success",
          });
        } catch (error) {
          console.error("Erro excluir dado:", error);
        }
      }
    });
  };

  const updateItem = async (id: number, status: string) => {
    if (status === "ACTIVE") status = "INACTIVE";
    else status = "ACTIVE";
    try {
      await api.patch(`problem/${id}`, { status });
      Swal.fire({
        title: "Status atualizado!",
        icon: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  const updateEmphasisItem = async (id: number, emphasis: boolean) => {
    emphasis = !emphasis;
    try {
      await api.patch(`problem/emphasis/${id}`, { emphasis });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  const updateMaintenanceItem = async (id: number, maintenance: boolean) => {
    maintenance = !maintenance;
    try {
      await api.patch(`problem/maintenance/${id}`, { maintenance });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  const deleteDescription = async (id: number) => {
    Swal.fire({
      title: "Excluir registro?",
      text: "Essa ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43C04F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`problem/description/${id}`);
          fetchData();
          Swal.fire({
            title: "Excluído!",
            text: "Esse registro acabou de ser apagado.",
            icon: "success",
          });
        } catch (error) {
          console.error("Erro excluir dado:", error);
        }
      }
    });
  };

  const createDescription = async (problem: number) => {
    // TODO: abrir formulário para criar
    // const data = {
    //   date: date,
    //   description: description,
    //   comunicationProblemId: problem
    // }
    // try {
    //   await api.patch(`problem/description`, data);
    //   fetchData();
    // } catch (error) {
    //   console.error("Erro atualizar dado:", error);
    // }
  };

  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll
    ? problem.comunicationDescription
    : problem.comunicationDescription.slice(0, 3);
  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <div>
      <div className="flex justify-between">
        <p className="font-semibold">Veículo</p>
        <div>
          {problem.status === "ACTIVE" ? (
            <p className="text-red-400">Problema ativo</p>
          ) : (
            <p className="text-green-400">Problema resolvido</p>
          )}
        </div>
      </div>
      <div className="flex justify-between border-stone-50 py-2 border-b">
        <div className="flex flex-col gap-2">
          <p>
            {problem.vehicle.licensePlate} - cod.{problem.vehicle.code}
          </p>
          <p>{problem.vehicle.fleet.name}</p>

          <div className="flex items-center gap-2">
            <p>STATUS OS: </p>
            {problem.emphasis ? (
              <button
                title="Marcar como Inativa"
                onClick={() =>
                  updateEmphasisItem(
                    problem.comunicationProblemId,
                    problem.emphasis
                  )
                }
              >
                <CheckCircle size={24} className="text-green-400" />
              </button>
            ) : (
              <button
                title="Marcar como Ativa"
                onClick={() =>
                  updateEmphasisItem(
                    problem.comunicationProblemId,
                    problem.emphasis
                  )
                }
              >
                <XCircle size={24} className="text-red-500" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p>STATUS MANUTENÇÃO: </p>
            {problem.isUnderMaintenance ? (
              <button
                title="Em manutenção"
                onClick={() =>
                  updateMaintenanceItem(
                    problem.comunicationProblemId,
                    problem.isUnderMaintenance
                  )
                }
              >
                <XCircle size={24} className="text-blue-400" />
              </button>
            ) : (
              <button
                title="Não está em manutenção"
                onClick={() =>
                  updateMaintenanceItem(
                    problem.comunicationProblemId,
                    problem.isUnderMaintenance
                  )
                }
              >
                <CheckCircle size={24} className="text-green-500" />
              </button>
            )}
          </div>

        </div>

        <div className="flex items-center gap-2">
          {problem.status === "ACTIVE" ? (
            <button
              title="Marcar como resolvido"
              onClick={() =>
                updateItem(problem.comunicationProblemId, problem.status)
              }
            >
              <CheckCircle size={24} />
            </button>
          ) : (
            <button
              title="Marcar como não resolvido"
              onClick={() =>
                updateItem(problem.comunicationProblemId, problem.status)
              }
            >
              <XCircle size={24} />
            </button>
          )}
          <button
            title="Excluir"
            onClick={() => deleteItem(problem.comunicationProblemId)}
          >
            <Trash size={24} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold">Descrição</p>
        <Dialog>
          <DialogTrigger asChild>
            <button
              title="Adicionar nova descrição"
              className="hover:bg-muted p-1 rounded-md transition-colors aspect-square"
              onClick={() => createDescription(problem.comunicationProblemId)}
            >
              <PlusCircle className="w-6 h-6 text-primary" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Criar nova descrição</DialogTitle>
                  <DialogDescription>
                    Descreva a data e a atividade tomada em relação a esse
                    problema.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                          <Calendar
                            locale={ptBR}
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva as ações tomadas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Registrar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {/* MAP NAS DESCRIÇÕES */}
      <div>
        {displayedItems.map((item) => {
          return (
            <div key={item.comunicationDescriptionId}>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    {dateFormat(item.date)} - {item.description}
                  </p>
                  <p className="text-primary text-sm capitalize">
                    Usuário: {item.user.name.split(" ")[0]}
                  </p>
                </div>
                <div>
                  <button
                    title="Excluir descrição"
                    onClick={() =>
                      deleteDescription(item.comunicationDescriptionId)
                    }
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {problem.comunicationDescription.length > 3 && (
          <div className="flex justify-end w-full">
            <Button onClick={toggleShowAll}>
              {showAll ? "Mostrar menos" : "Mostrar mais"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
