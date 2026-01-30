import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }
    const id = parseInt(courseId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }
    const notes = await (prisma as any).note.findMany({
      where: { courseId: id },
      orderBy: { createdAt: "desc" },
      include: { course: true },
    });
    return NextResponse.json(
      notes.map((n: { id: number; name: string; fileUrl: string; createdAt: Date; course: { subjectCode: string; courseNumber: string } }) => ({
        id: n.id,
        name: n.name,
        fileUrl: n.fileUrl,
        date: n.createdAt.toISOString().slice(0, 10),
        courseCode: `${n.course.subjectCode} ${n.course.courseNumber}`,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
