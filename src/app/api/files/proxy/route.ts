import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isS3Configured,
  parseS3KeyFromUrl,
  getS3ObjectBody,
} from "@/lib/s3";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const noteIdParam = searchParams.get("noteId");
    if (!noteIdParam) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }
    const noteId = parseInt(noteIdParam, 10);
    if (Number.isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid noteId" }, { status: 400 });
    }

    const note = await (prisma as any).note.findUnique({
      where: { id: noteId },
    });
    if (!note) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const fileUrl = note.fileUrl as string;

    if (isS3Configured()) {
      const key = parseS3KeyFromUrl(fileUrl);
      if (!key) {
        return NextResponse.json(
          { error: "Invalid S3 file URL" },
          { status: 400 }
        );
      }
      const body = await getS3ObjectBody(key);
      const ext = path.extname(note.name).toLowerCase();
      const contentType =
        ext === ".pdf"
          ? "application/pdf"
          : ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : "application/octet-stream";
      return new NextResponse(body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=300",
        },
      });
    }

    if (!fileUrl.startsWith("/uploads/")) {
      return NextResponse.json(
        { error: "Invalid file URL" },
        { status: 400 }
      );
    }
    const filePath = path.join(process.cwd(), "public", fileUrl);
    const buffer = await readFile(filePath);
    const ext = path.extname(note.name).toLowerCase();
    const contentType =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".png"
          ? "image/png"
          : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : "application/octet-stream";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Proxy error:", message, e);
    return NextResponse.json(
      { error: "Failed to fetch file", detail: message },
      { status: 500 }
    );
  }
}
