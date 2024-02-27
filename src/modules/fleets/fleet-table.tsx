import { useEffect, useState } from "react";
import { Fleet } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Car,
  FilePlus,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import ColorItem from "./color-item";
import Loading from "@/components/loading";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export default function FleetTable() {
  // busca das frotas
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "fleet";
      else path = `fleet?query=${params.get("query")}`;
      const response = await api.get(path);
      setFleets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);
  // deletar frota
  const deleteFleet = async (id: number) => {
    Swal.fire({
      title: "Excluir data?",
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
          await api.delete(`fleet/${id}`);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Essa frota acabou de ser apagada.",
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
        <div>
          <Table className="max-h-[60vh] overflow-x-auto border border-stone-800">
            <TableHeader className="bg-stone-800 font-semibold">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleets.length > 0 ? (
                fleets.map((fleet) => {
                  return (
                    <TableRow key={fleet.fleetId}>
                      <TableCell className="flex items-center gap-2">
                        <ColorItem color={fleet.color} />
                        {fleet.name}
                      </TableCell>
                      <TableCell>{fleet.responsible}</TableCell>
                      <TableCell>{fleet.telephone}</TableCell>
                      <TableCell>{fleet.email}</TableCell>
                      <TableCell>
                        {fleet.status === "ACTIVE" ? (
                          <p className="text-green-400">ATIVA</p>
                        ) : (
                          <p className="text-red-400">INATIVA</p>
                        )}
                      </TableCell>
                      <TableCell className="flex gap-4 text-2xl">
                        <Link href={`/veiculos?frota=${fleet.fleetId}`}>
                          <Car />
                        </Link>
                        <Link href={`/frotas/atualizar?id=${fleet.fleetId}`}>
                          <PencilLine />
                        </Link>
                        <button
                          title="Excluir"
                          onClick={() => deleteFleet(fleet.fleetId)}
                        >
                          <Trash />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-8">
            <Link href="frotas/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar nova
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
