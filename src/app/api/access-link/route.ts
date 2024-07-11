import { AccessLink } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function POST(request: NextRequest) {
  return request
    .json()
    .then(async (data: AccessLink) => {
      await prisma.accessLink.create({
        data: {
          title: data.title,
          login: data.login,
          password: data.password,
          link: data.link,
        },
      });
      return NextResponse.json({ data }, { status: 201 });
    })
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 500 });
    });
}

export async function GET(request: NextRequest) {
  const accessLinks = await prisma.accessLink.findMany();
  return NextResponse.json(accessLinks);
}
