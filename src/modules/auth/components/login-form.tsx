"use client";
import InputDefault from "@/components/form/input-default";
import InputPassword from "@/components/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  username: z.string().min(5, {
    message: "Mínimo de 5 caracteres",
  }),
  password: z.string().min(8, {
    message: "Mínimo de 8 caracteres",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await api.post("users/login", data);
      if (response.status === 200) {
        router.push("/painel");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error("Erro ao enviar dados para a API:", error);
        throw error;
      }
    }
  };
  return (
    <Card className="border-yellow-600 w-[300px] md:w-[400px]">
      <CardHeader className="flex flex-col items-center mt-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          height={45}
          width={237}
          priority={true}
        />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="items-center gap-2 grid w-full">
              <InputDefault
                control={form.control}
                name="username"
                label="Nome de usuário"
                type="text"
                placeholder="Seu nome de usuário"
              />
              <InputPassword
                control={form.control}
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
