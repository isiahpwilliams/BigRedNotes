import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const subjectCode = formData.get("subjectCode") as string | null;
    const courseNumber = formData.get("courseNumber") as string | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }
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
      create: { subjectCode: sub, courseNumber: num },
    });

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name) || "";
    const baseName = path.basename(file.name, ext) || "file";
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);
    const uniqueName = `${safeBase}-${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    const note = await prisma.note.create({
      data: {
        name: file.name,
        fileUrl,
        courseId: course.id,
      },
    });

    return NextResponse.json({
      id: note.id,
      name: note.name,
      fileUrl: note.fileUrl,
      courseCode: `${course.subjectCode} ${course.courseNumber}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
