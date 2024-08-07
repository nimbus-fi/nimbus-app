"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { NIMBUS_TOKEN_ADDRESS, COLLATERAL_MANAGER_ADDRESS, COLLATERAL_TOKEN_ADDRESS, NIMBUS_FINANCE } from '@/lib/contract';
import COMMUNITY_UNION from '@/lib/abi/CommunityUnion.json';
import LENDING_POOL from '@/lib/abi/LendingPool.json';
import NIMBUS_FINANCE_JSON from '@/lib/abi/NimbusFinance.json';
import ERC20 from '@/lib/abi/MyToken.json';
import { getCommunityUnionContract, getNimbusFinanceContract } from '@/lib/contract';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Stake() {
    const { address, isConnected } = useAccount();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const [open, setOpen] = useState<string>("lend");
    const [amount, setAmount] = useState<string>("");
    const [asset, setAsset] = useState<string>("EDU"); // default asset
    const [exchange, setExchange] = useState<string>("1");
    const [isNimbusToken, setIsNimbusToken] = useState<boolean>(true);
    const [ apy, setApy] = useState<string>("30");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setOpen(searchParams.get("state") || "lend");
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
                return COLLATERAL_TOKEN_ADDRESS;
            // Add other token addresses as needed
            default:
                return NIMBUS_TOKEN_ADDRESS;
        }
    };

    const lend = async (event: React.FormEvent, asset: string) => {
        event.preventDefault();
        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getNimbusFinanceContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            let tx;
            if (asset === "EDU") {
                // Lend EDU tokens
                tx = await contract.depositEther({ value: amountWei });
            } else {
                // Lend Nimbus tokens
                const tokenContract = new ethers.Contract(
                    NIMBUS_TOKEN_ADDRESS,
                    ['function approve(address spender, uint256 amount) returns (bool)'],
                    provider.getSigner()
                );

                // Approve the contract to spend tokens
                const approveTx = await tokenContract.approve(contract.address, amountWei);
                await approveTx.wait();

                // Lend Nimbus tokens
                tx = await contract.lendNimbus(amountWei);
            }

            await tx.wait();

            toast.success(`${asset} lend successful`);
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
            const contract = getNimbusFinanceContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            // Borrow Nimbus tokens
            const borrowTx = await contract.borrow(amountWei);
            toast.info("Borrowing in progress...");

            await borrowTx.wait();

            toast.success("Borrow successful");
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
            const contract = getNimbusFinanceContract(provider);
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


    const withdraw = async (amount: string,) => {
        if (!isConnected || !provider) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            const contract = getNimbusFinanceContract(provider);
            const amountWei = ethers.utils.parseEther(amount);

            const withdrawTx = await contract.withdraw(amountWei);
            toast.info("Withdrawal in progress...");

            await withdrawTx.wait();

            toast.success(`${asset} withdrawal successful`);
        } catch (error) {
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
            const contract = getNimbusFinanceContract(provider);
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


    return (
        <main className="flex flex-row justify-center align-middle py-5 ">
            <div className="card my-5 bg-base-200 shadow-xl w-[600px] px-10 py-5">
                <div className=" p-4 justify-between items-center">
                    <div className="flex flex-wrap">
                        <div
                            className={`w-1/3 py-4 px-1 md:px-4 text- md:text-base lg:px-12 hover:underline-offset-8
                                    rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer ${open === "stake"
                                    ? "bg-purple-100 drop-shadow-xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("stake")}>Stake</button>
                        </div>

                        <div
                            className={`w-1/3 py-4 px-1 md:px-4 text- md:text-base lg:px-12 hover:underline-offset-8
                                    rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer ${open === "unstake"
                                    ? "bg-purple-200 drop-shadow-xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("unstake")}>
                                Unstake
                            </button>
                        </div>

                        <div
                            className={`w-1/3 py-4 px-1 md:px-4 text- md:text-base lg:px-12 hover:underline-offset-8
                                    rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer ${open === "withdraw"
                                    ? "bg-purple-200 drop-shadow-xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("withdraw")}>
                                Withdraw
                            </button>
                        </div>
                    </div>
                    <div className="divider divider-neutral mt-0"></div>

                    {/* stake option */}
                    {open === "stake" && (
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
                                            <div className="">Rewards Rate</div>
                                            <div> {apy}% APY</div>
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

               
                </div>
            </div>

            <ToastContainer />
        </main>
    );
}