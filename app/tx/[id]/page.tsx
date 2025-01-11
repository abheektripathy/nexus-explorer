"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { fetchTransactionStatus } from '@/lib/api';
import { useParams } from 'next/navigation';

interface TransactionDetails {
  status: "InPool" | "Failed" | "Successful";
  transaction: {
    signature: number[];
    params: {
      SubmitProof?: {
        proof: number[];
        nexus_hash: number[];
        state_root: number[];
        height: number;
        app_id: number[];
        data?: number[];
      };
      InitAccount?: {
        app_id: number[];
        statement: number[];
        start_nexus_hash: number[];
      };
    };
  };
  block_hash?: number[];
}

export default function TransactionPage() {
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await fetchTransactionStatus(params.id as string);
        if (!response.ok) {
          throw new Error('Failed to fetch transaction');
        }
        const data = await response.json();
        setTransaction(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    getTransaction();
  }, [params.id]);

  useEffect(() => {
    if (copiedHash) {
      const timer = setTimeout(() => setCopiedHash(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedHash]);

  const formatHash = (hash?: number[]) => {
    if (!hash) return '';
    const fullHash = hash.map(n => n.toString(16).padStart(2, '0')).join('');
    return `${fullHash.slice(0, 4)}...${fullHash.slice(-3)}`;
  };

  const copyToClipboard = async (hash: number[] | string) => {
    const fullHash = typeof hash === 'string' 
      ? hash 
      : hash.map(n => n.toString(16).padStart(2, '0')).join('');
    await navigator.clipboard.writeText(fullHash);
    setCopiedHash(fullHash);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 bg-zinc-900 border-white border-opacity-5">
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <div className="space-y-4 mt-6">
            <Skeleton className="h-20 bg-zinc-800" />
            <Skeleton className="h-20 bg-zinc-800" />
            <Skeleton className="h-20 bg-zinc-800" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 bg-zinc-900 border-white border-opacity-5">
          <div className="text-red-400">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const isSubmitProof = !!transaction?.transaction.params.SubmitProof;

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6 bg-zinc-900 border-white border-opacity-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-500">Transaction Details</h2>
          <Badge 
            variant="outline" 
            className={`
              ${transaction?.status === 'Successful' ? 'bg-green-900/20 text-green-400 border-green-900' : 
                transaction?.status === 'Failed' ? 'bg-red-900/20 text-red-400 border-red-900' :
                'bg-yellow-900/20 text-yellow-400 border-yellow-900'}
            `}
          >
            {transaction?.status}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Transaction Hash */}
          <div className="p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Transaction Hash</p>
              <button
                onClick={() => copyToClipboard(params.id as string)}
                className="p-1 hover:bg-zinc-700 rounded"
              >
                <Copy 
                  size={14} 
                  className={copiedHash === params.id ? 'text-green-400' : 'text-gray-400'} 
                />
              </button>
            </div>
            <p className="text-sm font-mono mt-1">{params.id}</p>
          </div>

          {/* Block Hash */}
          {transaction?.block_hash && (
            <div className="p-4 bg-zinc-800 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Block Hash</p>
                <button
                  onClick={() => transaction.block_hash && copyToClipboard(transaction.block_hash)}
                  className="p-1 hover:bg-zinc-700 rounded"
                >
                  <Copy 
                    size={14} 
                    className={
                      copiedHash === transaction.block_hash?.map(n => n.toString(16).padStart(2, '0')).join('')
                        ? 'text-green-400'
                        : 'text-gray-400'
                    } 
                  />
                </button>
              </div>
              <p className="text-sm font-mono mt-1">{formatHash(transaction.block_hash)}</p>
            </div>
          )}

          {/* Transaction Type */}
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-400">Transaction Type</p>
            <p className="text-sm font-medium mt-1">
              {isSubmitProof ? 'Submit Proof' : 'Init Account'}
            </p>
          </div>

          {/* Submit Proof Details */}
          {isSubmitProof && transaction?.transaction.params.SubmitProof && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <p className="text-sm text-gray-400">Height</p>
                <p className="text-sm font-medium mt-1">
                  {transaction.transaction.params.SubmitProof.height}
                </p>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">App ID</p>
                  <button
                    onClick={() => copyToClipboard(transaction.transaction.params.SubmitProof!.app_id)}
                    className="p-1 hover:bg-zinc-700 rounded"
                  >
                    <Copy 
                      size={14} 
                      className={
                        copiedHash === transaction.transaction.params.SubmitProof.app_id.map(n => n.toString(16).padStart(2, '0')).join('')
                          ? 'text-green-400'
                          : 'text-gray-400'
                      } 
                    />
                  </button>
                </div>
                <p className="text-sm font-mono mt-1">
                  {formatHash(transaction.transaction.params.SubmitProof.app_id)}
                </p>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">State Root</p>
                  <button
                    onClick={() => copyToClipboard(transaction.transaction.params.SubmitProof!.state_root)}
                    className="p-1 hover:bg-zinc-700 rounded"
                  >
                    <Copy 
                      size={14} 
                      className={
                        copiedHash === transaction.transaction.params.SubmitProof.state_root.map(n => n.toString(16).padStart(2, '0')).join('')
                          ? 'text-green-400'
                          : 'text-gray-400'
                      } 
                    />
                  </button>
                </div>
                <p className="text-sm font-mono mt-1">
                  {formatHash(transaction.transaction.params.SubmitProof.state_root)}
                </p>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Nexus Hash</p>
                  <button
                    onClick={() => copyToClipboard(transaction.transaction.params.SubmitProof!.nexus_hash)}
                    className="p-1 hover:bg-zinc-700 rounded"
                  >
                    <Copy 
                      size={14} 
                      className={
                        copiedHash === transaction.transaction.params.SubmitProof.nexus_hash.map(n => n.toString(16).padStart(2, '0')).join('')
                          ? 'text-green-400'
                          : 'text-gray-400'
                      } 
                    />
                  </button>
                </div>
                <p className="text-sm font-mono mt-1">
                  {formatHash(transaction.transaction.params.SubmitProof.nexus_hash)}
                </p>
              </div>
            </div>
          )}

          {/* Init Account Details */}
          {!isSubmitProof && transaction?.transaction.params.InitAccount && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">App ID</p>
                  <button
                    onClick={() => copyToClipboard(transaction.transaction.params.InitAccount!.app_id)}
                    className="p-1 hover:bg-zinc-700 rounded"
                  >
                    <Copy 
                      size={14} 
                      className={
                        copiedHash === transaction.transaction.params.InitAccount.app_id.map(n => n.toString(16).padStart(2, '0')).join('')
                          ? 'text-green-400'
                          : 'text-gray-400'
                      } 
                    />
                  </button>
                </div>
                <p className="text-sm font-mono mt-1">
                  {formatHash(transaction.transaction.params.InitAccount.app_id)}
                </p>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Start Nexus Hash</p>
                  <button
                    onClick={() => copyToClipboard(transaction.transaction.params.InitAccount!.start_nexus_hash)}
                    className="p-1 hover:bg-zinc-700 rounded"
                  >
                    <Copy 
                      size={14} 
                      className={
                        copiedHash === transaction.transaction.params.InitAccount.start_nexus_hash.map(n => n.toString(16).padStart(2, '0')).join('')
                          ? 'text-green-400'
                          : 'text-gray-400'
                      } 
                    />
                  </button>
                </div>
                <p className="text-sm font-mono mt-1">
                  {formatHash(transaction.transaction.params.InitAccount.start_nexus_hash)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}