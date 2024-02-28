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
import { useSearchParams } from "next/navigation";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

interface IButtonProps extends IButton {
  ibuttonStatus: {
    ibuttonStatusId: number;
    description: string;
  };
}

export default function IButtonTable() {
  // busca das frotas
  const [IButtons, setIButtons] = useState<IButtonProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const fetch = async () => {
    try {
      let path;
      if (!params.get("query")) path = "ibutton";
      else path = `ibutton?query=${params.get("query")}`;
      const response = await api.get(path);
      setIButtons(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, [searchParams]);
  // deletar frota
  const deleteIButton = async (id: number) => {
    Swal.fire({
      title: "Excluir IButton?",
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
          await api.delete(`ibutton/${id}`);
          fetch();
          Swal.fire({
            title: "Excluído!",
            text: "Esse IButton acabou de ser apagado.",
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
                <TableHead>ID</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Campo prog.</TableHead>
                <TableHead>Observação</TableHead>
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
                      <TableCell>{IButton.ibuttonStatus.description}</TableCell>
                      <TableCell>{IButton.code}</TableCell>
                      <TableCell>{IButton.programmedField}</TableCell>
                      <TableCell>
                        {IButton.comments ? IButton.comments : "Nenhuma"}
                      </TableCell>
                      <TableCell className="flex gap-4 text-2xl">
                        <Link href={`/motoristas?ibutton=${IButton.ibuttonId}`}>
                          <Car />
                        </Link>
                        <Link
                          href={`/ibuttons/atualizar?id=${IButton.ibuttonId}`}
                        >
                          <PencilLine />
                        </Link>
                        <button
                          title="Excluir"
                          onClick={() => deleteIButton(IButton.ibuttonId)}
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
            <Link href="ibuttons/registro">
              <Button className="flex gap-2 font-semibold">
                <FilePlus size={24} /> Registrar novo
              </Button>
            </Link>
            <div className="py-2 px-6 rounded-md bg-muted">
              Total: {IButtons.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
