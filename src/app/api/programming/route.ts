import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";
import { Programming } from "@prisma/client";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: Programming) => {
      await prisma.programming.create({
        data: {
          text: data.text,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}

export async function GET(request: NextRequest) {
  const programming = await prisma.programming.findMany();
  return NextResponse.json(programming);
}
