"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import UserUpdateForm from "@/modules/users/user-update-form";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateUser() {
  const [user, setUser] = useState<User | null>(null);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("users/" + id);
      const { password, ...userData } = response.data.user;
      setUser({ ...userData, password: "" });
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar motorista</h1>
        {user ? <UserUpdateForm preloadedValues={user} id={id} /> : <Loading />}
      </section>
    </>
  );
}
