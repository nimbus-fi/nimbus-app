"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { NIMBUS_TOKEN_ADDRESS, NIMBUS_FINANCE, USDC_EDUCHAIN, } from '@/lib/contract';
import COMMUNITY_UNION from '@/lib/abi/CommunityUnion.json';
import LENDING_POOL from '@/lib/abi/LendingPool.json';
import NIMBUS_FINANCE_JSON from '@/lib/abi/NimbusFinance.json';
import ERC20 from '@/lib/abi/ERC20abi.json';
import { getCommunityUnionContract, getLoanProtocolContract } from '@/lib/contract';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AssetsTable from "@/components/assets";

export default function Funding() {
    const { address, isConnected } = useAccount();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const [open, setOpen] = useState<string>("lend");
    const [amount, setAmount] = useState<string>("");
    const [asset, setAsset] = useState<string>("EDU"); // default asset
    const [exchange, setExchange] = useState<string>("1");
    const [isNimbusToken, setIsNimbusToken] = useState<boolean>(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setOpen(searchParams.get("borrow") || "lend");
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

    // const getTokenAddress = (asset: string) => {
    //     switch (asset) {
    //         case "NIBS":
    //             setIsNimbusToken(true);
    //             return NIMBUS_TOKEN_ADDRESS;
    //         case "COLLATERAL":
    //             setIsNimbusToken(false);
    //             return COLLATERAL_TOKEN_ADDRESS;
    //         // Add other token addresses as needed
    //         default:
    //             return NIMBUS_TOKEN_ADDRESS;
    //     }
    // };

    const lend = async (event: React.FormEvent, asset: string) => {
        event.preventDefault();
        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getLoanProtocolContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            let tx;
            if (asset === "EDU") {
                // Lend EDU tokens
                tx = await contract.depositEther({ value: amountWei });
            } else {
                // Lend Nimbus tokens
                if (asset === "NIBS") {
                    const tokenContract = new ethers.Contract(
                        NIMBUS_TOKEN_ADDRESS,
                        ['function approve(address spender, uint256 amount) returns (bool)'],
                        provider.getSigner()
                    );
                    // Approve the contract to spend tokens
                    const approveTx = await tokenContract.approve(contract.address, amountWei);
                    await approveTx.wait();

                    // Lend Nimbus tokens
                    tx = await contract.depositNibs(NIMBUS_TOKEN_ADDRESS, amountWei);
                }
                else {
                    const tokenContract = new ethers.Contract(
                        USDC_EDUCHAIN,
                        ['function approve(address spender, uint256 amount) returns (bool)'],
                        provider.getSigner()
                    );
                    // Approve the contract to spend tokens
                    const approveTx = await tokenContract.approve(contract.address, amountWei);
                    await approveTx.wait();

                    // Lend Nimbus tokens
                    tx = await contract.depositUsdc(USDC_EDUCHAIN, amountWei);
                }
            }

            await tx.wait();

            toast.success(`${amount} ${asset} lend successful`);
            toast(
                <div>
                    Link - {`https://opencampus-codex.blockscout.com/tx/${tx.hash}`}
                </div>
            );
            setAmount("");
        } catch (error) {
            console.error("Error lending:", error);
            toast.error("Error lending. Please try again.");
        }
    };


    const borrow = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getLoanProtocolContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            let tx;
            if (asset === "EDU") {
                tx = await contract.borrowEther({ value: amountWei });
            } else {
                if (asset === "NIBS") {
                    const tokenContract = new ethers.Contract(
                        NIMBUS_TOKEN_ADDRESS,
                        ['function approve(address spender, uint256 amount) returns (bool)'],
                        provider.getSigner()
                    );
                    // Approve the contract to spend tokens
                    const approveTx = await tokenContract.approve(contract.address, amountWei);
                    await approveTx.wait();

                    // Lend Nimbus tokens
                    tx = await contract.borrowNibs(amountWei);
                }
                else {
                    const tokenContract = new ethers.Contract(
                        USDC_EDUCHAIN,
                        ['function approve(address spender, uint256 amount) returns (bool)'],
                        provider.getSigner()
                    );
                    // Approve the contract to spend tokens
                    const approveTx = await tokenContract.approve(contract.address, amountWei);
                    await approveTx.wait();

                    // Lend Nimbus tokens
                    tx = await contract.borrowUsdc(amountWei);
                }
            }

            toast.success(`${amount} ${asset} borrow successful`);
            toast(
                <div>
                    Link - {`https://opencampus-codex.blockscout.com/tx/${tx.hash}`}
                </div>
            );
            setAmount("");
        } catch (error) {
            console.error("Error borrowing:", error);
            toast.error("Error borrowing. Please try again.");
        }
    };

    const getUserInfo = async (address: string) => {
        if (!provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getLoanProtocolContract(provider);
            const [etherBalance, nimbusBalance, borrowedAmount] = await contract.getUserInfo(address);

            return {
                etherBalance: ethers.utils.formatEther(etherBalance),
                nimbusBalance: ethers.utils.formatEther(nimbusBalance),
                borrowedAmount: ethers.utils.formatEther(borrowedAmount)
            };
        } catch (error) {
            console.error("Error getting user info:", error);
            toast.error("Error fetching user information");
        }
    };

    const withdraw = async (event: React.FormEvent, asset: string) => {
        event.preventDefault();

        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }
        try {
            const contract = getLoanProtocolContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            let tx;
            if (asset === "EDU") {
                tx = await contract.borrowEther({ value: amountWei });
            } else {
                if (asset === "NIBS") {
                    const tokenContract = new ethers.Contract(
                        NIMBUS_TOKEN_ADDRESS,
                        ['function approve(address spender, uint256 amount) returns (bool)'],
                        provider.getSigner()
                    );
                    // Approve the contract to spend tokens
                    const approveTx = await tokenContract.approve(contract.address, amountWei);
                    await approveTx.wait();

                    // Lend Nimbus tokens
                    tx = await contract.borrowNibs(amountWei);
                }
                else {
                    const tokenContract = new ethers.Contract(
                        USDC_EDUCHAIN,
                        ['function approve(address spender, uint256 amount) returns (bool)'],
                        provider.getSigner()
                    );
                    // Approve the contract to spend tokens
                    const approveTx = await tokenContract.approve(contract.address, amountWei);
                    await approveTx.wait();

                    // Lend Nimbus tokens
                    tx = await contract.borrowUsdc(amountWei);
                }
            }

            toast.success(`${amount} ${asset} withdraw successful`);
            toast(
                <div>
                    Link - {`https://opencampus-codex.blockscout.com/tx/${tx.hash}`}
                </div>
            );
            setAmount("");
        }
        catch (error) {
            console.error("Error withdrawing:", error);
            toast.error("Error withdrawing. Please try again.");
        }
    };

    const repay = async (amount: string) => {
        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getLoanProtocolContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            // Approve Nimbus tokens first
            const tokenContract = new ethers.Contract(
                NIMBUS_TOKEN_ADDRESS,
                ['function approve(address spender, uint256 amount) returns (bool)'],
                provider.getSigner()
            );
            const approveTx = await tokenContract.approve(contract.address, amountWei);
            await approveTx.wait();

            // Repay borrowed amount
            const repayTx = await contract.repay(amountWei);
            toast.info("Repayment in progress...");

            await repayTx.wait();

            toast.success("Repayment successful");
        } catch (error) {
            console.error("Error repaying:", error);
            toast.error("Error repaying. Please try again.");
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        lend(event, asset);
    };

    const handleWithdraw = (event: React.FormEvent) => {
        withdraw(event, asset);
    }

    return (
        <main className="justify-between py-5 ">

            <div className="flex flex-row justify-center align-middle ">
                <div className="card my-5 bg-gray-100 dark:bg-gray-800  shadow-xl w-[600px] px-10 py-5">
                    <div className=" p-4 justify-between items-center">
                        <div className="flex flex-row w-full items-center gap-4">
                            <div
                                className={`w-1/2 py-4 px-1 md:px-4 text-sm font-semibold md:text-base lg:px-12 hover:underline-offset-8
                            rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer 
                                ${open === "lend"
                                        ? " bg-white drop-shadow-2xl text-black font-semibold"
                                        : " "
                                    }`}
                            >
                                <button onClick={() => handleTabOpen("lend")}>Lend</button>
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

                        <div
                            className={`w-1/2 py-4 px-1 md:px-4 text-sm font-semibold md:text-base lg:px-12 hover:underline-offset-8
                            rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer 
                                ${open === "withdraw"
                                    ? " bg-white drop-shadow-2xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("withdraw")}>Withdraw</button>
                        </div>

                        {/* Lend option */}
                        {open === "lend" && (
                            <div>
                                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                                    <div className="my-4 ">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <div className="">Select the Asset</div>
                                            </div>
                                            <select
                                                className="select select-bordered"
                                                value={asset}
                                                onChange={(e) => setAsset(e.target.value)}
                                            >
                                                <option value="EDU">EDU ( Native Chain Token)</option>
                                                <option value="NIBS">NIBS (Nimbus Token)</option>
                                                <option value="USDC">USDC</option>
                                                <option value="ETH">ETH (coming soon)</option>
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
                                                id="lend-value"
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
                                                <div>1 {asset} = {exchange} wNIBS</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-black text-white text-lg font-bold py-4 px-4 w-full border-blue-700"
                                    >
                                        Lend
                                    </button>
                                </form>
                            </div>
                        )}

                        {open === "withdraw" && (
                            <div>
                                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                                    <div className="my-4 ">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <div className="">Select the Asset</div>
                                            </div>
                                            <select
                                                className="select select-bordered"
                                                value={asset}
                                                onChange={(e) => setAsset(e.target.value)}
                                            >
                                                <option value="EDU">EDU ( Native Chain Token)</option>
                                                <option value="NIBS">NIBS (Nimbus Token)</option>
                                                <option value="USDC">USDC</option>
                                                <option value="ETH">ETH (coming soon)</option>
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
                                                id="lend-value"
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
                                        className="bg-black text-white text-lg font-bold py-4 px-4 w-full border-blue-700"
                                    >
                                        Withdraw
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
                                                <option value="EDU">EDU ( Native Chain Token)</option>
                                                <option value="NIBS">NIBS (Nimbus Token)</option>
                                                <option value="COLLATERAL">wNIBS (Collateral Token)</option>
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
                                        className="bg-black text-white text-lg font-bold py-4 px-4 w-full border-blue-700"
                                    >
                                        Borrow
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center align-middle px-28 py-16 ">
                <AssetsTable />
            </div>
            <ToastContainer />
        </main>
    );
}