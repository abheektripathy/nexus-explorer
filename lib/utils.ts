import { TransactionWithStatus } from '@/types/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatHash = (hash?: number[]) => {
  if (!hash) return '';
  const fullHash = hash.map(n => n.toString(16).padStart(2, '0')).join('');
  return `${fullHash.slice(0, 4)}...${fullHash.slice(-3)}`;
};

export const getFullHash = (hash?: number[]) => {
  if (!hash) return '';
  return hash.map(n => n.toString(16).padStart(2, '0')).join('');
};


export const MOCK_TRANSACTIONS: TransactionWithStatus[] = [
  {
    transaction: {
      signature: Array(32).fill(1),
      params: {
        SubmitProof: {
          proof: Array(32).fill(2),
          nexus_hash: Array(32).fill(3),
          state_root: Array(32).fill(4),
          height: 12345,
          app_id: Array(32).fill(5),
          data: Array(32).fill(6)
        }
      }
    },
    status: "Successful",
    block_hash: Array(32).fill(7)
  },
  {
    transaction: {
      signature: Array(32).fill(8),
      params: {
        InitAccount: {
          app_id: Array(32).fill(9),
          statement: Array(32).fill(10),
          start_nexus_hash: Array(32).fill(11)
        }
      }
    },
    status: "Failed",
    block_hash: Array(32).fill(12)
  },
  {
    transaction: {
      signature: Array(32).fill(13),
      params: {
        SubmitProof: {
          proof: Array(32).fill(14),
          nexus_hash: Array(32).fill(15),
          state_root: Array(32).fill(16),
          height: 12346,
          app_id: Array(32).fill(17)
        }
      }
    },
    status: "InPool",
    block_hash: Array(32).fill(18)
  }
];
