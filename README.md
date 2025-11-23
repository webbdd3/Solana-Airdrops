```markdown
# Solana-Airdrops — Wallet-integrated Devnet UI

This is a small Vite + React UI that connects to Phantom and requests a devnet airdrop.

Setup (locally)
1. Inside your project folder (where package.json is):
   npm install

2. Install the Solana & wallet-adapter deps (you already did):
   npm install @solana/web3.js \
     @solana/wallet-adapter-react \
     @solana/wallet-adapter-react-ui \
     @solana/wallet-adapter-base \
     @solana/wallet-adapter-wallets \
     @solana/wallet-adapter-phantom

3. Add the src files (App.jsx, main.jsx, index.css) as shown.

4. Start dev server:
   npm run dev

Notes
- Use the Phantom extension set to Devnet when connecting.
- Airdrops only work on Devnet/Testnet, not Mainnet.
```
