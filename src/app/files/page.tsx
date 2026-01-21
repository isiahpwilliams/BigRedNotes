import Navbar from '@/components/navbar.tsx';
import FileCard from '@/components/file_card';

export default function Files() {
    return (
        <div className='area min-h-screen bg-white'>
            <Navbar />
            <FileCard name={'Logo'} date={'10-31-2025'} picture={'/transparent_logo.png'} alt={'Logo'} />
        </div>
    )
}