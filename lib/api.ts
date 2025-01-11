const API_BASE_URL = 'http://dev.nexus.avail.tools';

export async function fetchLatestBlock(block_number?: Number): Promise<Response> {
  if (block_number) {
    return fetch(`${API_BASE_URL}/block?block_number=${block_number}`);
  }
  return fetch(`${API_BASE_URL}/block`);
}

export async function fetchAccountState(accountId: string): Promise<Response> {
  return fetch(`${API_BASE_URL}/account?app_account_id=${accountId}`);
}

export async function fetchTransactionStatus(txHash: string): Promise<Response> {
  return fetch(`${API_BASE_URL}/tx_status?tx_hash=${txHash}`);
}