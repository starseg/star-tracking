"use client";
import { useEffect, useState } from "react";
import { IButton } from "@prisma/client";
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
  FileXls,
  MagnifyingGlass,
  PencilLine,
  RadioButton,
  Trash,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { deleteAction } from "@/lib/delete-action";
import { deleteFile } from "@/lib/firebase-upload";

interface IButtonProps extends IButton {
  deviceStatus: {
    deviceStatusId: number;
    description: string;
  };
}

export default function IButtonTable() {
  const [IButtons, setIButtons] = useState<IButtonProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSorted, setIsSorted] = useState(false);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "ibutton";
      else path = `ibutton?query=${params.get("query")}`;
      const response = await api.get<IButtonProps[]>(path);
      let data = response.data;

      setIButtons(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);

  const handleDownloadExcel = () => {
    const formattedIButtons = IButtons.map((ibutton) => ({
      numero: ibutton.number,
      codigo: ibutton.code,
      campo_prog: ibutton.programmedField,
      observacoes: ibutton.comments ? ibutton.comments : "nenhuma",
      status: ibutton.deviceStatus.description,
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
    link.download = `relatorio-ibuttons-${date}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const orderByProgFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsSorted(event.target.checked);
    if (event.target.checked) {
      setIButtons((prevIButtons) =>
        [...prevIButtons].sort(
          (a, b) => Number(b.programmedField) - Number(a.programmedField)
        )
      );
    } else {
      fetch();
    }
  };

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
                  <TableHead>ID</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Campo prog.</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {IButtons.length > 0 ? (
                  IButtons.map((IButton) => {
                    return (
                      <TableRow key={IButton.ibuttonId}>
                        <TableCell>{IButton.ibuttonId}</TableCell>
                        <TableCell>{IButton.number}</TableCell>
                        <TableCell>{IButton.code}</TableCell>
                        <TableCell>{IButton.programmedField}</TableCell>
                        <TableCell>
                          {IButton.comments ? IButton.comments : "Nenhuma"}
                        </TableCell>
                        <TableCell>
                          {IButton.deviceStatus.description}
                        </TableCell>
                        <TableCell className="flex gap-4 text-2xl">
                          <Link
                            href={`/ibuttons/detalhes?id=${IButton.ibuttonId}`}
                          >
                            <MagnifyingGlass />
                          </Link>
                          <Link
                            href={`/motoristas-ibuttons?query=${IButton.code}`}
                          >
                            <UserCircle />
                          </Link>
                          <Link
                            href={`/ibuttons/atualizar?id=${IButton.ibuttonId}`}
                          >
                            <PencilLine />
                          </Link>
                          <button
                            title="Excluir"
                            onClick={() => {
                              deleteAction(
                                "IButton",
                                `ibutton/${IButton.ibuttonId}`,
                                fetch
                              );
                              IButton.url1 && deleteFile(IButton.url1);
                              IButton.url2 && deleteFile(IButton.url2);
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mt-8">
            <div className="flex gap-4">
              <Link href="ibuttons/registro">
                <Button className="flex gap-2 font-semibold">
                  <FilePlus size={24} /> Registrar novo
                </Button>
              </Link>
              <Link href="motoristas-ibuttons">
                <Button className="flex gap-2 font-semibold">
                  <UserCircle size={24} /> + <RadioButton size={24} />
                </Button>
              </Link>
              <Button
                className="flex gap-2 font-semibold"
                onClick={handleDownloadExcel}
              >
                <FileXls size={24} /> Relatório
              </Button>
              <div className="flex items-center gap-2 p-2 border rounded">
                <input
                  type="checkbox"
                  checked={isSorted}
                  onChange={orderByProgFieldChange}
                />
                <Label>Ordenar por campo programado</Label>
              </div>
            </div>
            <div className="bg-muted px-6 py-2 rounded-md">
              Total: {IButtons.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
