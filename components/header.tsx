"use client"

import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full border-b border-white border-opacity-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#3B81F6]">
          Nexus Explorer
        </Link>
        <div className="flex items-center gap-4">
          <Link href="https://github.com" className="hover:text-[#3B81F6] transition-colors">
            <Github className="w-6 h-6" />
          </Link>
          <Link href="https://twitter.com" className="hover:text-[#3B81F6] transition-colors">
            <Twitter className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}