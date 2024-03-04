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
  // deletar frota
  const deleteUser = async (id: number) => {
    Swal.fire({
      title: "Excluir usuário?",
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
          await api.delete(`users/${id}`);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Esse usuário acabou de ser apagado.",
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
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-x-auto">
            <Table className="border border-stone-800">
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
                            onClick={() => deleteUser(user.userId)}
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
          <div className="mt-8 flex justify-between">
            <Link href="usuarios/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar novo
              </Button>
            </Link>
            <div className="py-2 px-6 rounded-md bg-muted">
              Total: {users.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
