"use client"

import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Search } from './search';

export function Header() {
  return (
    <header className="w-full border-b border-white border-opacity-5">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
      <Search/>
        <div className="absolute right-6 ">
          <Link href="https://github.com/availproject/nexus" className="hover:text-[#3B81F6] transition-colors">
            <Github className="w-4 h-4 text-opacity-75 text-white" />
          </Link>

        </div>
      </div>
    </header>
  );
}