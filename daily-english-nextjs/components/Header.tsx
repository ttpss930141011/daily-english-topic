'use client';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    if (pathname.startsWith('/topic/')) {
        return null;
    }
    return (
        <header className="relative py-20 text-center">
            <div className="relative z-10 mx-auto max-w-4xl px-6">
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white/80 to-white/60">
                    Daily English Topics
                </h1>
                <p className="mt-4 text-lg text-white/80">
                    Learn English through interactive slide presentations from Reddit discussions.
                </p>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="text-3xl font-bold">13</div>
                        <div className="mt-1 text-sm uppercase text-white/80">Total Topics</div>
                    </div>
                    <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="text-3xl font-bold">Daily</div>
                        <div className="mt-1 text-sm uppercase text-white/80">New Content</div>
                    </div>
                    <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="text-3xl font-bold">100%</div>
                        <div className="mt-1 text-sm uppercase text-white/80">Free Access</div>
                    </div>
                </div>
            </div>
        </header>
    );
} 