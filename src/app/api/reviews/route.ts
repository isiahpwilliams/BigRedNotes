import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const professorId = searchParams.get("professorId");
    if (!professorId) {
      return NextResponse.json(
        { error: "professorId is required" },
        { status: 400 }
      );
    }
    const id = parseInt(professorId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid professorId" },
        { status: 400 }
      );
    }
    const reviews = await prisma.review.findMany({
      where: { professorId: id },
      orderBy: { createdAt: "desc" },
      include: { professor: true },
    });
    return NextResponse.json(
      reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        courseTag: r.courseTag,
        createdAt: r.createdAt.toISOString(),
        professorName: r.professor.name,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
