import Link from "next/link";
import React from "react";

export default function Navbar() {
    return (
        <nav className="flex w-full justify-end p-4 text-2xl text-black">
            <div className="flex gap-4">
                <Link href={'/files'}>Files</Link>
                <div className="mb-1">|</div>
                <Link href={'/upload'}>Upload</Link>
                <div className="mb-1">|</div>
                <Link href={'/reviews'}>Reviews</Link>
            </div>
        </nav>
    )
}