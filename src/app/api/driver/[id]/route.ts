import { Driver } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const driver = await prisma.driver.findFirst({
    where: { driverId: id },
  });
  if (driver) {
    return NextResponse.json({ driver }, { status: 200 });
  }
  return NextResponse.json(
    { message: "motorista não encontrado" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const driver = await prisma.driver.delete({
    where: { driverId: id },
  });
  if (driver) {
    return NextResponse.json({ driver }, { status: 200 });
  }
  return NextResponse.json(
    { message: "motorista não encontrado" },
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
    .then(async (data: Driver) => {
      await prisma.driver.update({
        where: { driverId: id },
        data: {
          name: data.name,
          cpf: data.cpf,
          cnh: data.cnh,
          imageUrl: data.imageUrl,
          comments: data.comments,
          status: data.status,
          fleetId: Number(data.fleetId),
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
