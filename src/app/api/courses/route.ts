import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function displayCode(subjectCode: string, courseNumber: string) {
  return `${subjectCode.trim().toUpperCase()} ${courseNumber.trim()}`;
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ subjectCode: "asc" }, { courseNumber: "asc" }],
    });
    return NextResponse.json(
      courses.map((c: { id: number; subjectCode: string; courseNumber: string }) => ({
        id: c.id,
        name: displayCode(c.subjectCode, c.courseNumber),
        subjectCode: c.subjectCode,
        courseNumber: c.courseNumber,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subjectCode, courseNumber, name } = body;
    if (!subjectCode || typeof subjectCode !== "string") {
      return NextResponse.json(
        { error: "Subject code is required" },
        { status: 400 }
      );
    }
    if (!courseNumber || typeof courseNumber !== "string") {
      return NextResponse.json(
        { error: "Course number is required" },
        { status: 400 }
      );
    }
    const sub = subjectCode.trim().toUpperCase();
    const num = courseNumber.trim();
    const course = await prisma.course.upsert({
      where: { subjectCode_courseNumber: { subjectCode: sub, courseNumber: num } },
      update: {},
      create: { subjectCode: sub, courseNumber: num, name: name?.trim() || null },
    });
    return NextResponse.json({
      id: course.id,
      name: displayCode(course.subjectCode, course.courseNumber),
      subjectCode: course.subjectCode,
      courseNumber: course.courseNumber,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
