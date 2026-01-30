"use client";

import { useState, useRef, useEffect } from "react";

export type SearchSelectItem = { id: number; name: string };

type Props = {
  items: SearchSelectItem[];
  onSelect: (item: SearchSelectItem) => void;
  placeholder?: string;
};

const MAX_RESULTS = 10;

export default function SearchSelect({ items, onSelect, placeholder = "Search..." }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filtered = query.trim()
    ? items.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : items;
  const show = filtered.slice(0, MAX_RESULTS);

  const handleSelect = (item: SearchSelectItem) => {
    onSelect(item);
    setQuery(item.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center w-full border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <span className="pl-3 text-gray-400" aria-hidden>
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="flex-1 py-3 px-2 text-black placeholder-gray-500 outline-none min-w-0"
        />
      </div>
      {isOpen && (
        <ul
          className="absolute left-0 right-0 mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-auto z-[1000]"
          role="listbox"
        >
          {show.length === 0 ? (
            <li className="py-3 px-4 text-gray-500 text-sm">No results</li>
          ) : (
            show.map((item) => (
              <li
                key={item.id}
                role="option"
                onClick={() => handleSelect(item)}
                onMouseDown={(e) => e.preventDefault()}
                className="py-2 px-4 text-black cursor-pointer hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg truncate"
              >
                {item.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
