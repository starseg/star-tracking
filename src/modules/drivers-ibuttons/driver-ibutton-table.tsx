"use client";
import { useEffect, useState } from "react";
import { DriverIButton } from "@prisma/client";
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
  FilePdf,
  FilePlus,
  PencilLine,
  RadioButton,
  Trash,
  UserCircle,
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
import { driversIButtonsReport } from "@/lib/generate-pdf";

interface DriverIButtonData extends DriverIButton {
  driver: {
    name: string;
  };
  ibutton: {
    number: string;
    code: string;
  };
}

export default function DriverIButtonTable() {
  const [driversIButtons, setDriversIButtons] = useState<DriverIButtonData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(false);
  let count = 0;

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "driver-ibutton";
      else path = `driver-ibutton?query=${params.get("query")}`;
      const response = await api.get(path);
      setDriversIButtons(response.data);
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
          await api.delete(`driver-ibutton/${id}`);
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
                  <TableHead>IButton</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Vinculação</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driversIButtons.length > 0 ? (
                  driversIButtons.map((item) => {
                    if (active && item.status === "INACTIVE") return;
                    count++;
                    return (
                      <TableRow key={item.driverIButtonId}>
                        <TableCell>
                          {item.ibutton.code} - {item.ibutton.number}
                        </TableCell>
                        <TableCell>{item.driver.name}</TableCell>
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
                            href={`/motoristas-ibuttons/atualizar?id=${item.driverIButtonId}`}
                          >
                            <PencilLine />
                          </Link>
                          <button
                            title="Excluir"
                            onClick={() => deleteRelation(item.driverIButtonId)}
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
              <Link href="motoristas-ibuttons/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar novo
                </Button>
              </Link>
              <Link href="/motoristas">
                <Button className="flex gap-2 font-semibold">
                  <UserCircle size={24} /> Motoristas
                </Button>
              </Link>
              <Link href="/ibuttons">
                <Button className="flex gap-2 font-semibold">
                  <RadioButton size={24} /> I Buttons
                </Button>
              </Link>
              <Button
                className="flex gap-2 font-semibold"
                onClick={() => driversIButtonsReport(driversIButtons)}
              >
                <FilePdf size={24} /> Relatório
              </Button>
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
