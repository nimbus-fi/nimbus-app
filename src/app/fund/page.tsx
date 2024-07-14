"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { COMMUNITY_UNION_ADDRESS, LENDING_POOL_ADDRESS, NIMBUS_TOKEN_ADDRESS, COLLATERAL_MANAGER_ADDRESS, COLLATERAL_TOKEN_ADDRESS } from '@/lib/contract';
import COMMUNITY_UNION from '@/lib/abi/CommunityUnion.json';
import LENDING_POOL from '@/lib/abi/LendingPool.json';
import ERC20 from '@/lib/abi/MyToken.json';
import { getCommunityUnionContract, getLendingPoolContract } from '@/lib/contract';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Funding() {
    const { address, isConnected } = useAccount();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const [open, setOpen] = useState<string>("deposit");
    const [amount, setAmount] = useState<string>("");
    const [asset, setAsset] = useState<string>("NIBS");
    const [exchange, setExchange] = useState<string>("1");
    const [isNimbusToken, setIsNimbusToken] = useState<boolean>(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setOpen(searchParams.get("state") || "deposit");
        if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
        }
    }, []);

    const handleTabOpen = (tabCategory: string) => {
        setOpen(tabCategory);
    };

    const priceHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const getTokenAddress = (asset: string) => {
        switch (asset) {
            case "NIBS":
                setIsNimbusToken(true);
                return NIMBUS_TOKEN_ADDRESS;
            case "COLLATERAL":
                setIsNimbusToken(false);
                return COLLATERAL_MANAGER_ADDRESS;
            // Add other token addresses as needed
            default:
                return NIMBUS_TOKEN_ADDRESS;
        }
    };

    const deposit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getCommunityUnionContract(provider);

            // Get token sign
            const tokenAddress = isNimbusToken ? NIMBUS_TOKEN_ADDRESS : COLLATERAL_TOKEN_ADDRESS;
            const tokenContract = new ethers.Contract(
                tokenAddress, ERC20.abi, provider.getSigner()
            );
            const amountWei = ethers.utils.parseUnits(amount, 18);
            console.log("deposit amount:", amountWei.toString());

            // Approve the contract to spend tokens
            const approveTx = await tokenContract.approve(contract.address, amountWei);
            await approveTx.wait();

            // Deposit tokens
            const depositTx = await contract.deposit(amountWei, isNimbusToken);
            await depositTx.wait();

            toast.success("Deposit successful");
            setAmount("");
        } catch (error) {
            console.error("Error depositing:", error);
            toast.error("Error depositing. Please try again.");
        }
    };

    const borrow = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getCommunityUnionContract(provider);

            const amountWei = ethers.utils.parseUnits(amount, 18);

            // Borrow tokens
            const borrowTx = await contract.borrow(amountWei, { gasLimit: 100000 });
            toast.info("Borrowing in progress...");

            await borrowTx.wait();

            toast.success("Borrow successful");
        } catch (error) {
            console.error("Error borrowing:", error);
            toast.error("Error borrowing. Please try again.");
        }
    };

    const withdraw = async (amount: string, isNimbus: boolean) => {

        if (!window.ethereum) {
            toast.error("Please install MetaMask!");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getCommunityUnionContract(provider);

            const amountWei = ethers.utils.parseUnits(amount, 18);

            // Withdraw tokens
            const withdrawTx = await contract.withdraw(amountWei, isNimbus);
            toast.info("Withdrawal in progress...");

            await withdrawTx.wait();

            toast.success("Withdrawal successful");
        } catch (error) {
            console.error("Error withdrawing:", error);
            toast.error("Error withdrawing. Please try again.");
        }
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
                                            <option value="USC">USC (soon)</option>
                                            <option value="ETH">ETH (soon)</option>
                                            <option value="USDC">USDC (soon)</option>
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
                                            <option value="USC">USC (soon)</option>
                                            <option value="ETH">ETH (soon)</option>
                                            <option value="USDC">USDC (soon)</option>
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
            <ToastContainer />
        </main>
    );
}