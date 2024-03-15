"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import {
  Car,
  CheckCircle,
  PencilLine,
  PlusCircle,
  Trash,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import Swal from "sweetalert2";
import { FleetProps } from "./services/interface";
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
import ColorItem from "./color-item";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Toast } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";

interface FleetCardProps {
  fleet: FleetProps;
  fetchData: () => void;
}

const ContactFormSchema = z.object({
  name: z.string(),
  telephone: z.string(),
});
const EmailFormSchema = z.object({
  email: z.string(),
});

export default function FleetCard({ fleet, fetchData }: FleetCardProps) {
  const contactForm = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      telephone: "",
    },
  });

  const emailForm = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const contactOnSubmit = async (data: z.infer<typeof ContactFormSchema>) => {
    const values = {
      fleetId: fleet.fleetId,
      name: data.name,
      telephone: data.telephone,
    };
    try {
      const response = await api.post("fleet/contact", values);
      if (response.status === 201) {
        fetchData();
      }
      contactForm.reset({
        name: "",
        telephone: "",
      });
      Toast("registro criado!", "success");
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  const emailOnSubmit = async (data: z.infer<typeof EmailFormSchema>) => {
    const values = {
      fleetId: fleet.fleetId,
      email: data.email,
    };
    try {
      const response = await api.post("fleet/email", values);
      if (response.status === 201) {
        fetchData();
      }
      emailForm.reset({
        email: "",
      });
      Toast("registro criado!", "success");
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  const deleteItem = async (id: number, route: string) => {
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
          await api.delete(`${route}/${id}`);
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

  return (
    <div>
      <div className="flex justify-between border-b border-stone-50">
        <div className="flex items-center gap-2">
          <ColorItem color={fleet.color} />
          <p className="font-semibold">{fleet.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p>
            {fleet.status === "ACTIVE" ? (
              <p className="text-green-400 font-semibold">Ativa</p>
            ) : (
              <p className="text-red-400 font-semibold">Inativa</p>
            )}
          </p>
          <div className="flex gap-2 items-center text-2xl mb-2">
            <Link href={`/veiculos?query=${fleet.name}`}>
              <Car />
            </Link>
            <Link href={`/frotas/atualizar?id=${fleet.fleetId}`}>
              <PencilLine />
            </Link>
            <button
              title="Excluir"
              onClick={() => deleteItem(fleet.fleetId, "fleet")}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
      {/* CONTATOS */}
      <div className="flex gap-2 items-center mt-2">
        <p className="text-lg font-semibold">Contatos</p>
        <Dialog>
          <DialogTrigger asChild>
            <button
              title="Adicionar novo"
              className="underline text-primary transition-colors"
            >
              + adicionar novo
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...contactForm}>
              <form
                onSubmit={contactForm.handleSubmit(contactOnSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Criar novo contato</DialogTitle>
                  <DialogDescription>
                    Adicione o nome e o telefone do responsável da frota.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o telefone" {...field} />
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
      <div>
        {fleet.fleetContact.map((item) => {
          return (
            <div key={item.fleetContactId}>
              <div className="flex justify-between items-center">
                <p className="text-stone-200">
                  {item.name}: {item.telephone}
                </p>
                <div>
                  <button
                    title="Excluir contato"
                    onClick={() =>
                      deleteItem(item.fleetContactId, "fleet/contact")
                    }
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* EMAIL */}
      <Separator className="my-1" />
      <div className="flex gap-2 items-center mt-2">
        <p className="text-lg font-semibold">E-mails</p>
        <Dialog>
          <DialogTrigger asChild>
            <button
              title="Adicionar novo"
              className="underline text-primary transition-colors"
            >
              + adicionar novo
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(emailOnSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Criar novo email</DialogTitle>
                  <DialogDescription>
                    Adicione o nome e o telefone do responsável da frota.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o e-mail" {...field} />
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
      <div>
        {fleet.fleetEmail.map((item) => {
          return (
            <div key={item.fleetEmailId}>
              <div className="flex justify-between items-center">
                <p className="text-stone-200">{item.email}</p>
                <div>
                  <button
                    title="Excluir email"
                    onClick={() => deleteItem(item.fleetEmailId, "fleet/email")}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
