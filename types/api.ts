export interface H256 {
  [index: number]: number;
}

export interface StatementDigest extends Array<number> {}

export interface AccountState {
  height: number;
  last_proof_height: number;
  start_nexus_hash: number[];
  state_root: number[];
  statement: StatementDigest;
}

export interface NexusHeader {
  parent_hash: H256;
  prev_state_root: H256;
  state_root: number[];
  tx_root: H256;
  avail_header_hash: number[];
  number: number;
}

export interface Transaction {
  signature: number[];
  params: {
    SubmitProof?: {
      proof: number[];
      nexus_hash: H256;
      state_root: H256;
      height: number;
      app_id: number[];
      data?: H256;
    };
    InitAccount?: {
      app_id: number[];
      statement: number[];
      start_nexus_hash: H256;
    };
  };
}

export interface TransactionWithStatus {
  transaction: Transaction;
  status: "InPool" | "Failed" | "Successful";
  block_hash?: number[]
  //can be H256 as well
}

export interface NexusBlockWithTransactions {
  header: NexusHeader;
  transactions: TransactionWithStatus[];
}