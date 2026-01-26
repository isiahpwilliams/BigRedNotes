"use client";

import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Navbar from '@/components/navbar.tsx';
import { useState } from 'react';

type Course = {
    id: number;
    name: string;
}

export default function Upload() {
    const [selected, setSelected] = useState("");
    const classes = [{ id: 0, name: 'CS 3780' }, { id: 1, name: 'PSYCH 1101' }, { id: 2, name: 'CS 3410' }]

    const handleOnSelect = (item: Course) => {
        setSelected(item.name)
    };
    return (
        <div className='area min-h-screen bg-white text-black'>
            <Navbar />
            <div className='flex justify-center items-center text-4xl text-black font-bold mb-4'>
                <h1>Upload</h1>
            </div>
            <div className='flex justify-center items-center text-black text-xl mb-2'>
                <p>Upload New Files Here</p>
            </div>
            <div className='flex justify-center items-center'>
                <ReactSearchAutocomplete<Course> items={classes} className='w-4/5' onSelect={handleOnSelect} />
            </div>
            <div className='flex justify-center items-center mt-8'>
                <label className='flex flex-col items-center justify-center w-96 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <svg className='w-10 h-10 mb-3 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                        </svg>
                        <p className='mb-2 text-sm text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                        <p className='text-xs text-gray-500'>PDF, PNG, JPG or GIF (MAX. 10MB)</p>
                    </div>
                    <input type='file' className='hidden' />
                </label>
            </div>
            <div className='flex justify-center items-center mt-6'>
                <button type='submit' className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg'>
                    Submit
                </button>
            </div>
        </div>
    )
}