import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";
import { FleetLogin } from "@prisma/client";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: FleetLogin) => {
      await prisma.fleetLogin.create({
        data: {
          fleetId: data.fleetId,
          login: data.login,
          password: data.password,
          accessTo: data.accessTo,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}
