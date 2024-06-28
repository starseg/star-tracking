import { VehicleTracker } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: VehicleTracker) => {
      await prisma.vehicleTracker.create({
        data: {
          vehicleId: data.vehicleId,
          trackerId: data.trackerId,
          comments: data.comments,
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
  let vehiclesTrackers;
  if (!query) {
    vehiclesTrackers = await prisma.vehicleTracker.findMany({
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            code: true,
            fleet: {
              select: {
                fleetId: true,
                name: true,
                color: true,
              },
            },
          },
        },
        tracker: {
          select: {
            number: true,
          },
        },
      },
      orderBy: [{ status: "asc" }],
    });
  } else {
    vehiclesTrackers = await prisma.vehicleTracker.findMany({
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            code: true,
            fleet: {
              select: {
                fleetId: true,
                name: true,
                color: true,
              },
            },
          },
        },
        tracker: {
          select: {
            number: true,
          },
        },
      },
      where: {
        OR: [
          { vehicle: { licensePlate: { contains: query as string } } },
          { vehicle: { code: { contains: query as string } } },
          { tracker: { number: { contains: query as string } } },
        ],
      },
      orderBy: [{ status: "asc" }],
    });
  }
  return NextResponse.json(vehiclesTrackers);
}
