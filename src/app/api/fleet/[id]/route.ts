import { Fleet, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const fleet = await prisma.fleet.findFirst({
    where: { fleetId: id },
  });
  if (fleet) {
    return NextResponse.json({ fleet }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Frota não encontrada" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const fleet = await prisma.fleet.delete({
    where: { fleetId: id },
  });
  if (fleet) {
    return NextResponse.json({ fleet }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Frota não encontrada" },
    { status: 404 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  return request
    .json()
    .then(async (data: Fleet) => {
      await prisma.fleet.update({
        where: { fleetId: id },
        data: {
          name: data.name,
          responsible: data.responsible,
          telephone: data.telephone,
          email: data.email,
          color: data.color,
          status: data.status,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}