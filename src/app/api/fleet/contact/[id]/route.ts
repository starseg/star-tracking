import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const fleetContact = await prisma.fleetContact.delete({
    where: { fleetContactId: id },
  });
  if (fleetContact) {
    return NextResponse.json({ fleetContact }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Frota não encontrada" },
    { status: 404 }
  );
}
