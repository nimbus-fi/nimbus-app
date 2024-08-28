import React from 'react';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface DataRow {
    action: string;
    protocol: string;
    chain: string;
    amount: string;
    yield: string;
}

const data: DataRow[] = [
    {
        action: "Supply USDC to Aave",
        protocol: "Aave",
        chain: "Optimism",
        amount: "$100",
        yield: "3.69%",
    },
    {
        action: "Borrow wBTC from Aave",
        protocol: "Aave",
        chain: "Optimism",
        amount: "~$70",
        yield: "-0.50%",
    },
    {
        action: "Swap wBTC for USDC on Uniswap",
        protocol: "Uniswap",
        chain: "Optimism",
        amount: "~$70",
        yield: "0.00%",
    },
    {
        action: "Swap wBTC for USDC on Uniswap",
        protocol: "Uniswap",
        chain: "Optimism",
        amount: "~$70",
        yield: "0.00%",
    },
    {
        action: "Loop back to first step, repeat 3 more times",
        protocol: "Uniswap",
        chain: "Optimism",
        amount: "~$51",
        yield: "5.39%",
    },
];

export default function DeFiDashboard() {
    return (
        <div className="container mx-auto p-6 bg-gray-100 my-5 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* How does it work? */}
                    <div className="bg-yellow-300 text-black p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">How does it work?</h2>
                        <p className="text-sm">
                            Deposit your USDC into Looptimism to leverage automated yield optimization across multiple DeFi protocols. This smart contract strategy supplies your USDC to Aave, borrows WBTC against it, then swaps the WBTC back to USDC via Uniswap, repeating this process to increase leverage. It uses Pyth for real-time price feeds to maintain a safe loan-to-value ratio. Your stake is represented by ERC4626 standard shares, allowing for easy deposits and withdrawals. The contract owner can periodically harvest gains to realize yields. This approach aims to maximize your USDC returns by capitalizing on lending-borrowing differentials and potential market inefficiencies, all while managing associated risks through automated processes.
                        </p>
                    </div>

                    {/* Behind the scenes */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Behind the scenes</h2>
                        <p className="text-sm mb-2">Actions done automatically by the strategy (smart-contract) with an investment of $1000</p>
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-4 border-b">Action</th>
                                    <th className="py-2 px-4 border-b">Protocol</th>
                                    <th className="py-2 px-4 border-b">Chain</th>
                                    <th className="py-2 px-4 border-b">Amount</th>
                                    <th className="py-2 px-4 border-b">Yield</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className='text-xs'>
                                        <td className="py-2 px-4 border-b">{row.action}</td>
                                        <td className="py-2 px-4 border-b">{row.protocol}</td>
                                        <td className="py-2 px-4 border-b">{row.chain}</td>
                                        <td className="py-2 px-4 border-b">{row.amount}</td>
                                        <td className="py-2 px-4 border-b">{row.yield}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* APY */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">APY (on Mainnet)</span>
                            <span className="text-3xl font-bold text-yellow-500">8.73%
                            </span>
                        </div>
                        <div className="mt-4 space-x-2">
                            <button className="bg-yellow-400 text-black px-4 py-2 rounded">Deposit</button>
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Withdraw</button>
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold">Invested Amount</p>
                            <p className="text-2xl font-bold">0.00</p>
                        </div>
                        <div className="mt-4 flex items-center">
                            <input type="text" placeholder="0" className="border p-2 rounded w-full" />
                            <button className="ml-2 bg-yellow-400 text-black px-4 py-2 rounded">Deposit</button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">No additional fees</p>
                    </div>

                    {/* Risks Associated */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Risks Associated</h2>
                        <p className="text-sm mb-2">Some probable risks that you should be aware of before investing in this strategy</p>
                        <ul className="list-disc list-inside text-sm">
                            <li>APYs are not promised returns, they may vary due to market conditions</li>
                            <li>You will be affected by price fluctuations of cbETH tokens</li>
                        </ul>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Transaction History</h2>
                        <p className="text-sm">
                            No transactions recorded since this feature was added. We use your browser's storage to save your transaction history. Make a deposit or withdrawal to see your transactions here. Clearning browser cache will remove this data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}