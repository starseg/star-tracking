import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const fleetEmail = await prisma.fleetEmail.delete({
    where: { fleetEmailId: id },
  });
  if (fleetEmail) {
    return NextResponse.json({ fleetEmail }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Frota não encontrada" },
    { status: 404 }
  );
}
