"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { COMMUNITY_UNION_ADDRESS, LENDING_POOL_ADDRESS, NIMBUS_TOKEN_ADDRESS, COLLATERAL_MANAGER_ADDRESS } from '@/lib/contract';


export default function Funding() {
    const { address } = useAccount();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const [open, setOpen] = useState<string>("deposit");
    const [amount, setAmount] = useState<string>("");
    const [asset, setAsset] = useState<string>("NIBS");
    const [exchange, setExchange] = useState<string>("1");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setOpen(searchParams.get("state") || "deposit");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
    }, [address, provider]);

    const handleTabOpen = (tabCategory: string) => {
        setOpen(tabCategory);
    };

    const priceHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const deposit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(COMMUNITY_UNION_ADDRESS, COMMUNITY_UNION.abi, provider.getSigner());
            console.log("contract", contract);

        } catch (error) {
            console.error("Error creating proposal:", error);
        } finally {
            console.log("Proposal created successfully");
        }
    };

    const borrow = async (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <main className="flex flex-row justify-center align-middle py-5 ">
            <div className="card my-5 bg-base-200 shadow-xl w-[600px] px-10 py-5">
                <div className=" p-4 justify-between items-center">
                    <div className="flex flex-row w-full items-center gap-4">
                        <div
                            className={`w-1/2 py-4 px-1 md:px-4 text-sm font-semibold md:text-base lg:px-12 hover:underline-offset-8
                            rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer 
                                ${open === "deposit"
                                    ? " bg-white drop-shadow-2xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("deposit")}>Deposit</button>
                        </div>

                        <div
                            className={`w-1/2 py-4 px-4 text-sm md:text-base lg:px-12 hover:underline-offset-8
                            text-center rounded-2xl transition-all delay-75 text-black  cursor-pointer ${open === "borrow"
                                    ? " bg-white drop-shadow-2xl text-black font-semibold "
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("borrow")}>
                                Borrow
                            </button>
                        </div>
                    </div>
                    <div className="divider divider-neutral mt-0"></div>

                    {/* Deposit option */}
                    {open === "deposit" && (
                        <div>
                            <form onSubmit={deposit} className="w-full max-w-lg">
                                <div className="my-4">
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <div>Select the Asset</div>
                                        </div>
                                        <select
                                            className="select select-bordered"
                                            value={asset}
                                            onChange={(e) => setAsset(e.target.value)}
                                        >
                                            <option value="NIBS">NIBS (Nimbus Token)</option>
                                            <option value="COLLATERAL">wNIBS (Collateral Token)</option>
                                            <option value="USC">USC</option>
                                            <option value="ETH">ETH</option>
                                            <option value="USDC">USDC</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="my-6">
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <div className="my-2">Enter Amount</div>
                                        </div>
                                        <input
                                            type="text"
                                            id="deposit-value"
                                            value={amount}
                                            onChange={priceHandler}
                                            className="input input-lg input-bordered"
                                            placeholder="0"
                                            required
                                        />
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <div className="my-2">
                                        <div className="flex items-center justify-between">
                                            <div className="">Exchange Rate</div>
                                            <div>1 {asset} = {exchange} w{asset}</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-black dark:bg-slate-900 text-white text-lg font-bold py-4 px-4 w-full dark:text-black border-blue-700"
                                >
                                    Deposit
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Borrow option */}
                    {open === "borrow" && (
                        <div>
                            <form onSubmit={borrow} className="w-full max-w-lg">
                                <div className="my-4">
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <div>Select the Asset</div>
                                        </div>
                                        <select
                                            className="select select-bordered"
                                            value={asset}
                                            onChange={(e) => setAsset(e.target.value)}
                                        >
                                            <option value="NIBS">NIBS (Nimbus Token)</option>
                                            <option value="COLLATERAL">wNIBS (Collateral Token)</option>
                                            <option value="USC">USC</option>
                                            <option value="ETH">ETH</option>
                                            <option value="USDC">USDC</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="my-6">
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <div className="my-2">Enter Amount</div>
                                        </div>
                                        <input
                                            type="text"
                                            id="borrow-value"
                                            value={amount}
                                            onChange={priceHandler}
                                            className="input input-lg input-bordered"
                                            placeholder="0"
                                            required
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-black dark:bg-slate-900 text-white text-lg font-bold py-4 px-4 w-full dark:text-black border-blue-700"
                                >
                                    Borrow
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}