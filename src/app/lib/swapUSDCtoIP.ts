

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Signer as AbstractSigner } from "@ethersproject/abstract-signer";
import {
  routerTokenApproval,
  swap,
} from "@piperx/sdk/dist/core";
import { routingExactInput } from "@piperx/sdk/dist/routing";

export const swapTokens = async (
  token1_address: string,
  token2_address: string,
  amount1: bigint,
  amount2Min: bigint,
  expire_time: bigint,
  signer: AbstractSigner,
  useNative: boolean
) => {
  try {
    const { bestRoute } = await routingExactInput(token1_address, token2_address, amount1);

    if (!bestRoute || bestRoute.length === 0) {
      throw new Error("No valid route found for swap.");
    }

    const approvalTx = await routerTokenApproval(
      token1_address,
      amount1,
      bestRoute,
      signer
    );

    if (approvalTx && typeof approvalTx.wait === "function") {
      await approvalTx.wait();
    }

    const tx = await swap(
      amount1,
      amount2Min,
      bestRoute,
      useNative,
      expire_time,
      signer
    );

    return await tx.wait();
  } catch (err) {
    console.error("Swap error:", err);
    throw err;
  }
};
