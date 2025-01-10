"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountState } from '@/types/api';
import { fetchAccountState } from '@/lib/api';


const SAMPLE_ACCOUNTS = [
  '1f5ff885ceb5bf1350c4449316b7d703034c1278ab25bcc923d5347645a0117e',
  '31b8a7e9f916616a8ed5eb471a36e018195c319600cbd3bbe726d1c96f03568d'
];

interface AccountDisplay extends AccountState {
  id: string;
}

export function AccountStates() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountDisplay[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountPromises = SAMPLE_ACCOUNTS.map(async (id) => {
          const response = await fetchAccountState(id);
          if (!response.ok) {
            throw new Error(`Failed to fetch account state for ${id}`);
          }
          const data = await response.json();
          return {
            ...data.account,
            id
          };
        });

        const results = await Promise.all(accountPromises);
        setAccounts(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch account states');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const formatHash = (hash: number[]) => {
    return `0x${hash.map(n => n.toString(16).padStart(2, '0')).join('').slice(0, 10)}...`;
  };

  if (loading) {
    return (
      <Card className="p-6 bg-[#141414] border-white border-opacity-5">
        <Skeleton className="h-8 w-48 bg-[#242424]" />
        <Skeleton className="h-64 mt-6 bg-[#242424]" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-[#141414] border-white border-opacity-5">
        <div className="text-red-400">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className='text-wrap'>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#141414] border-white border-opacity-5">
      <h2 className="text-xl font-bold text-[#3B81F6] mb-6">Account States</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-white border-opacity-5">
            <TableHead className="text-gray-400">Account ID</TableHead>
            <TableHead className="text-gray-400">Height</TableHead>
            <TableHead className="text-gray-400">Last Proof</TableHead>
            <TableHead className="text-gray-400">State Root</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id} className="border-white border-opacity-5">
              <TableCell className="font-mono">{account.id}</TableCell>
              <TableCell>{account.height}</TableCell>
              <TableCell>{account.last_proof_height}</TableCell>
              <TableCell className="font-mono">{formatHash(account.state_root)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}