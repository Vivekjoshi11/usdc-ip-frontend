/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function UsdcConverter() {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (!ethers.isAddress(receiver)) {
        setError('Invalid receiver address');
        setLoading(false);
        return;
      }
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError('Invalid amount');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receiver }),
      });
      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(`Transaction successful! Hash: ${result.transactionHash}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction. Ensure MetaMask is connected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Convert USDC to Story IP</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (USDC)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter amount"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">
            Receiver Address (Story Testnet)
          </label>
          <input
            type="text"
            id="receiver"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="0x..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Convert'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && <p className="mt-4 text-green-600">{success}</p>}
    </div>
  );
}