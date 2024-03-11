import { DriverIButton } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: DriverIButton) => {
      await prisma.driverIButton.create({
        data: {
          driverId: Number(data.driverId),
          ibuttonId: Number(data.ibuttonId),
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
  let driversIButtons;
  if (!query) {
    driversIButtons = await prisma.driverIButton.findMany({
      include: {
        driver: {
          select: {
            name: true,
          },
        },
        ibutton: {
          select: {
            number: true,
            code: true,
          },
        },
      },
      orderBy: [{ status: "asc" }],
    });
  } else {
    driversIButtons = await prisma.driverIButton.findMany({
      include: {
        driver: {
          select: {
            name: true,
          },
        },
        ibutton: {
          select: {
            number: true,
            code: true,
          },
        },
      },
      where: {
        OR: [
          { driver: { name: { contains: query as string } } },
          { ibutton: { number: { contains: query as string } } },
          { ibutton: { code: { contains: query as string } } },
        ],
      },
      orderBy: [{ status: "asc" }],
    });
  }
  return NextResponse.json(driversIButtons);
}
