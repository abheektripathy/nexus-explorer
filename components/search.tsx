"use client"

import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function Search() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !mounted) return;

    // Check if the query is a number (block number)
    if (/^\d+$/.test(query)) {
      router.push(`/block/${query}`);
    }
    // Check if the query is a transaction hash (64 characters)
    else if (query.length === 64) {
      router.push(`/tx/${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by Block Number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-inherit border-white border-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white focus:border-opacity-10"
        />
      </div>
    </form>
  );
}