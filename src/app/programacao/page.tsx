import { Menu } from "@/components/menu";
import TextEditor from "@/modules/programming/text-editor";
import { ToastContainer } from "react-toastify";

export default function Programming() {
  return (
    <>
      <Menu url="/painel" />
      <div className="max-w-screen-lg mx-auto">
        <TextEditor />
      </div>
      <ToastContainer />
    </>
  );
}
