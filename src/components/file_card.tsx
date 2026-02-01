import Image from "next/image";
import React from "react";
import { StaticImageData } from "next/image";
import PdfThumbnail from "./pdf_thumbnail";

interface CardProps {
  name: string;
  date: string;
  picture: string | StaticImageData;
  alt: string;
  fileUrl?: string;
  /** When true, show PDF first-page thumbnail instead of picture. Requires noteId for proxy. */
  isPdf?: boolean;
  noteId?: number;
}

const isExternalUrl = (src: string | StaticImageData): src is string =>
  typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"));

export default function FileCard({
  name,
  date,
  picture,
  alt,
  fileUrl,
  isPdf,
  noteId,
}: CardProps) {
  const thumbnailArea =
    isPdf && noteId != null ? (
      <PdfThumbnail
        src={`/api/files/proxy?noteId=${noteId}`}
        alt={alt}
        className="w-[200px] min-h-[200px] flex items-center justify-center"
      />
    ) : isExternalUrl(picture) ? (
      <img
        src={picture}
        alt={alt}
        className="w-[200px] h-auto object-contain"
        width={200}
        height={200}
      />
    ) : (
      <Image
        src={picture}
        alt={alt}
        width={200}
        height={200}
        className="w-[200px] h-auto object-contain"
      />
    );

  const content = (
    <div className="flex flex-col justify-center items-center border w-[250px] rounded-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] transition-all duration-300 text-black hover:shadow-lg">
      <p className="font-medium truncate max-w-full px-2">{name}</p>
      <p className="text-sm text-gray-600">{date}</p>
      {thumbnailArea}
    </div>
  );
  if (fileUrl) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return content;
}