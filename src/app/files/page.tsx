"use client";

import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Navbar from '@/components/navbar.tsx';
import FileCard from '@/components/file_card';
import { useState } from 'react';

type Course = {
    id: number;
    name: string;
}

export default function Files() {
    const [selected, setSelected] = useState("");
    const classes = [{ id: 0, name: 'CS 3780' }, { id: 1, name: 'PSYCH 1101' }, { id: 2, name: 'CS 3410' }]

    const handleOnSelect = (item: Course) => {
        setSelected(item.name)
    };

    return (
        <div className='area min-h-screen bg-white'>
            <Navbar />
            <div className='flex justify-center items-center text-4xl text-black font-bold mb-4'>
                <h1>Notes</h1>
            </div>
            <div className='flex justify-center items-center text-black text-xl mb-2'>
                <p>Filter Notes by Course Code</p>
            </div>
            <div className='flex justify-center items-center'>
                <ReactSearchAutocomplete<Course> items={classes} className='w-4/5' onSelect={handleOnSelect}/>
            </div>
            <div className='flex items-center justify-center mt-8'>
                <FileCard name={'Logo'} date={'10-31-2025'} picture={'/transparent_logo.png'} alt={'Logo'} />
            </div>
        </div>
    )
}