"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { NexusBlockWithTransactions } from '@/types/api';
import { fetchLatestBlock } from '@/lib/api';
import { formatHash, getFullHash, MOCK_TRANSACTIONS } from '@/lib/utils';

export function LatestBlocks() {
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState<NexusBlockWithTransactions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const getLatestBlock = async () => {
      try {
        const response = await fetchLatestBlock();
        if (!response.ok) {
          throw new Error('Failed to fetch latest block');
        }
        const data = await response.json();
        
        if (data.transactions.length === 0) {
          data.transactions = MOCK_TRANSACTIONS;
        }
        
        setBlock(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    getLatestBlock();
  }, []);

  useEffect(() => {
    if (copiedHash) {
      const timer = setTimeout(() => setCopiedHash(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedHash]);

  const copyToClipboard = async (hash: number[]) => {
    const fullHash = getFullHash(hash);
    await navigator.clipboard.writeText(fullHash);
    setCopiedHash(fullHash);
  };

  const HashWithCopy = ({ hash, label }: { hash: number[] | undefined, label: string }) => (
    <div className="p-4 bg-zinc-800 rounded-lg relative group">
      <p className="text-sm text-gray-400">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-mono truncate">{formatHash(hash)}</p>
        <button
          onClick={() => hash && copyToClipboard(hash)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-700 rounded"
        >
          <Copy size={14} className={copiedHash === getFullHash(hash) ? 'text-green-400' : 'text-gray-400'} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="p-6 bg-zinc-900 border-white border-opacity-5">
        <Skeleton className="h-8 w-48 bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-24 bg-zinc-800" />
          <Skeleton className="h-24 bg-zinc-800" />
          <Skeleton className="h-24 bg-zinc-800" />
          <Skeleton className="h-24 bg-zinc-800" />
        </div>
        <Skeleton className="h-48 mt-6 bg-zinc-800" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-zinc-900 border-white border-opacity-10">
        <div className="text-red-400">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-zinc-900 border-white border-opacity-5">
      <h2 className="text-xl font-bold text-blue-500">Latest Block</h2>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-zinc-800 rounded-lg">
          <p className="text-sm text-gray-400">Block Number</p>
          <p className="text-lg font-bold">{block?.header.number}</p>
        </div>
        <div className="p-4 bg-zinc-800 rounded-lg">
          <p className="text-sm text-gray-400">Transactions</p>
          <p className="text-lg font-bold">{block?.transactions.length}</p>
        </div>
        <HashWithCopy hash={block?.header.state_root} label="State Root" />
        <HashWithCopy hash={block?.header.avail_header_hash} label="Avail Header Hash" />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        {block?.transactions.map((tx, i) => (
          <div key={i} className="p-4 bg-zinc-900 rounded-lg mb-2 border border-zinc-800">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{formatHash(tx.block_hash)}</span>
                  <button
                    onClick={() => tx.block_hash && copyToClipboard(tx.block_hash)}
                    className="p-1 hover:bg-zinc-800 rounded"
                  >
                    <Copy 
                      size={14} 
                      className={copiedHash === getFullHash(tx.block_hash) ? 'text-green-400' : 'text-gray-400'} 
                    />
                  </button>
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${tx.status === 'Successful' ? 'bg-green-900/20 text-green-400 border-green-900' : 
                      tx.status === 'Failed' ? 'bg-red-900/20 text-red-400 border-red-900' :
                      'bg-yellow-900/20 text-yellow-400 border-yellow-900'}
                  `}
                >
                  {tx.status}
                </Badge>
              </div>
              <div className="text-xs text-gray-400">
                <span>Type: </span>
                <span className="text-gray-300">
                  {tx.transaction.params.SubmitProof ? 'Submit Proof' : 'Init Account'}
                </span>
              </div>
              {tx.transaction.params.SubmitProof && (
                <div className="text-xs text-gray-400">
                  <span>Height: </span>
                  <span className="text-gray-300">{tx.transaction.params.SubmitProof.height}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}