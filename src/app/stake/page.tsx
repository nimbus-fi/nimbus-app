"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { NIMBUS_TOKEN_ADDRESS, STAKED_EDU_ADDRESS, STAKING_CONTRACT } from '@/lib/contract';
import COMMUNITY_UNION from '@/lib/abi/CommunityUnion.json';
import LENDING_POOL from '@/lib/abi/LendingPool.json';
import NIMBUS_FINANCE_JSON from '@/lib/abi/NimbusFinance.json';
import ERC20 from '@/lib/abi/ERC20abi.json';
import NimbusTokenABI from '@/lib/abi/NimbusToken.json';
import StakedEDUABI from '@/lib/abi/StakedEDU.json';
import StakingABI from '@/lib/abi/Staking.json';
import { getCommunityUnionContract, getNimbusFinanceContract } from '@/lib/contract';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Stake() {
    const { address, isConnected } = useAccount();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    const [open, setOpen] = useState<string>("stake"); // unstake, withdraw
    const [amount, setAmount] = useState<string>("");
    const [asset, setAsset] = useState<string>("EDU"); // default asset
    const [unstakeAmount, setUnstakeAmount] = useState<string>("0");
    const [unstakeStatus, setUnstakeStatus] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState<string>("1");
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    const [exchange, setExchange] = useState<string>("1");
    const [isNimbusToken, setIsNimbusToken] = useState<boolean>(true);
    const [apy, setApy] = useState<string>("5");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        setOpen(searchParams.get("state") || "stake");
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

    const unstakeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setUnstakeAmount(event.target.value);
        console.log("unstake amount", unstakeAmount);
    };

    const termsHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(event.target.checked);
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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(STAKING_CONTRACT, StakingABI.abi, provider.getSigner());
            const amountWei = ethers.utils.parseEther(amount);

            let tx;
            if (asset === "EDU") {
                // Lend EDU tokens
                tx = await contract.depositEther({ value: amountWei });
            } else {
                // stake Nimbus tokens
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

    // async function stakeEDU(amountInWei) {
    //     try {
    //         const contract = await getContract();

    //         const tx = await contract.stake({
    //             value: amountInWei // amount to stake, in wei
    //         });

    //         console.log('Transaction submitted, waiting for confirmation...');
    //         await tx.wait();
    //         console.log('Transaction confirmed:', tx);
    //     } catch (error) {
    //         console.error('Error staking EDU:', error);
    //     }
    // }


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


    const withdraw = async () => {
        // event.preventDefault(); // Prevent the default form submission

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
            <div className="card my-5 bg-gray-100 shadow-xl w-[600px] px-10 py-5">
                <div className=" p-4 justify-between items-center">
                    <div className="flex flex-wrap">
                        <div
                            className={`w-1/3 py-4 px-1 md:px-4 text- md:text-base lg:px-12 hover:underline-offset-8
                                    rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer 
                                    ${open === "stake"
                                    ? "bg-white drop-shadow-xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("stake")}>Stake</button>
                        </div>

                        <div
                            className={`w-1/3 py-4 px-1 md:px-4 text- md:text-base lg:px-12 hover:underline-offset-8
                                    rounded-2xl text-center transition-all delay-75 text-black focus:ring focus:ring-blue-400 cursor-pointer 
                                    ${open === "unstake"
                                    ? "bg-white drop-shadow-xl text-black font-semibold"
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
                                    ? "bg-white drop-shadow-xl text-black font-semibold"
                                    : " "
                                }`}
                        >
                            <button onClick={() => handleTabOpen("withdraw")}>
                                Rewards
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
                                            <div className="">Exchange Rate</div>
                                            <div>1 {asset} = {exchange} stEDU</div>
                                        </div>
                                    </div>
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
                                    Stake
                                </button>
                            </form>
                        </div>
                    )}

                    {/* unstake option */}
                    {open === "unstake" && (
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
                                            id="unstake-value"
                                            defaultValue={unstakeAmount}
                                            onChange={unstakeHandler}
                                            className="input input-lg input-bordered"
                                            placeholder="0"
                                            required
                                        />
                                    </label>
                                </div>

                                <div className="text-sm">
                                    {/* <div className="my-1 border-t border-gray-300"></div> */}
                                    <div className="">
                                        <div className="flex items-center justify-between">
                                            <div className="">You wil get</div>
                                            <div>{amount} EDU</div>
                                        </div>
                                    </div>

                                    <div className="my-2">
                                        <div className="flex items-center justify-between">
                                            <div className="">Exchange Rate</div>
                                            <div>1 stEDU = {exchange} EDU</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-black text-white text-lg font-bold py-4 px-4 w-full border-blue-700"
                                >
                                    Unstake
                                </button>
                            </form>
                        </div>
                    )}

                    {/* withdraw option */}
                    {open === "withdraw" && (
                        <div>
                            <div role="alert" className="mt-3 alert alert-warning">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span>
                                    Reward requests are subject to last exit queue on the Network.
                                </span>
                            </div>

                            {!unstakeStatus ? (
                                <div>
                                    <div className="flex flex-col align-middle justify-center my-8 py-8 p-5 bg-white rounded-3xl ">
                                        <div className="py-5 text-center text-3xl font-semibold">
                                            No unstake requests found
                                        </div>
                                        <div className="py-5 text-center ">
                                            You will be able to claim your rewards tokens after the Unstake
                                            request has been processed. To Unstake your tokens go to
                                            Unstake tab
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <form onSubmit={withdraw} className="w-full max-w-lg">
                                        <div className="my-4">
                                            <label className="form-control w-full">
                                                <div className="label">
                                                    <div className="font-bold text-2xl pt-5">
                                                        Rewards amount available
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="my-6">
                                            <label className="form-control w-full">
                                                <div className="input input-lg input-bordered">
                                                    <div className="flex align-middle justify-between text-center pt-2 ">
                                                        {withdrawAmount} NIBS
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="flex items-center mb-6">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={termsHandler}
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-lg font-semibold text-black dark:text-white"
                                            >
                                                I want to withdraw all my rewards token
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-black text-white text-lg font-bold py-4 px-4 w-full border-blue-700">
                                            Withdraw
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            <ToastContainer />
        </main>
    );
}