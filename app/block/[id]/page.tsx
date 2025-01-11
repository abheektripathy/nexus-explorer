"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Copy, X } from 'lucide-react';
import { fetchLatestBlock } from '@/lib/api';
import { useParams } from 'next/navigation';
import { formatHash } from '@/lib/utils';

export default function BlockPage() {
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const getBlock = async () => {
      try {
        const blockNumber = parseInt(params.id as string);
        const response = await fetchLatestBlock(blockNumber);
        if (!response.ok) {
          throw new Error('Failed to fetch block');
        }
        const data = await response.json();
        setBlock(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    getBlock();
  }, [params.id]);

  useEffect(() => {
    if (copiedHash) {
      const timer = setTimeout(() => setCopiedHash(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedHash]);

  const copyToClipboard = async (hash: number[]) => {
    const fullHash = hash.map(n => n.toString(16).padStart(2, '0')).join('');
    await navigator.clipboard.writeText(fullHash);
    setCopiedHash(fullHash);
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-3 items-center justify-center mx-auto p-6 h-screen w-screen ">
        <Card className="w-[50%] p-6 bg-zinc-900 border-white border-opacity-5">
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-24 bg-zinc-800" />
            <Skeleton className="h-24 bg-zinc-800" />
            <Skeleton className="h-24 bg-zinc-800" />
            <Skeleton className="h-24 bg-zinc-800" />
          </div>
          <Skeleton className="h-48 mt-6 bg-zinc-800" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-3 items-center justify-center mx-auto p-6 h-screen w-screen ">
         <a className='flex items-center text-white text-opacity-50 justify-end w-[50%] space-x-2 hover:text-blue-500 underline' href='/'>
           <p>{`go back to main menu`}</p>  <ArrowRight className=' w-3 h-3'/>
        </a>
        <Card className="w-[50%] p-6 bg-zinc-900 border-white border-opacity-5">
          <div className="text-red-400">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 items-center justify-center mx-auto p-6 h-screen w-screen ">
        <a className='flex items-center text-white text-opacity-50 justify-end w-[50%] space-x-2 hover:text-blue-500 underline' href='/'>
           <p>{`go back to main menu`}</p>  <ArrowRight className=' w-3 h-3'/>
        </a>
      <Card className="p-6 w-[50%] bg-zinc-900 border-white border-opacity-5">
        <h2 className="text-xl font-bold text-blue-500">Block #{params.id}</h2>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-400">Block Number</p>
            <p className="text-lg font-bold">{block?.header.number}</p>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-400">Transactions</p>
            <p className="text-lg font-bold">{block?.transactions.length}</p>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg relative group">
            <p className="text-sm text-gray-400">State Root</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono truncate">{formatHash(block?.header.state_root)}</p>
              <button
                onClick={() => block?.header.state_root && copyToClipboard(block.header.state_root)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-700 rounded"
              >
                <Copy size={14} className={
                  copiedHash === block?.header.state_root?.map((n: number) => n.toString(16).padStart(2, '0')).join('')
                    ? 'text-green-400'
                    : 'text-gray-400'
                } />
              </button>
            </div>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg relative group">
            <p className="text-sm text-gray-400">Avail Header Hash</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono truncate">{formatHash(block?.header.avail_header_hash)}</p>
              <button
                onClick={() => block?.header.avail_header_hash && copyToClipboard(block.header.avail_header_hash)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-700 rounded"
              >
                <Copy size={14} className={
                  copiedHash === block?.header.avail_header_hash?.map((n: number) => n.toString(16).padStart(2, '0')).join('')
                    ? 'text-green-400'
                    : 'text-gray-400'
                } />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Transactions</h3>
          {block?.transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <X size={24} className="text-gray-400 mb-2" />
              <p className="text-gray-400">No transactions found</p>
            </div>
          ) : (
            block?.transactions.map((tx: any, i: number) => (
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
                          className={
                          copiedHash === tx.block_hash?.map((n: number) => n.toString(16).padStart(2, '0')).join('')
                            ? 'text-green-400'
                            : 'text-gray-400'
                          } 
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
            ))
          )}
        </div>
      </Card>
    </div>
  );
}