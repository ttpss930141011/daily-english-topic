'use client';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    // 對於主頁，不顯示 Header，讓 TopicGrid 來處理英雄部分
    if (pathname === '/' || pathname.startsWith('/topic/')) {
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
            </div>
        </header>
    );
} 