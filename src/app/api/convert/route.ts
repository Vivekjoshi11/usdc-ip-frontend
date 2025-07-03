/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */


// import { NextResponse } from 'next/server';
// import { ethers } from 'ethers';

// // Configuration
// const config = {
//   sourceChainRpc: 'https://sepolia.infura.io/v3/6bdc9b51f0eb42b1a9cde9946407da4d',
//   destinationChainRpc: 'https://aeneid.storyrpc.io/', // Verify with Story docs
//   sourceChainId: 11155111, // Sepolia
//   destinationChainId: 1315, // Story testnet, verify with deBridge or Story docs
//   usdcContractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC on Sepolia
//   deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA', // Verify with deBridge docs
// };

// // deBridgeGate ABI (minimal subset for the `send` function)
// const deBridgeGateAbi =
//  [
//   {
//     inputs: [
//       { internalType: 'address', name: '_tokenAddress', type: 'address' },
//       { internalType: 'uint256', name: '_amount', type: 'uint256' },
//       { internalType: 'uint256', name: '_chainIdTo', type: 'uint256' },
//       { internalType: 'bytes', name: '_receiver', type: 'bytes' },
//       { internalType: 'bytes', name: '_permit', type: 'bytes' },
//       { internalType: 'bool', name: '_useAssetFee', type: 'bool' },
//       { internalType: 'uint32', name: '_referralCode', type: 'uint32' },
//       { internalType: 'bytes', name: '_autoParams', type: 'bytes' },
//     ],
//     name: 'send',
//     outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
//     stateMutability: 'payable',
//     type: 'function',
//   },
// ];
// // [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]

// // USDC ABI (minimal subset for the `approve` function)
// const usdcAbi = 
// [
//   {
//     constant: false,
//     inputs: [
//       { name: 'spender', type: 'address' },
//       { name: 'amount', type: 'uint256' },
//     ],
//     name: 'approve',
//     outputs: [{ name: '', type: 'bool' }],
//     type: 'function',
//   },
// ];
// // [{"inputs":[{"internalType":"address","name":"implementationContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]

// export async function POST(request: Request) {
//   try {
//     const { amount, receiver } = await request.json();
//     if (!amount || !receiver) {
//       return NextResponse.json({ error: 'Amount and receiver address are required' }, { status: 400 });
//     }
//     if (!ethers.isAddress(receiver)) {
//       return NextResponse.json({ error: 'Invalid receiver address' }, { status: 400 });
//     }

//     const privateKey = "1c2f17a18a21e9a50100d7f87f412f2ad3f07dbd44dec8f82c02edf67f2568a3";
//     if (!privateKey || !/^(0x)?[0-9a-fA-F]{64}$/.test(privateKey)) {
//       return NextResponse.json({ error: 'Invalid private key format' }, { status: 500 });
//     }

//     const provider = new ethers.JsonRpcProvider(config.sourceChainRpc);
//     const wallet = new ethers.Wallet(privateKey, provider);

//     const usdcContract = new ethers.Contract(config.usdcContractAddress, usdcAbi, wallet);
//     const amountWei = ethers.parseUnits(amount.toString(), 6);
//     const approveTx = await usdcContract.approve(config.deBridgeGateAddress, amountWei);
//     await approveTx.wait();

//     const autoParams = new ethers.AbiCoder().encode(
//       ['uint256', 'address'],
//       [0, '0x0000000000000000000000000000000000000000']
//     );

//     const deBridgeGate = new ethers.Contract(config.deBridgeGateAddress, deBridgeGateAbi, wallet);
//     const protocolFee = ethers.parseEther('0.01'); // Adjust based on deBridge requirements
//     const tx = await deBridgeGate.send(
//       config.usdcContractAddress,
//       amountWei,
//       config.destinationChainId,
//       ethers.getBytes(receiver),
//       '0x',
//       false,
//       0,
//       autoParams,
//       { value: protocolFee, gasLimit: 8000000 }
//     );

//     const receipt = await tx.wait();
//     const submissionId = receipt.logs.find((e: any) => e.topics[0] === ethers.id('Sent(bytes32)'))?.args?.[0];

//     return NextResponse.json({
//       transactionHash: tx.hash,
//       submissionId: submissionId || 'Not found',
//       message: 'USDC transfer to Story testnet initiated',
//     });
//   } catch (error: any) {
//     console.error('Error in API:', error);
//     return NextResponse.json(
//       { error: `Failed to initiate cross-chain transfer: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }


// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { NextResponse } from 'next/server';
// import { ethers } from 'ethers';

// // Configuration
// const config = {
//   sourceChainRpc: 'https://sepolia.infura.io/v3/6bdc9b51f0eb42b1a9cde9946407da4d',
//   destinationChainRpc: 'https://aeneid.storyrpc.io/',
//   sourceChainId: 11155111,
//   destinationChainId: 1315,
//   usdcContractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
//   deBridgeGateAddress: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA', // Verify with deBridge
// };

