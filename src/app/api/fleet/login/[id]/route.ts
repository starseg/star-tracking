import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const fleetLogin = await prisma.fleetLogin.delete({
    where: { fleetLoginId: id },
  });
  if (fleetLogin) {
    return NextResponse.json({ fleetLogin }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Login não encontrado" },
    { status: 404 }
  );
}

interface StatusData {
  status: "ACTIVE" | "INACTIVE";
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const data: StatusData = await request.json();
    if (!["ACTIVE", "INACTIVE"].includes(data.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedLogin = await prisma.fleetLogin.update({
      where: { fleetLoginId: id },
      data: { status: data.status },
    });

    return NextResponse.json({ updatedLogin }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating fleetLogin:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
