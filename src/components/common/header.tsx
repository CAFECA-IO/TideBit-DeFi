'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 shadow-md">
            <Link href="/" className="text-xl font-bold tracking-wider text-blue-400">
                TideBit<span className="text-white">Admin</span>
            </Link>
            {/* Add user menu or nav items here if needed later */}
        </header>
    );
}
