import Swal from "sweetalert2";
import api from "./axios";

export const deleteAction = async (
  module: string,
  path: string,
  fetchData: () => void
) => {
  Swal.fire({
    title: `Excluir ${module}?`,
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
        await api.delete(path);
        fetchData();
        Swal.fire({
          title: "Excluído!",
          text: "Esse dado acabou de ser apagado.",
          icon: "success",
        });
      } catch (error) {
        console.error("Erro excluir dado:", error);
      }
    }
  });
};