// // deBridgeGate ABI (with `send` function)
// const deBridgeGateAbi = [
//   {
//     inputs: [
//       { internalType: 'address', name: '_tokenAddress', type: 'address' },
//       { internalType: 'uint256', name: '_amount', type: 'uint256' },
//       { internalType: 'uint256', name: '_chainIdTo', type: 'uint256' },
//       { internalType: 'bytes', name: '_receiver', type: 'bytes' },
//       { internalType: 'bytes', name: '_permit', type: 'bytes' },
//       { internalType: 'bool', name: '_useAssetFee', type: 'bool' },
//       { internalType: 'uint32', name: '_referralCode', type: 'uint32' },
//       { internalType: 'bytes', name: '_autoParams', type: 'bytes' },
//     ],
//     name: 'send',
//     outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
//     stateMutability: 'payable',
//     type: 'function',
//   },
//   // Add Sent event for decoding
//   {
//     type: 'event',
//     name: 'Sent',
//     inputs: [{ indexed: false, internalType: 'bytes32', name: 'submissionId', type: 'bytes32' }],
//   },
// ];

// // USDC ABI (for `approve` and `balanceOf`)
// const usdcAbi = [
//   {
//     constant: false,
//     inputs: [
//       { name: 'spender', type: 'address' },
//       { name: 'amount', type: 'uint256' },
//     ],
//     name: 'approve',
//     outputs: [{ name: '', type: 'bool' }],
//     type: 'function',
//   },
//   {
//     constant: true,
//     inputs: [{ name: 'account', type: 'address' }],
//     name: 'balanceOf',
//     outputs: [{ name: '', type: 'uint256' }],
//     type: 'function',
//   },
// ];

// export async function POST(request: Request) {
//   try {
//     const { amount, receiver } = await request.json();
//     if (!amount || !receiver) {
//       return NextResponse.json({ error: 'Amount and receiver address are required' }, { status: 400 });
//     }
//     if (!ethers.isAddress(receiver)) {
//       return NextResponse.json({ error: 'Invalid receiver address' }, { status: 400 });
//     }

//     const privateKey = "1c2f17a18a21e9a50100d7f87f412f2ad3f07dbd44dec8f82c02edf67f2568a3";
//     if (!privateKey || !/^(0x)?[0-9a-fA-F]{64}$/.test(privateKey)) {
//       return NextResponse.json({ error: 'Invalid private key format' }, { status: 500 });
//     }

//     const provider = new ethers.JsonRpcProvider(config.sourceChainRpc);
//     const wallet = new ethers.Wallet(privateKey, provider);

//     // Check balances
//     const usdcContract = new ethers.Contract(config.usdcContractAddress, usdcAbi, provider);
//     const amountWei = ethers.parseUnits(amount.toString(), 6);
//     const usdcBalance = await usdcContract.balanceOf(wallet.address);
//     if (usdcBalance < amountWei) {
//       return NextResponse.json({ error: 'Insufficient USDC balance' }, { status: 400 });
//     }
//     const ethBalance = await provider.getBalance(wallet.address);
//     const minEth = ethers.parseEther('0.02'); // Gas + protocol fee
//     if (ethBalance < minEth) {
//       return NextResponse.json({ error: 'Insufficient ETH balance' }, { status: 400 });
//     }

//     // Approve USDC
//     const usdcWithSigner = usdcContract.connect(wallet);
//     const approveTx = await usdcWithSigner.approve(config.deBridgeGateAddress, amountWei);
//     await approveTx.wait();

//     const autoParams = new ethers.AbiCoder().encode(
//       ['uint256', 'address'],
//       [0, '0x0000000000000000000000000000000000000000']
//     );

//     // Send cross-chain transfer
//     const deBridgeGate = new ethers.Contract(config.deBridgeGateAddress, deBridgeGateAbi, wallet);
//     const protocolFee = ethers.parseEther('0.01');
//     const tx = await deBridgeGate.send(
//       config.usdcContractAddress,
//       amountWei,
//       config.destinationChainId,
//       ethers.getBytes(receiver),
//       '0x',
//       false,
//       0,
//       autoParams,
//       { value: protocolFee, gasLimit: 6000000 }
//     );

//     const receipt = await tx.wait();
//     const sentEvent = receipt.logs
//       .map((log: { topics: ReadonlyArray<string>; data: string; }) => {
//         try {
//           return deBridgeGate.interface.parseLog(log);
//         } catch {
//           return null;
//         }
//       })
//       .find((event: { name: string; }) => event?.name === 'Sent');
//     const submissionId = sentEvent?.args?.submissionId || 'Not found';

