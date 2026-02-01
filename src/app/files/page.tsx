"use client";

import Navbar from "@/components/navbar.tsx";
import FileCard from "@/components/file_card";
import SearchSelect, { type SearchSelectItem } from "@/components/search_select";
import { useState, useEffect, useCallback } from "react";

type CourseItem = { id: number; name: string };
type FileItem = {
  id: number;
  name: string;
  fileUrl: string;
  imageUrl?: string;
  date: string;
};

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg)$/i;
const PDF_EXT = /\.pdf$/i;

export default function Files() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch {
      setCourses([]);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (!selectedCourse) {
      setFiles([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/files?courseId=${selectedCourse.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setFiles(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setFiles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCourse]);

  const handleOnSelect = useCallback((item: SearchSelectItem) => {
    setSelectedCourse(item);
  }, []);

  return (
    <div className="area min-h-screen bg-white">
      <Navbar />
      <div className="flex justify-center items-center text-4xl text-black font-bold mb-4">
        <h1>Notes</h1>
      </div>
      <div className="flex justify-center items-center text-black text-xl mb-2">
        <p>Filter Notes by Course Code</p>
      </div>
      <div className="w-full max-w-4xl mx-auto mb-6 px-4">
        <SearchSelect
          items={courses}
          onSelect={handleOnSelect}
          placeholder="Search course code..."
        />
      </div>

      {loading && (
        <p className="text-center text-gray-600">Loading files…</p>
      )}

      {!loading && selectedCourse && files.length === 0 && (
        <p className="text-center text-gray-600">No files for this course yet.</p>
      )}

      {!loading && files.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {files.map((f) => {
            const isPdf = PDF_EXT.test(f.name);
            return (
              <FileCard
                key={f.id}
                name={f.name}
                date={f.date}
                picture={
                  IMAGE_EXT.test(f.fileUrl)
                    ? f.imageUrl ?? f.fileUrl
                    : "/file.svg"
                }
                alt={f.name}
                fileUrl={f.imageUrl ?? f.fileUrl}
                isPdf={isPdf}
                noteId={isPdf ? f.id : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
