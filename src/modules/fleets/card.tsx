"use client";
import InputDefault from "@/components/form/input-default";
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
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { Toast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Car,
  CheckCircle,
  PencilLine,
  Trash,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { z } from "zod";
import ColorItem from "./color-item";
import { FleetProps } from "./services/interface";
import { deleteAction } from "@/lib/delete-action";

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
const LoginFormSchema = z.object({
  login: z.string(),
  password: z.string(),
  accessTo: z.string(),
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

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      login: "",
      password: "",
      accessTo: "",
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

  const loginOnSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    const values = {
      fleetId: fleet.fleetId,
      login: data.login,
      password: data.password,
      accessTo: data.accessTo,
    };
    try {
      const response = await api.post("fleet/login", values);
      if (response.status === 201) {
        fetchData();
      }
      loginForm.reset({
        login: "",
        password: "",
        accessTo: "",
      });
      Toast("registro criado!", "success");
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  const deleteItem = async (id: number, route: string) => {
    deleteAction("registro", `${route}/${id}`, fetchData);
  };

  const updateLoginStatus = async (id: number, status: string) => {
    const newStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.patch(`fleet/login/${id}`, { status: newStatus });
      Swal.fire({
        title: "Status atualizado!",
        icon: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Erro atualizar dado:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between border-stone-50 border-b">
        <div className="flex items-center gap-2">
          <ColorItem color={fleet.color} />
          <p className="font-semibold">{fleet.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {fleet.status === "ACTIVE" ? (
            <p className="font-semibold text-green-400">Ativa</p>
          ) : (
            <p className="font-semibold text-red-400">Inativa</p>
          )}
          <div className="flex items-center gap-2 mb-2 text-2xl">
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
      <div className="flex items-center gap-2 mt-2">
        <p className="font-semibold text-lg">Contatos</p>
        <Dialog>
          <DialogTrigger asChild>
            <button
              title="Adicionar novo"
              className="text-primary underline transition-colors"
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
                <InputDefault
                  control={contactForm.control}
                  name="name"
                  label="Nome"
                  placeholder="Digite o nome"
                />
                <InputDefault
                  control={contactForm.control}
                  name="telephone"
                  label="Telefone"
                  placeholder="Digite o telefone"
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
      <div className="flex items-center gap-2 mt-2">
        <p className="font-semibold text-lg">E-mails</p>
        <Dialog>
          <DialogTrigger asChild>
            <button
              title="Adicionar novo"
              className="text-primary underline transition-colors"
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
                <InputDefault
                  control={emailForm.control}
                  name="email"
                  type="email"
                  label="E-mail"
                  placeholder="Digite o e-mail"
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

      {/* LOGIN */}
      <Separator className="my-1" />
      <div className="flex items-center gap-2 mt-2">
        <p className="font-semibold text-lg">Logins</p>
        <Dialog>
          <DialogTrigger asChild>
            <button
              title="Adicionar novo"
              className="text-primary underline transition-colors"
            >
              + adicionar novo
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(loginOnSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Criar novo login</DialogTitle>
                  <DialogDescription>
                    Adicione o login, a senha e o que esta pessoa pode acessar.
                  </DialogDescription>
                </DialogHeader>
                <InputDefault
                  control={loginForm.control}
                  name="login"
                  label="Login"
                  placeholder="Digite o login"
                />
                <InputDefault
                  control={loginForm.control}
                  name="password"
                  label="Senha"
                  placeholder="Digite a senha"
                />
                <TextareaDefault
                  control={loginForm.control}
                  name="accessTo"
                  placeholder="Digite ao que este login dá acesso"
                  label="Acesso a"
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
        {fleet.fleetLogin.map((item) => {
          return (
            <div key={item.fleetLoginId}>
              <div className="flex justify-between items-center py-1 border-b">
                <p className="text-stone-200">
                  {item.login} - {item.password}
                </p>
                <p className="text-stone-200">{item.accessTo}</p>
                <div className="flex items-center gap-1">
                  {item.status === "ACTIVE" ? (
                    <button
                      title="Marcar como inativo"
                      onClick={() =>
                        updateLoginStatus(item.fleetLoginId, item.status)
                      }
                      className="hover:text-red-500 transition-colors"
                    >
                      <CheckCircle size={24} />
                    </button>
                  ) : (
                    <button
                      title="Marcar como ativo"
                      onClick={() =>
                        updateLoginStatus(item.fleetLoginId, item.status)
                      }
                      className="hover:text-green-500 transition-colors"
                    >
                      <XCircle size={24} />
                    </button>
                  )}
                  <button
                    title="Excluir login"
                    onClick={() => deleteItem(item.fleetLoginId, "fleet/login")}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fleet.comments && (
        <div className="flex flex-col mt-2">
          <p className="font-semibold text-lg">Observações</p>
          <p>{fleet.comments}</p>
        </div>
      )}
    </div>
  );
}
