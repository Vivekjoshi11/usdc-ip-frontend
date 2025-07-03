


// Add ethereum to the Window interface for TypeScript


"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { swapTokens } from "../lib/swapUSDCtoIP";
declare global {
  interface Window {
    ethereum?: any;
  }
}
export default function SwapButton() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"usdcToIp" | "ipToUsdc">("usdcToIp");

  const handleSwap = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("No wallet found");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const USDC_ADDRESS = "0x968b9a5603ddeb2a78aa08182bc44ece1d9e5bf0"; // USDC.e on Story
      const IP_ADDRESS = "0x1514000000000000000000000000000000000000";   // WIP (IP token)

      const isUSDCtoIP = direction === "usdcToIp";
      const token1 = isUSDCtoIP ? USDC_ADDRESS : IP_ADDRESS;
      const token2 = isUSDCtoIP ? IP_ADDRESS : USDC_ADDRESS;

      const token1Decimals = isUSDCtoIP ? 6 : 18;
      const token2Decimals = isUSDCtoIP ? 18 : 6;

      const amount1BN = ethers.utils.parseUnits(amount, token1Decimals);
      // const amount2MinBN = ethers.utils.parseUnits("1", token2Decimals); // accept at least 1
const amount2MinBN = ethers.utils.parseUnits("0.000001", 6); // 6 decimals for USDC
// const amount2Min = amount2MinBN.toBigInt();
      const amount1 = amount1BN.toBigInt();
      const amount2Min = amount2MinBN.toBigInt();
      const expiration = BigInt(Math.floor(Date.now() / 1000) + 600);

      const receipt = await swapTokens(
        token1,
        token2,
        amount1,
        amount2Min,
        expiration,
        signer,
        true // useNative true for now (WIP used)
      );

      console.log("Swap successful:", receipt);
      alert("Swap complete!");
    } catch (err) {
      console.error("Swap error:", err);
      alert("Swap failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto mt-6">
      <label className="block text-sm font-semibold">Select Swap Direction:</label>
      <select
        className="border px-3 py-2 rounded w-full"
        value={direction}
        onChange={(e) => setDirection(e.target.value as "usdcToIp" | "ipToUsdc")}
      >
        <option value="usdcToIp">USDC → IP</option>
        <option value="ipToUsdc">IP → USDC</option>
      </select>

      <label className="block text-sm font-semibold mt-4">Enter Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter token amount"
        className="border px-3 py-2 rounded w-full"
      />

      <button
        onClick={handleSwap}
        disabled={loading || !amount}
        className={`w-full px-4 py-2 rounded text-white ${
          loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Swapping..." : direction === "usdcToIp" ? "Swap USDC → IP" : "Swap IP → USDC"}
      </button>
    </div>
  );
}
