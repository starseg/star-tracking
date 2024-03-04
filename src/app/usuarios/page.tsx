"use client";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import UserTable from "@/modules/users/user-table";
import { Users } from "@phosphor-icons/react/dist/ssr";

export default function UsersPage() {
  return (
    <>
      <Menu url="/painel" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center justify-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          <Users /> Usuários
        </h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <UserTable />
      </main>
    </>
  );
}
