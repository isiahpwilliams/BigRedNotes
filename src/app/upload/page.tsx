"use client";

import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Navbar from "@/components/navbar.tsx";
import { useState, useRef, useCallback, useEffect } from "react";

type CourseItem = {
  id: number;
  name: string;
  subjectCode?: string;
  courseNumber?: string;
};

export default function Upload() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [subjectCode, setSubjectCode] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleOnSelect = (item: CourseItem) => {
    if (item.subjectCode != null && item.courseNumber != null) {
      setSubjectCode(item.subjectCode);
      setCourseNumber(item.courseNumber);
    } else {
      const parts = item.name.trim().split(/\s+/);
      setSubjectCode(parts[0] ?? "");
      setCourseNumber(parts.slice(1).join(" ") ?? "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjectCode.trim().toUpperCase();
    const num = courseNumber.trim();
    if (!sub) {
      setStatus("error");
      setMessage("Please enter a subject code (e.g. CS, PSYCH).");
      return;
    }
    if (!num) {
      setStatus("error");
      setMessage("Please enter a course number (e.g. 3780, 1101).");
      return;
    }
    if (!file) {
      setStatus("error");
      setMessage("Please select a file to upload.");
      return;
    }
    setStatus("uploading");
    setMessage("");
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("subjectCode", sub);
      formData.set("courseNumber", num);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      const isHtml = text.trimStart().toLowerCase().startsWith("<!doctype") || text.trimStart().toLowerCase().startsWith("<html");
      let data: { error?: string } = {};
      if (!isHtml) {
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
      }
      if (!res.ok) {
        setStatus("error");
        if (data.error) {
          setMessage(data.error);
        } else if (isHtml) {
          setMessage(
            res.status === 413
              ? "File too large. Try a smaller file (under 1MB) or restart dev server after config change."
              : `Server returned an error (${res.status}). Check the terminal running npm run dev for details.`
          );
        } else {
          setMessage(text?.slice(0, 150) || `Upload failed (${res.status}).`);
        }
        return;
      }
      setStatus("success");
      setMessage("File uploaded successfully.");
      setFile(null);
      setSubjectCode("");
      setCourseNumber("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadCourses();
    } catch (e) {
      setStatus("error");
      const errMsg = e instanceof Error ? e.message : "Upload failed.";
      setMessage(errMsg);
    }
  };

  return (
    <div className="area min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex justify-center items-center text-4xl text-black font-bold mb-4">
        <h1>Upload</h1>
      </div>
      <div className="flex justify-center items-center text-black text-xl mb-2">
        <p>Upload New Files Here</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Or pick an existing course
          </label>
          <ReactSearchAutocomplete<CourseItem>
            items={courses}
            onSelect={handleOnSelect}
            placeholder="e.g. CS 3780"
            resultStringKeyName="name"
            formatResult={(item: CourseItem) => item.name}
          />
        </div>

        <div className="w-full border-t border-gray-200 pt-4">
          <p className="block mb-3 text-sm font-medium text-gray-700">
            Enter course (subject + number)
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="subject-code" className="block text-xs text-gray-500 mb-1">
                Subject code
              </label>
              <input
                id="subject-code"
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                placeholder="e.g. CS"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={20}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="course-number" className="block text-xs text-gray-500 mb-1">
                Course number
              </label>
              <input
                id="course-number"
                type="text"
                value={courseNumber}
                onChange={(e) => setCourseNumber(e.target.value)}
                placeholder="e.g. 3780"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={20}
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Displayed as: {subjectCode.trim() || "…"} {courseNumber.trim() || "…"}
          </p>
        </div>

        <div className="flex justify-center items-center w-full">
          <label className="flex flex-col items-center justify-center w-full max-w-sm h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG or GIF (MAX. 10MB)</p>
              {file && (
                <p className="mt-2 text-sm text-gray-700 font-medium">{file.name}</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            type="submit"
            disabled={status === "uploading"}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {status === "uploading" ? "Uploading…" : "Submit"}
          </button>
        </div>

        {message && (
          <p
            className={
              status === "error"
                ? "text-red-600"
                : status === "success"
                  ? "text-green-600"
                  : "text-gray-600"
            }
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
