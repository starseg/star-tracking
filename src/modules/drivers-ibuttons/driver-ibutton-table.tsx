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
import { subDays } from "date-fns";
import { deleteAction } from "@/lib/delete-action";

interface DriverIButtonData extends DriverIButton {
  driver: {
    name: string;
    fleet: {
      name: string;
      color: string;
    };
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
  const [lastMonthOnly, setLastMonthOnly] = useState(false);

  let count = 0;
  const oneMonthAgo = subDays(new Date(), 30);

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
                    const startDate = new Date(item.startDate);
                    if (lastMonthOnly && startDate < oneMonthAgo) return;
                    count++;
                    return (
                      <TableRow key={item.driverIButtonId}>
                        <TableCell>
                          {item.ibutton.code} - {item.ibutton.number}
                        </TableCell>
                        <TableCell>
                          {item.driver.name}
                          <br />
                          <span
                            className="font-bold text-xs"
                            style={{ color: item.driver.fleet.color }}
                          >
                            {item.driver.fleet.name}
                          </span>
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
                                  <button className="max-w-[15ch] text-ellipsis whitespace-nowrap overflow-hidden">
                                    {item.comments}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="border-primary bg-stone-800 p-4 max-w-[300px] break-words">
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
                            onClick={() =>
                              deleteAction(
                                "relação",
                                `driver-ibutton/${item.driverIButtonId}`,
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mt-8">
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
                onClick={() =>
                  driversIButtonsReport(driversIButtons, active, lastMonthOnly)
                }
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
                  className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
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
                  className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                >
                  Último mês
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
