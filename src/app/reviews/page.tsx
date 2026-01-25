"use client";

import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Navbar from '@/components/navbar.tsx';
import { useState } from 'react';

type Professor = {
    id: number,
    name: string
}

export default function Reviews() {
    const [selected, setSelected] = useState("");
    const professors = [{ id: 0, name: 'Walker White' }, { id: 1, name: 'Ken Birman' }, { id: 2, name: 'Adrian Sampson' }]

    const handleOnSelect = (item: Professor) => {
        setSelected(item.name)
    };

    return (
        <div className="area min-h-screen bg-white">
            <Navbar />
            <div className='flex justify-center items-center text-4xl text-black font-bold mb-4'>
                <h1>Reviews</h1>
            </div>
            <div className='flex justify-center items-center text-black text-xl mb-2'>
                <p>Search Professor</p>
            </div>
            <div className='flex justify-center items-center'>
                <ReactSearchAutocomplete<Professor> items={professors} className='w-4/5' onSelect={handleOnSelect}/>
            </div>
        </div>
    )
}