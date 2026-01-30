"use client";

import Navbar from "@/components/navbar.tsx";
import SearchSelect, { type SearchSelectItem } from "@/components/search_select";
import { useState, useEffect, useCallback } from "react";

type ProfessorItem = { id: number; name: string };
type ReviewItem = {
  id: number;
  rating: number;
  comment: string | null;
  courseTag: string | null;
  createdAt: string;
  professorName: string;
};

export default function Reviews() {
  const [professors, setProfessors] = useState<ProfessorItem[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorItem | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProfessors = useCallback(async () => {
    try {
      const res = await fetch("/api/professors");
      if (res.ok) {
        const data = await res.json();
        setProfessors(data);
      }
    } catch {
      setProfessors([]);
    }
  }, []);

  useEffect(() => {
    loadProfessors();
  }, [loadProfessors]);

  useEffect(() => {
    if (!selectedProfessor) {
      setReviews([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/reviews?professorId=${selectedProfessor.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedProfessor]);

  const handleOnSelect = useCallback((item: SearchSelectItem) => {
    setSelectedProfessor(item);
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="area min-h-screen bg-white">
      <Navbar />
      <div className="flex justify-center items-center text-4xl text-black font-bold mb-4">
        <h1>Reviews</h1>
      </div>
      <div className="flex justify-center items-center text-black text-xl mb-2">
        <p>Search Professor (Rate My Professor–style reviews, read-only)</p>
      </div>
      <div className="w-full max-w-4xl mx-auto mb-6 px-4">
        <SearchSelect
          items={professors}
          onSelect={handleOnSelect}
          placeholder="Search professor..."
        />
      </div>

      {loading && (
        <p className="text-center text-gray-600">Loading reviews…</p>
      )}

      {!loading && selectedProfessor && reviews.length === 0 && (
        <p className="text-center text-gray-600">No reviews for this professor yet.</p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Reviews for {selectedProfessor?.name}
          </h2>
          {reviews.map((r) => (
            <article
              key={r.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-black"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-amber-600">
                  {"★".repeat(Math.min(5, r.rating))}
                  {"☆".repeat(5 - Math.min(5, r.rating))} {r.rating}/5
                </span>
                {r.courseTag && (
                  <span className="text-sm text-gray-500">{r.courseTag}</span>
                )}
                <span className="text-sm text-gray-400 ml-auto">
                  {formatDate(r.createdAt)}
                </span>
              </div>
              {r.comment && (
                <p className="text-gray-700 whitespace-pre-wrap">{r.comment}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
