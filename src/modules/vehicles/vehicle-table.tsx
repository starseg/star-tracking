import { useEffect, useState } from "react";
import { Vehicle } from "@prisma/client";
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
import {
  FilePlus,
  MagnifyingGlass,
  PencilLine,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { dateFormat } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface VehicleData extends Vehicle {
  fleet: {
    name: string;
    color: string;
  };
}

export default function VehiclerTable() {
  // busca das frotas
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(false);
  let count = 0;

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "vehicle";
      else path = `vehicle?query=${params.get("query")}`;
      const response = await api.get(path);
      setVehicles(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);
  // deletar veiculo
  const deleteVehicle = async (id: number) => {
    Swal.fire({
      title: "Excluir veículo?",
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
          await api.delete(`vehicle/${id}`);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Esse veículo acabou de ser apagado.",
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
                  <TableHead>Frota</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Instalação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => {
                    if (active && vehicle.status === "INACTIVE") return;
                    count++;
                    return (
                      <TableRow key={vehicle.vehicleId}>
                        <TableCell
                          className="font-bold"
                          style={{ color: vehicle.fleet.color }}
                        >
                          {vehicle.fleet.name}
                        </TableCell>
                        <TableCell>{vehicle.licensePlate}</TableCell>
                        <TableCell>{vehicle.code}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>
                          {dateFormat(vehicle.installationDate)}
                        </TableCell>
                        <TableCell>
                          {vehicle.status === "ACTIVE" ? (
                            <p className="text-green-400">ATIVO</p>
                          ) : (
                            <p className="text-red-400">INATIVO</p>
                          )}
                        </TableCell>
                        <TableCell className="flex gap-4 text-2xl">
                          <Link
                            href={`/veiculos/detalhes?id=${vehicle.vehicleId}`}
                          >
                            <MagnifyingGlass />
                          </Link>
                          <Link
                            href={`/veiculos/atualizar?id=${vehicle.vehicleId}`}
                          >
                            <PencilLine />
                          </Link>
                          <button
                            title="Excluir"
                            onClick={() => deleteVehicle(vehicle.vehicleId)}
                          >
                            <Trash />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-8 flex justify-between">
            <div className="flex gap-4">
              <Link href="veiculos/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar novo
                </Button>
              </Link>
              <Link href="veiculos/problemas">
                <Button className="flex gap-2 font-semibold">Problemas</Button>
              </Link>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="statusFilter"
                  onClick={() => setActive(!active)}
                />
                <label
                  htmlFor="statusFilter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apenas ATIVOS
                </label>
              </div>
            </div>
            <div className="py-2 px-6 rounded-md bg-muted">Total: {count}</div>
          </div>
        </>
      )}
    </div>
  );
}