//     return NextResponse.json({
//       transactionHash: tx.hash,
//       submissionId,
//       message: 'USDC transfer to Story testnet initiated',
//     });
//   } catch (error: any) {
//     console.error('Error in API:', error);
//     return NextResponse.json(
//       { error: `Failed to initiate cross-chain transfer: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }



/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { Pipe } from '@piperx/sdk';

// Configuration
const config = {
  sourceChainRpc: 'https://sepolia.infura.io/v3/6bdc9b51f0eb42b1a9cde9946407da4d',
  destinationChainRpc: 'https://aeneid.storyrpc.io/',
  sourceChainId: 11155111, // Sepolia
  destinationChainId: 1513, // Story Protocol (updated from 1315 based on PipeRx docs)
  usdcContractAddressSepolia: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC on Sepolia
  usdcContractAddressStory: '0x...YOUR_USDC_ADDRESS_ON_STORY...', // Replace with actual address
  ipContractAddressStory: '0x...YOUR_IP_ADDRESS_ON_STORY...', // Replace with actual address
};

// USDC ABI (for `approve` and `balanceOf`)
const usdcAbi = [
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
];

export async function POST(request: Request) {
  try {
    const { amount, receiver, swapDirection } = await request.json();
    if (!amount || !receiver || !swapDirection) {
      return NextResponse.json(
        { error: 'Amount, receiver address, and swap direction (usdc-to-ip or ip-to-usdc) are required' },
        { status: 400 }
      );
    }
    if (!ethers.isAddress(receiver)) {
      return NextResponse.json({ error: 'Invalid receiver address' }, { status: 400 });
    }
    if (!['usdc-to-ip', 'ip-to-usdc'].includes(swapDirection)) {
      return NextResponse.json({ error: 'Invalid swap direction. Use "usdc-to-ip" or "ip-to-usdc"' }, { status: 400 });
    }

    const privateKey = '1c2f17a18a21e9a50100d7f87f412f2ad3f07dbd44dec8f82c02edf67f2568a3';
    if (!privateKey || !/^(0x)?[0-9a-fA-F]{64}$/.test(privateKey)) {
      return NextResponse.json({ error: 'Invalid private key format' }, { status: 500 });
    }

    // Initialize providers and wallet
    const sourceProvider = new ethers.JsonRpcProvider(config.sourceChainRpc);
    const destinationProvider = new ethers.JsonRpcProvider(config.destinationChainRpc);
    const wallet = new ethers.Wallet(privateKey, sourceProvider);

    // Initialize PipeRx
    const pipe = new Pipe({
      sourceProvider,
      destinationProvider,
      wallet,
    });

    // Determine swap parameters
    const isUsdcToIp = swapDirection === 'usdc-to-ip';
    const sourceToken = isUsdcToIp
      ? config.usdcContractAddressSepolia
      : config.ipContractAddressStory;
    const destinationToken = isUsdcToIp
      ? config.ipContractAddressStory
      : config.usdcContractAddressStory;
    const amountWei = ethers.parseUnits(amount.toString(), 6); // Assuming 6 decimals for both USDC and IP

    // Check balances
    const tokenContract = new ethers.Contract(sourceToken, usdcAbi, sourceProvider);
    const balance = await tokenContract.balanceOf(wallet.address);
    if (balance < amountWei) {
      return NextResponse.json(
        { error: `Insufficient ${isUsdcToIp ? 'USDC' : 'IP'} balance` },
        { status: 400 }
      );
    }
    const ethBalance = await sourceProvider.getBalance(wallet.address);
    const minEth = ethers.parseEther('0.02'); // Gas + protocol fee
    if (ethBalance < minEth) {
      return NextResponse.json({ error: 'Insufficient ETH balance' }, { status: 400 });
    }

    // Approve tokens for PipeRx
    const tokenWithSigner = tokenContract.connect(wallet);
    const pipeAddress = pipe.getAddress(); // Get PipeRx contract address
    const approveTx = await tokenWithSigner.approve(pipeAddress, amountWei);
    await approveTx.wait();

    // Execute swap
    const swapParams = {
      chainId: config.destinationChainId,
      srcToken: sourceToken,
      destToken: destinationToken,
      amount: amountWei.toString(), // PipeRx expects string
      receiver,
    };

    const swapTx = await pipe.swap(swapParams);
    const receipt = await swapTx.wait();

    return NextResponse.json({
      transactionHash: swapTx.hash,
      message: `Cross-chain swap (${swapDirection}) to Story Protocol initiated`,
    });
  } catch (error: any) {
    console.error('Error in API:', error);
    return NextResponse.json(
      { error: `Failed to initiate cross-chain swap: ${error.message}` },
      { status: 500 }
    );
  }
}