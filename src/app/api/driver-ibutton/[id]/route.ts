import { DriverIButton } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const driverIButton = await prisma.driverIButton.findFirst({
    where: { driverIButtonId: id },
  });
  if (driverIButton) {
    return NextResponse.json({ driverIButton }, { status: 200 });
  }
  return NextResponse.json(
    { message: "relação não encontrada" },
    { status: 404 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const driverIButton = await prisma.driverIButton.delete({
    where: { driverIButtonId: id },
  });
  if (driverIButton) {
    return NextResponse.json({ driverIButton }, { status: 200 });
  }
  return NextResponse.json(
    { message: "relação não encontrada" },
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
    .then(async (data: DriverIButton) => {
      await prisma.driverIButton.update({
        where: { driverIButtonId: id },
        data: {
          driverId: Number(data.driverId),
          ibuttonId: Number(data.ibuttonId),
          startDate: data.startDate,
          endDate: data.endDate,
          comments: data.comments,
          status: data.status,
        },
      });
      return NextResponse.json({ data }, { status: 200 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
