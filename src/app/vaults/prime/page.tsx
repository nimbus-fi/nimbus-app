import React from 'react';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function DeFiDashboard() {
    return (
        <div className="container mx-auto p-4 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* How does it work? */}
                    <div className="bg-purple-500 text-white p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">How does it work?</h2>
                        <p className="text-sm">
                            Deposit USDC into 'Prime USDC' for optimized yield across multiple
                            DeFi protocols. This smart contract leverages Aave for lending and
                            borrowing, Aerodrome for liquidity provision, and Uniswap for swaps,
                            using Pyth Network for price feeds. It supplies USDC to Aave, borrows
                            cbETH, then provides USDC-AERO liquidity on Aerodrome. Your stake
                            is represented by ERC4626 shares for easy deposits and withdrawals.
                            The contract periodically harvests gains, reinvests rewards, and
                            rebalances positions. This strategy aims to maximize USDC yield
                            through lending-borrowing differentials, liquidity fees, and market
                            inefficiencies, while managing risks across diversified DeFi positions.
                        </p>
                    </div>

                    {/* Behind the scenes */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Behind the scenes</h2>
                        <p className="text-sm mb-2">Actions done automatically by the strategy (smart-contract) with an investment of $1000</p>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 text-left">Action</th>
                                    <th className="p-2 text-left">Protocol</th>
                                    <th className="p-2 text-left">Chain Amount</th>
                                    <th className="p-2 text-left">Yield</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Add table rows here based on the image data */}
                                {/* Example row: */}
                                <tr>
                                    <td className="p-2">1. Supply USDC to Aave</td>
                                    <td className="p-2 flex items-center">
                                        <img src="/api/placeholder/20/20" alt="USDC" className="mr-1" />
                                        USDC on
                                        <img src="/api/placeholder/20/20" alt="Aave" className="mx-1" />
                                        Aave
                                    </td>
                                    <td className="p-2">Base $100</td>
                                    <td className="p-2">5.14%</td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* APY */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">APY</span>
                            <span className="text-3xl font-bold text-purple-600">58.06%</span>
                        </div>
                        <div className="mt-4 space-x-2">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded">Deposit</button>
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Withdraw</button>
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold">Invested Amount</p>
                            <p className="text-2xl font-bold">0.00</p>
                        </div>
                        <div className="mt-4 flex items-center">
                            <input type="text" placeholder="0" className="border p-2 rounded w-full" />
                            <button className="ml-2 bg-purple-600 text-white px-4 py-2 rounded">Deposit</button>
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