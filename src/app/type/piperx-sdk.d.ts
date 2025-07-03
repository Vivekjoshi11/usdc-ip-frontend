/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/piperx-sdk.d.ts
declare module '@piperx/sdk' {
  export const WIP_ADDRESS: string;

  export function routingExactInput(
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    signer: any
  ): Promise<{
    bestRoute: {
      path: string[];
    };
    max: bigint;
  }>;

  export function routerTokenApproval(
    token: string,
    amount: bigint,
    bestRoute: { path: string[] },
    signer: any
  ): Promise<any>;

  export function swap(
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    deadline: number,
    signer: any
  ): Promise<any>;
}
