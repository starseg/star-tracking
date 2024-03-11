import { VehicleTracker } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const vehicleTracker = await prisma.vehicleTracker.findFirst({
    where: { vehicleTrackerId: id },
  });
  if (vehicleTracker) {
    return NextResponse.json({ vehicleTracker }, { status: 200 });
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
  const vehicleTracker = await prisma.vehicleTracker.delete({
    where: { vehicleTrackerId: id },
  });
  if (vehicleTracker) {
    return NextResponse.json({ vehicleTracker }, { status: 200 });
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
    .then(async (data: VehicleTracker) => {
      await prisma.vehicleTracker.update({
        where: { vehicleTrackerId: id },
        data: {
          vehicleId: Number(data.vehicleId),
          trackerId: Number(data.trackerId),
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
