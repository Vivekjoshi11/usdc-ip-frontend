// src/lib/swapUSDCtoIP.ts
// import {
//   routingExactInput,
//   routerTokenApproval,
//   swap,
// } from '@piperx/sdk/src/core';
// // import { WIP_ADDRESS } from '@piperx/sdk/src/constant';
// import { WIP_ADDRESS } from '@piperx/sdk/src/constant';

// import { USDC_ADDRESS } from '@/constants/tokens';

import {
  routingExactInput,
  routerTokenApproval,
  swap,
  WIP_ADDRESS
} from '@piperx/sdk';


export const swapUSDCtoIP = async ({
  signer,
  amountIn,        // BigInt of USDC (6 decimals)
  minAmountOut,     // BigInt of WIP expected (with slippage buffer)
}: {
  signer: any;             // ethers.Signer or wagmi signer
  amountIn: bigint;
  minAmountOut: bigint;
}) => {
  console.log('Finding best route...');
  const { bestRoute } = await routingExactInput(
    USDC_ADDRESS,
    WIP_ADDRESS,
    amountIn,
    signer
  );

  console.log('Approving USDC...');
  await routerTokenApproval(
    USDC_ADDRESS,
    amountIn,
    bestRoute,
    signer
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes from now

  console.log('Swapping...');
  await swap(
    amountIn,
    minAmountOut,
    bestRoute.path,
    deadline,
    signer
  );

  console.log('Swap complete!');
};
