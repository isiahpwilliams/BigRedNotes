"use client";

import React, { useEffect, useRef, useState } from "react";

const THUMB_WIDTH = 200;
const THUMB_HEIGHT = 260;

interface PdfThumbnailProps {
  /** URL to fetch the PDF (e.g. /api/files/proxy?noteId=123) */
  src: string;
  alt: string;
  className?: string;
}

export default function PdfThumbnail({ src, alt, className }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || !canvasRef.current) return;
    let cancelled = false;

    async function renderFirstPage() {
      try {
        const res = await fetch(src);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} ${text}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer.byteLength === 0) throw new Error("Empty PDF response");

        const pdfjsLib = await import("pdfjs-dist");
        // Required in browser: set worker so PDF.js can parse (use local copy from public/)
        if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions?.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
        }
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          useSystemFonts: true,
          disableFontFace: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const numPages = pdf.numPages;
        if (numPages < 1) {
          setLoading(false);
          return;
        }
        const page = await pdf.getPage(1);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          THUMB_WIDTH / viewport.width,
          THUMB_HEIGHT / viewport.height,
          1.5
        );
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = Math.floor(scaledViewport.width);
        canvas.height = Math.floor(scaledViewport.height);

        const renderTask = page.render({
          canvasContext: context,
          viewport: scaledViewport,
        });
        await renderTask.promise;
        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) {
          console.error("PdfThumbnail error:", e);
          setError(true);
          setLoading(false);
        }
      }
    }

    renderFirstPage();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return (
      <div
        className={className}
        style={{
          width: THUMB_WIDTH,
          height: THUMB_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        PDF preview unavailable
      </div>
    );
  }

  return (
    <div className={className} style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          Loading…
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: THUMB_WIDTH,
          height: "auto",
          maxHeight: THUMB_HEIGHT,
          objectFit: "contain",
          display: loading ? "none" : "block",
        }}
        aria-label={alt}
      />
    </div>
  );
}
