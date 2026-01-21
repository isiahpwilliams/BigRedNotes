"use client";

import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Navbar from '@/components/navbar.tsx';
import FileCard from '@/components/file_card';

type Item = {
    id: number;
    name: string;
}

export default function Files() {
    const classes = [{ id: 0, name: 'CS 3780' }, { id: 1, name: 'PSYCH 1101' }, { id: 2, name: 'CS 3410' }]

    return (
        <div className='area min-h-screen bg-white'>
            <Navbar />
            <div className='flex justify-center items-center'>
                <ReactSearchAutocomplete<Item> items={classes} className='w-4/5' />
            </div>
            <div className='flex items-center justify-center mt-8'>
                <FileCard name={'Logo'} date={'10-31-2025'} picture={'/transparent_logo.png'} alt={'Logo'} />
            </div>
        </div>
    )
}