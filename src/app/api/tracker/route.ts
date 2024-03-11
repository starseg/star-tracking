import { Tracker } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: Tracker) => {
      await prisma.tracker.create({
        data: {
          number: data.number,
          model: data.model,
          chipOperator: data.chipOperator,
          iccid: data.iccid,
          output: data.output,
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
  let trackers;
  if (!query) {
    trackers = await prisma.tracker.findMany({
      include: { deviceStatus: true },
      orderBy: [{ deviceStatusId: "asc" }, { trackerId: "asc" }],
    });
  } else {
    trackers = await prisma.tracker.findMany({
      where: {
        OR: [
          { number: { contains: query as string } },
          { model: { contains: query as string } },
          { chipOperator: { contains: query as string } },
          { iccid: { contains: query as string } },
          { output: { contains: query as string } },
          { comments: { contains: query as string } },
          { deviceStatus: { description: { contains: query as string } } },
        ],
      },
      include: { deviceStatus: true },
      orderBy: [{ deviceStatusId: "asc" }, { trackerId: "asc" }],
    });
  }
  return NextResponse.json(trackers);
}
