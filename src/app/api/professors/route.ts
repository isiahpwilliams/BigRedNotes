import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const professors = await prisma.professor.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      professors.map((p) => ({ id: p.id, name: p.name }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    );
  }
}
