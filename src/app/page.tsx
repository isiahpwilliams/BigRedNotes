import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <nav className="flex w-full justify-end items-center px-4 text-black text-2xl">
        <div className="flex justify-center gap-4">
          <Link href={'/signup'}>Sign Up</Link>
          <div className="mb-1">|</div>
          <Link href={'/login'}>Log In</Link>
        </div>
      </nav>
      <div>

      </div>
    </div>
  );
}
