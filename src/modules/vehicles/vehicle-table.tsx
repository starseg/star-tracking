"use client";
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
  Cpu,
  FilePdf,
  FilePlus,
  LinkBreak,
  MagnifyingGlass,
  PencilLine,
  Trash,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { dateFormat } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { vehicleReport } from "@/lib/generate-pdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteAction } from "@/lib/delete-action";
import { deleteFile } from "@/lib/firebase-upload";

interface VehicleData extends Vehicle {
  fleet: {
    name: string;
    color: string;
  };
}

export default function VehicleTable() {
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

  return (
    <div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table className="border-stone-800 border">
              <TableHeader className="top-0 sticky bg-stone-800 font-semibold">
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="max-w-[18ch] text-ellipsis whitespace-nowrap overflow-hidden">
                                  {vehicle.fleet.name}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="border-primary bg-stone-800 p-4 max-w-[300px] break-words">
                                <p>{vehicle.fleet.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{vehicle.licensePlate}</TableCell>
                        <TableCell>{vehicle.code}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="max-w-[15ch] text-ellipsis whitespace-nowrap overflow-hidden">
                                  {vehicle.model}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="border-primary bg-stone-800 p-4 max-w-[300px] break-words">
                                <p>{vehicle.model}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
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
                            onClick={() => {
                              deleteAction(
                                "Veículo",
                                `vehicle/${vehicle.vehicleId}`,
                                fetch
                              );
                              vehicle.url && deleteFile(vehicle.url);
                            }}
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
          <div className="flex justify-between mt-8">
            <div className="flex gap-4">
              <Link href="veiculos/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar novo
                </Button>
              </Link>
              <Link href="veiculos/problemas">
                <Button className="flex gap-2 font-semibold">
                  <LinkBreak size={24} />
                  Problemas
                </Button>
              </Link>
              <Button
                className="flex gap-2 font-semibold"
                onClick={() => vehicleReport(vehicles)}
              >
                <FilePdf size={24} /> Relatório
              </Button>
              <Link href="veiculos-rastreadores">
                <Button className="flex gap-2 font-semibold">
                  <Truck size={24} /> + <Cpu size={24} />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="statusFilter"
                  onClick={() => setActive(!active)}
                />
                <label
                  htmlFor="statusFilter"
                  className="font-medium text-sm leading-none"
                >
                  Apenas ATIVOS
                </label>
              </div>
            </div>
            <div className="bg-muted px-6 py-2 rounded-md">Total: {count}</div>
          </div>
        </>
      )}
    </div>
  );
}
