import { SDK } from "avail-js-sdk";
import { useEffect, useState } from "react";

export function useAvailSdk() {
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSdk = async () => {
      try {
        const newSdk = await SDK.New("wss://zero-devnet.avail.so/ws");
        if (mounted) {
          setSdk(newSdk);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize SDK");
        }
      }
    };

    initializeSdk();

    return () => {
      mounted = false;
    };
  }, []);

  return { sdk, error };
} 