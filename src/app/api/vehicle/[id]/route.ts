import { StringDateFormat } from "@/lib/utils";
import { Vehicle, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const vehicle = await prisma.vehicle.findFirst({
    where: { vehicleId: id },
    include: {
      fleet: {
        select: {
          name: true,
          color: true,
        },
      },
    },
  });
  if (vehicle) {
    return NextResponse.json({ vehicle }, { status: 200 });
  }
  return NextResponse.json(
    { message: "veiculo não encontrado" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const vehicle = await prisma.vehicle.delete({
    where: { vehicleId: id },
  });
  if (vehicle) {
    return NextResponse.json({ vehicle }, { status: 200 });
  }
  return NextResponse.json(
    { message: "veiculo não encontrado" },
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
    .then(async (data: Vehicle) => {
      await prisma.vehicle.update({
        where: { vehicleId: id },
        data: {
          model: data.model,
          licensePlate: data.licensePlate,
          code: data.code,
          renavam: data.renavam,
          chassis: data.chassis,
          year: data.year,
          installationDate: StringDateFormat(data.installationDate),
          comments: data.comments,
          fleetId: data.fleetId,
          status: data.status,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
