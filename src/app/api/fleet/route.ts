import { Fleet } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

interface FleetData extends Fleet {
  responsible: string;
  telephone: string;
  email: string;
}

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: FleetData) => {
      const fleet = await prisma.fleet.create({
        data: {
          name: data.name,
          color: data.color,
        },
      });
      await prisma.fleetContact.create({
        data: {
          name: data.responsible,
          telephone: data.telephone,
          fleetId: fleet.fleetId,
        },
      });
      await prisma.fleetEmail.create({
        data: {
          email: data.email,
          fleetId: fleet.fleetId,
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
  let fleets;
  if (!query) {
    fleets = await prisma.fleet.findMany({
      include: { fleetContact: true, fleetEmail: true },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  } else {
    fleets = await prisma.fleet.findMany({
      include: {
        fleetContact: true,
        fleetEmail: true,
      },
      where: {
        OR: [
          { name: { contains: query as string } },
          { fleetContact: { some: { name: { contains: query as string } } } },
          {
            fleetContact: {
              some: { telephone: { contains: query as string } },
            },
          },
          { fleetEmail: { some: { email: { contains: query as string } } } },
        ],
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  }
  return NextResponse.json(fleets);
}
