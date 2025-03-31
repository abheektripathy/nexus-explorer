"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedAccount, setExpandedAccount] = useState<string | null>(SAMPLE_ACCOUNTS[0]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

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

  useEffect(() => {
    if (copiedHash) {
      const timer = setTimeout(() => setCopiedHash(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedHash]);

  const formatHash = (hash: string | number[]) => {
    if (Array.isArray(hash)) {
      const fullHash = hash.map(n => n.toString(16).padStart(2, '0')).join('');
      return `${fullHash.slice(0, 4)}...${fullHash.slice(-3)}`;
    }
    return `${hash.slice(0, 4)}...${hash.slice(-3)}`;
  };

  const copyToClipboard = async (hash: string | number[]) => {
    const fullHash = Array.isArray(hash) 
      ? hash.map(n => n.toString(16).padStart(2, '0')).join('')
      : hash;
    await navigator.clipboard.writeText(fullHash);
    setCopiedHash(fullHash);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-[#141414] border-white border-opacity-5">
        <Skeleton className="h-8 w-48 bg-zinc-800" />
        <div className="space-y-4 mt-6">
          <Skeleton className="h-20 bg-zinc-800" />
          <Skeleton className="h-20 bg-zinc-800" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-[#141414] border-white border-opacity-5">
        <div className="text-red-400">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-wrap">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#141414] border-white border-opacity-5">
      <h2 className="text-xl font-bol mb-6">Account States</h2>
      <div className="space-y-4">
        {accounts.map((account) => (
          <div 
            key={account.id} 
            className="p-4 bg-[#141414] rounded-lg border border-zinc-800 transition-all duration-200"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedAccount(expandedAccount === account.id ? null : account.id)}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">ZKSync {SAMPLE_ACCOUNTS.indexOf(account.id) + 1}</span>
                  <span className="text-sm text-gray-400">({formatHash(account.id)})</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(account.id);
                  }}
                  className="p-1 hover:bg-zinc-800 rounded"
                >
                  <Copy 
                    size={14} 
                    className={copiedHash === account.id ? 'text-green-400' : 'text-gray-400'} 
                  />
                </button>
              </div>
              {expandedAccount === account.id ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </div>
            
            {expandedAccount === account.id && (
              <div className="mt-4 space-y-3 pt-4 border-t border-zinc-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-zinc-800 rounded">
                    <p className="text-sm text-gray-400">Height</p>
                    <p className="text-sm font-semibold">{account.height}</p>
                  </div>
                  <div className="p-3 bg-zinc-800 rounded">
                    <p className="text-sm text-gray-400">Last Proof Height</p>
                    <p className="text-sm font-semibold">{account.last_proof_height}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-zinc-800 rounded">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">State Root</p>
                    <button
                      onClick={() => copyToClipboard(account.state_root)}
                      className="p-1 hover:bg-zinc-700 rounded"
                    >
                      <Copy 
                        size={14} 
                        className={
                          copiedHash === account.state_root.map(n => n.toString(16).padStart(2, '0')).join('')
                            ? 'text-green-400' 
                            : 'text-gray-400'
                        } 
                      />
                    </button>
                  </div>
                  <p className="text-sm font-mono">{formatHash(account.state_root)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}