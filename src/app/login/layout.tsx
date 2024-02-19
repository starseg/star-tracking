import BackButton from "@/components/back-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center">
      <BackButton className="absolute top-8 left-8" />
      {children}
    </main>
  );
}
