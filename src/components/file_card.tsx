import Image from 'next/image';
import React from 'react';
import { StaticImageData } from 'next/image';

interface CardProps {
    name: string,
    date: string,
    picture: string | StaticImageData,
    alt: string
}

export default function FileCard({ name, date, picture, alt }: CardProps) {
    return (
        <div className='flex flex-col justify-center items-center border w-[250px] rounded-[5px] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] transition-all duration-300 text-black'>
            <p>{name}</p>
            <p>{date}</p>
            <Image src={picture} alt={alt} width={200} height={200} className="w-[200px] h-auto" />
        </div>
    )
}