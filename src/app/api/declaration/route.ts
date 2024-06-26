import { Declaration } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: Declaration) => {
      await prisma.declaration.create({
        data: {
          title: data.title,
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
  let declarations;
  if (!query) {
    declarations = await prisma.declaration.findMany();
  } else {
    declarations = await prisma.declaration.findMany({
      where: {
        OR: [{ title: { contains: query as string } }],
      },
    });
  }
  return NextResponse.json(declarations);
}
