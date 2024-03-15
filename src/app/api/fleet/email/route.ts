import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";
import { FleetEmail } from "@prisma/client";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: FleetEmail) => {
      await prisma.fleetEmail.create({
        data: {
          email: data.email,
          fleetId: data.fleetId,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
