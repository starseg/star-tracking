"use client";
import api from "@/lib/axios";
import { Programming } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Toast } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

export default function TextEditor() {
  const [text, setText] = useState<string>("");
  const [data, setData] = useState<Programming[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    try {
      const response = await api.get("programming");
      setText(response.data[response.data.length - 1].text);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const handleChange = (value: string) => {
    setText(value);
  };

  const handleSave = async () => {
    if (data && data.length < 1) {
      try {
        const response = await api.post("programming", {
          text: text,
        });
        if (response.status === 201) {
          Toast("Salvo com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao enviar dados para a API:", error);
        throw error;
      }
    } else {
      if (data)
        try {
          const response = await api.put(
            `programming/${data[data.length - 1].programmingId}`,
            {
              text: text,
            }
          );
          if (response.status === 200) {
            Toast("Salvo com sucesso!", "success");
          }
        } catch (error) {
          console.error("Erro ao enviar dados para a API:", error);
          throw error;
        }
    }
  };

  return (
    <>
      {isLoading ? (
        <p className="w-full text-center">Carregando...</p>
      ) : (
        <div className="flex flex-col mb-12">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Editor de Texto</h1>
            <Button
              onClick={handleSave}
              className="mb-2 flex gap-2 items-center justify-center"
            >
              <FloppyDisk size={24} /> Salvar
            </Button>
          </div>
          <div className={styles["quill-container"]}>
            <ReactQuill
              theme="snow"
              value={text}
              onChange={handleChange}
              modules={modules}
              className={styles["quill-editor"]}
            />
          </div>
        </div>
      )}
    </>
  );
}
