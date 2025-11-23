import { useMemo, useCallback, useEffect, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

function AirdropButton() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBalance = useCallback(async () => {
    if (!publicKey || !connection) return;
    try {
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (e) {
      console.error("Failed to fetch balance", e);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (publicKey && connection) getBalance();
  }, [publicKey, connection, getBalance]);

  const handleAirdrop = async () => {
    if (!publicKey || !connection) return alert("Wallet not connected.");

    try {
      setLoading(true);
      const sig = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
      // For web3.js v1 compatibility this is fine; if you need modern blockhash-confirm flow we can swap it.
      await connection.confirmTransaction(sig, "confirmed");
      await getBalance();
      alert("Airdrop complete!");
    } catch (e) {
      console.error(e);
      alert("Airdrop failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {publicKey ? (
        <>
          <p>
            <b>Balance:</b> {balance === null ? "..." : `${balance} SOL`}
          </p>
          <button
            onClick={handleAirdrop}
            disabled={loading}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              borderRadius: "6px",
              cursor: "pointer",
              background: "#00c16a",
              border: "none",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {loading ? "Airdropping..." : "Airdrop 1 SOL (Devnet)"}
          </button>
        </>
      ) : (
        <p style={{ color: "#666" }}>Connect a wallet to request an airdrop.</p>
      )}
    </div>
  );
}

export default function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "60px",
            }}
          >
            <h1>Solana Devnet Airdrop</h1>

            <WalletMultiButton />

            <AirdropButton />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
