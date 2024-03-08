import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const comunicationDescription = await prisma.comunicationDescription.delete({
    where: { comunicationDescriptionId: id },
  });
  if (comunicationDescription) {
    return NextResponse.json({ comunicationDescription }, { status: 200 });
  }
  return NextResponse.json(
    { message: "problema não encontrado" },
    { status: 404 }
  );
}
