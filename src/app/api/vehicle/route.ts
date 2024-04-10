import { StringDateFormat } from "@/lib/utils";
import { Vehicle } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: Vehicle) => {
      await prisma.vehicle.create({
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
          url: data.url,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  let vehicles;
  if (!query) {
    vehicles = await prisma.vehicle.findMany({
      include: { fleet: true },
      orderBy: [{ status: "asc" }, { licensePlate: "asc" }],
    });
  } else {
    vehicles = await prisma.vehicle.findMany({
      include: { fleet: true },
      where: {
        OR: [
          { licensePlate: { contains: query as string } },
          { model: { contains: query as string } },
          { code: { contains: query as string } },
          { fleet: { name: { contains: query as string } } },
          { year: { contains: query as string } },
        ],
      },
      orderBy: [{ status: "asc" }, { licensePlate: "asc" }],
    });
  }
  return NextResponse.json(vehicles);
}
