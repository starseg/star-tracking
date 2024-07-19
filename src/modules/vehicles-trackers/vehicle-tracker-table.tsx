"use client";
import { useEffect, useState } from "react";
import { VehicleTracker } from "@prisma/client";
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
  FileXls,
  PencilLine,
  Trash,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
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
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/lib/utils";
import { vehiclesTrackersReport } from "@/lib/generate-pdf";
import { format, subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";

interface VehicleTrackerData extends VehicleTracker {
  vehicle: {
    licensePlate: string;
    code: string;
    fleet: {
      fleetId: number;
      name: string;
      color: string;
    };
  };
  tracker: {
    number: string;
  };
}

export default function VehicleTrackerTable() {
  // busca das frotas
  const [vehiclesTrackers, setVehiclesTrackers] = useState<
    VehicleTrackerData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [lastMonthOnly, setLastMonthOnly] = useState(false);
  let count = 0;
  const oneMonthAgo = subDays(new Date(), 30);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "vehicle-tracker";
      else path = `vehicle-tracker?query=${params.get("query")}`;
      const response = await api.get(path);
      setVehiclesTrackers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);

  const deleteRelation = async (id: number) => {
    Swal.fire({
      title: "Excluir relação?",
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
          await api.delete(`vehicle-tracker/${id}`);
          fetch();
          Swal.fire({
            title: "Excluída!",
            text: "Essa relação acabou de ser apagada.",
            icon: "success",
          });
        } catch (error) {
          console.error("Erro excluir dado:", error);
        }
      }
    });
  };

  const handleDownloadExcel = () => {
    const formattedIButtons = vehiclesTrackers.map((item) => ({
      rastreador: item.tracker.number,
      veiculo:
        item.vehicle.licensePlate +
        " - " +
        item.vehicle.code +
        " - " +
        item.vehicle.fleet.name,
      vinculacao: dateFormat(item.startDate),
      observacoes: item.comments ? item.comments : "nenhuma",
      status: item.status === "ACTIVE" ? "Ativo" : "Inativo",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedIButtons);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Gera um arquivo Excel e cria um link temporário para download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const date = format(new Date(), "dd-MM-yyyy");
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-veiculos-rastreadores-${date}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table className="border border-stone-800">
              <TableHeader className="bg-stone-800 font-semibold">
                <TableRow>
                  <TableHead>Rastreador</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Vinculação</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiclesTrackers.length > 0 ? (
                  vehiclesTrackers.map((item) => {
                    if (active && item.status === "INACTIVE") return;
                    const startDate = new Date(item.startDate);
                    if (lastMonthOnly && startDate < oneMonthAgo) return;
                    count++;
                    return (
                      <TableRow key={item.vehicleTrackerId}>
                        <TableCell>{item.tracker.number}</TableCell>
                        <TableCell>
                          <p>
                            {item.vehicle.licensePlate} - {item.vehicle.code}
                          </p>
                          <p
                            className="font-bold"
                            style={{ color: item.vehicle.fleet.color }}
                          >
                            {item.vehicle.fleet.name}
                          </p>
                        </TableCell>
                        <TableCell>
                          {dateFormat(item.startDate)}
                          {item.endDate && " a " + dateFormat(item.endDate)}
                        </TableCell>
                        <TableCell>
                          {item.comments ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="max-w-[15ch] text-ellipsis overflow-hidden whitespace-nowrap">
                                    {item.comments}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px] border-primary bg-stone-800 p-4 break-words">
                                  <p>{item.comments}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            "Nenhuma"
                          )}
                        </TableCell>
                        <TableCell>
                          {item.status === "ACTIVE" ? (
                            <p className="text-green-400">ATIVO</p>
                          ) : (
                            <p className="text-red-400">INATIVO</p>
                          )}
                        </TableCell>
                        <TableCell className="flex gap-4 text-2xl">
                          <Link
                            href={`/veiculos-rastreadores/atualizar?id=${item.vehicleTrackerId}`}
                          >
                            <PencilLine />
                          </Link>
                          <button
                            title="Excluir"
                            onClick={() =>
                              deleteRelation(item.vehicleTrackerId)
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-8 flex justify-between">
            <div className="flex gap-4">
              <Link href="/veiculos-rastreadores/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar novo
                </Button>
              </Link>
              <Link href="/veiculos">
                <Button className="flex gap-2 font-semibold">
                  <Truck size={24} /> Veículos
                </Button>
              </Link>
              <Link href="/rastreadores">
                <Button className="flex gap-2 font-semibold">
                  <Cpu size={24} /> Rastreadores
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex gap-2 font-semibold">
                    Relatórios
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button
                      variant={"ghost"}
                      className="flex gap-2 font-semibold w-full"
                      onClick={() =>
                        vehiclesTrackersReport(
                          vehiclesTrackers,
                          active,
                          lastMonthOnly
                        )
                      }
                    >
                      <FilePdf size={24} /> PDF
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant={"ghost"}
                      className="flex gap-2 font-semibold w-full"
                      onClick={handleDownloadExcel}
                    >
                      <FileXls size={24} /> Excel
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="dateFilter"
                  onClick={() => setLastMonthOnly(!lastMonthOnly)}
                />
                <label
                  htmlFor="dateFilter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Último mês
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
