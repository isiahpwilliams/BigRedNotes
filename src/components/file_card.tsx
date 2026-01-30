import Image from 'next/image';
import React from 'react';
import { StaticImageData } from 'next/image';

interface CardProps {
    name: string;
    date: string;
    picture: string | StaticImageData;
    alt: string;
    fileUrl?: string;
}

export default function FileCard({ name, date, picture, alt, fileUrl }: CardProps) {
    const content = (
        <div className="flex flex-col justify-center items-center border w-[250px] rounded-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] transition-all duration-300 text-black hover:shadow-lg">
            <p className="font-medium truncate max-w-full px-2">{name}</p>
            <p className="text-sm text-gray-600">{date}</p>
            <Image src={picture} alt={alt} width={200} height={200} className="w-[200px] h-auto object-contain" />
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