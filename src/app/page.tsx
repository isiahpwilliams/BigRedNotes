import Link from "next/link";
import Image from 'next/image';
import Logo from '../assets/transparent_logo.png';

export default function Home() {
  return (
    <div className="area min-h-screen bg-white text-black font-sans p-2">
      <nav className="flex w-full justify-end p-4 text-2xl">
        <div className="flex gap-4">
          <Link href={'/signup'}>Sign Up</Link>
          <div className="mb-1">|</div>
          <Link href={'/login'}>Log In</Link>
        </div>
      </nav>
      <div className="flex items-center justify-center gap-10 mt-10">
        <div className="flex justify-center text-left flex-col gap-4">
          <div>
            <h2 className="text-4xl font-bold">Big Red Notes</h2>
            <p className="text-xl font-bold">Cornell's Premier Note Sharing Platform</p>
          </div>
          <p className="text-xl">Sign up with your Cornell email to access!</p>
          <p className="text-xl">Contribute to the community and submit your old notes!</p>
        </div>
        <div className="flex">
          <Image src={Logo} alt={"Cornell Logo"} className="max-h-100 w-auto" />
        </div>
      </div>
    </div>
  );
}
