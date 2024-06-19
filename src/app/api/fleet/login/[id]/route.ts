import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const fleetLogin = await prisma.fleetLogin.delete({
    where: { fleetLoginId: id },
  });
  if (fleetLogin) {
    return NextResponse.json({ fleetLogin }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Login não encontrado" },
    { status: 404 }
  );
}
