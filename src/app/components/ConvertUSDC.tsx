/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import {
  BrowserProvider,
  Contract,
  parseUnits,
  formatUnits
} from 'ethers';
import { rampAddress, rampABI, usdcAddress, usdcABI, ipTokenAddress, ipTokenABI } from '../lib/constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConvertUSDC() {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<any>();
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ipBalance, setIpBalance] = useState<string>('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('⚠️ Please install MetaMask');
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      setProvider(browserProvider);
      setSigner(signer);
      setStatus('✅ Wallet connected');

      // Fetch balance after connection
      await fetchIpBalance(signer);
    } catch (error) {
      console.error(error);
      setStatus('❌ Failed to connect wallet');
    }
  };

const fetchIpBalance = async (signerInstance: any) => {
  try {
    const ipTokenContract = new Contract(ipTokenAddress, ipTokenABI, signerInstance);
    const address = await signerInstance.getAddress();

    const code = await signerInstance.provider.getCode(ipTokenAddress);
    console.log('Fetching balance for:', address);
    if (code === '0x') {
      throw new Error('IP Token contract not found at address');
    }

    const balance = await ipTokenContract.balanceOf(address);
    console.log('Raw balance (in wei):', balance.toString());
    const formatted = formatUnits(balance, 18); // change to actual decimals if different
    setIpBalance(formatted);
  } catch (error) {
    console.error('Error fetching IP token balance:', error);
    setIpBalance('');
  }
};


  const convert = async () => {
    if (!signer) {
      setStatus('⚠️ Connect your wallet first');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setStatus('⚠️ Enter a valid amount');
      return;
    }

    try {
      const decimals = 6; // USDC typically has 6 decimals
      const amountInUnits = parseUnits(amount, decimals);

      const usdcContract = new Contract(usdcAddress, usdcABI, signer);
      const rampContract = new Contract(rampAddress, rampABI, signer);

      setStatus('⏳ Approving USDC...');
      const approveTx = await usdcContract.approve(rampAddress, amountInUnits);
      await approveTx.wait();

      setStatus('🔄 Converting USDC to IP...');
      const convertTx = await rampContract.convertUSDCToIP(amountInUnits);
      await convertTx.wait();

      setStatus('✅ Conversion successful!');
      await fetchIpBalance(signer);
    } catch (error: any) {
      console.error(error);
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>USDC to IP Converter</h2>

      {!signer && <button onClick={connectWallet}>Connect Wallet</button>}

      <input
        type="number"
        placeholder="Amount of USDC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={convert} disabled={!signer}>
        Convert USDC to IP
      </button>

      <p>Status: {status}</p>
      {ipBalance && <p>🎉 Your IP Token Balance: {ipBalance}</p>}
    </div>
  );
}
