"use client";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {}

export default function BackButton({ className }: ButtonProps) {
  const router = useRouter();

  function goBack() {
    router.back();
  }

  return (
    <button
      className={cn("hover:scale-110 transition ease-in", className)}
      onClick={goBack}
    >
      <ArrowLeft size={"2.5rem"} />
    </button>
  );
}
