import { useEffect, useState } from "react";
import { Driver } from "@prisma/client";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DriverData extends Driver {
  fleet: {
    name: string;
    color: string;
  };
}

export default function DriverTable() {
  // busca das frotas
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "driver";
      else path = `driver?query=${params.get("query")}`;
      const response = await api.get(path);
      setDrivers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);
  // deletar frota
  const deleteDriver = async (id: number) => {
    Swal.fire({
      title: "Excluir motorista?",
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
          await api.delete(`driver/${id}`);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Esse motorista acabou de ser apagado.",
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
                <TableHead>Frota</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>CNH</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.length > 0 ? (
                drivers.map((driver) => {
                  return (
                    <TableRow key={driver.fleetId}>
                      <TableCell
                        className="font-bold "
                        style={{ color: driver.fleet.color }}
                      >
                        {driver.fleet.name}
                      </TableCell>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.cpf}</TableCell>
                      <TableCell>{driver.cnh}</TableCell>
                      <TableCell>
                        {driver.comments ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                                  {driver.comments}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                                <p>{driver.comments}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          "Nenhuma"
                        )}
                      </TableCell>
                      <TableCell>
                        {driver.status === "ACTIVE" ? (
                          <p className="text-green-400">ATIVO</p>
                        ) : (
                          <p className="text-red-400">INATIVO</p>
                        )}
                      </TableCell>
                      <TableCell className="flex gap-4 text-2xl">
                        <Link
                          href={`/motoristas/atualizar?id=${driver.driverId}`}
                        >
                          <PencilLine />
                        </Link>
                        <button
                          title="Excluir"
                          onClick={() => deleteDriver(driver.driverId)}
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
          <div className="mt-8 flex justify-between">
            <Link href="motoristas/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar novo
              </Button>
            </Link>
            <div className="py-2 px-6 rounded-md bg-muted">
              Total: {drivers.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
