"use client"

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function Search() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const path = query.length === 64 ? '/tx' : '/block';
    router.push(`${path}?id=${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mt-8">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by Block / TxHash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#141414] border-white border-opacity-10 text-white placeholder-gray-400 focus:ring-[#3B81F6] focus:border-[#3B81F6]"
        />
      </div>
    </form>
  );
}