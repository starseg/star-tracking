import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";
import { FleetContact } from "@prisma/client";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: FleetContact) => {
      await prisma.fleetContact.create({
        data: {
          name: data.name,
          telephone: data.telephone,
          fleetId: data.fleetId,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
