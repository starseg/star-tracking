"use client";
import { Menu } from "@/components/menu";
import ModuleButton from "@/components/moduleButton";
import {
  Cpu,
  Footprints,
  RadioButton,
  Truck,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <>
      <Menu url="x" />
      <main className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl flex gap-2 items-center mb-8 hover:animate-bounce hover:text-primary transition-all">
          <Footprints weight="fill" /> Rastreamento
        </h1>
        <div className="flex gap-16 flex-wrap items-center justify-center">
          <ModuleButton url="motoristas">
            <UserCircle /> Motoristas
          </ModuleButton>
          <ModuleButton url="ibuttons">
            <RadioButton /> I Buttons
          </ModuleButton>
          <ModuleButton url="motoristas-ibuttons">
            <UserCircle /> + <RadioButton />
          </ModuleButton>
          <ModuleButton url="veiculos">
            <Truck /> Veículos
          </ModuleButton>
          <ModuleButton url="rastreadores">
            <Cpu /> Rastreadores
          </ModuleButton>
          <ModuleButton url="veiculos-rastreadores">
            <Truck /> + <Cpu />
          </ModuleButton>
          <ModuleButton url="frotas">
            <UsersThree /> Frotas
          </ModuleButton>
        </div>
      </main>
    </>
  );
}
