"use client";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FilePlus, PencilLine, Trash } from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { dateFormat } from "@/lib/utils";
import { deleteAction } from "@/lib/delete-action";

export default function UserTable() {
  // busca das frotas
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "users";
      else path = `users?query=${params.get("query")}`;
      const response = await api.get(path);
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
  }, [searchParams]);

  return (
    <div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table className="border-stone-800 border">
              <TableHeader className="bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => {
                    return (
                      <TableRow key={user.userId}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.type === "ADMIN"
                            ? "Administrador"
                            : "Usuário comum"}
                        </TableCell>
                        <TableCell>{dateFormat(user.createdAt)}</TableCell>
                        <TableCell>{dateFormat(user.updatedAt)}</TableCell>
                        <TableCell>
                          {user.status === "ACTIVE" ? (
                            <p className="text-green-400">ATIVO</p>
                          ) : (
                            <p className="text-red-400">INATIVO</p>
                          )}
                        </TableCell>
                        <TableCell className="flex gap-4 text-2xl">
                          <Link href={`/usuarios/atualizar?id=${user.userId}`}>
                            <PencilLine />
                          </Link>
                          <button
                            title="Excluir"
                            onClick={() =>
                              deleteAction(
                                "usuário",
                                `users/${user.userId}`,
                                fetch
                              )
                            }
                          >
                            <Trash />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mt-8">
            <Link href="usuarios/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar novo
              </Button>
            </Link>
            <div className="bg-muted px-6 py-2 rounded-md">
              Total: {users.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
