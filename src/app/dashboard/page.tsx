"use client";
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';
import { COMMUNITY_UNION_ADDRESS } from '@/lib/contract';
import COMMUNITY_UNION from '@/lib/abi/CommunityUnion.json';
import { ethers } from 'ethers';
import TransactionTable from '@/components/TransactionTable';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { getNimbusFinanceContract } from '@/lib/contract';


interface Transaction {
    transactionHash: string;
    type: string;
    blockNumber: number;
    previousOwner?: string;
    newOwner?: string;
    member?: string;
    amount?: {
        type: string;
        hex: string;
    };
    isNimbus?: boolean;
}

interface TransactionTableProps {
    transactions: Transaction[];
}

const Dashboard = () => {
    const account = useAccount();
    const { isConnected, address } = account;

    // create states for lend, borrow, lend points, lend ratio
    const [lend, setLend] = useState("0.0");
    const [borrow, setBorrow] = useState("0.0");
    const [lendPoints, setLendPoints] = useState("0");
    const [tokenTransaction, setTokenTransaction] = useState("2");
    const [balance, setBalance] = useState("");

    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const getUserInfo = async () => {
        if (address && isConnected) {

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = getNimbusFinanceContract(provider);
                const [etherBalance, nimbusBalance, borrowedAmount] = await contract.getUserInfo(address);
                // etherBalance, nimbusBalance, borrowedAmount 

                setBalance(ethers.utils.formatEther(etherBalance));
                setLend(ethers.utils.formatEther(nimbusBalance));
                setBorrow(ethers.utils.formatEther(borrowedAmount));


            } catch (error) {
                console.error("Error getting user info:", error);
                toast.error("Error fetching user information");
            }
        }
        else {
            toast.error("Please connect your wallet");
            return;

        }
    };



    useEffect(() => {
        const fetchEvents = async () => {
            if (isConnected && window.ethereum) {
                setLoading(true);
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const contract = new ethers.Contract(COMMUNITY_UNION_ADDRESS, COMMUNITY_UNION.abi, provider);

                    const filter = {
                        address: COMMUNITY_UNION_ADDRESS,
                        fromBlock: 0,
                        toBlock: 'latest'
                    };

                    const events = await provider.getLogs(filter);
                    const parsedEvents = events.map(log => {
                        const parsedLog = contract.interface.parseLog(log);
                        return {
                            type: parsedLog.name,
                            ...parsedLog.args,
                            blockNumber: log.blockNumber,
                            transactionHash: log.transactionHash
                        };
                    });

                    console.log("parsedEvents", parsedEvents, "events", events);


                    // const userEvents = parsedEvents.filter(event =>
                    //     event?.member && event?.member.toLowerCase() === (await provider.getSigner().getAddress()).toLowerCase()
                    // );

                    // const transactionPromises = userEvents.map(async event => {
                    //     const block = await provider.getBlock(event.blockNumber);
                    //     return {
                    //         ...event,
                    //         timestamp: block.timestamp,
                    //         amount: event.amount ? ethers.utils.formatUnits(event.amount, 18) : '0',
                    //         token: event.isNimbus ? 'Nimbus' : 'Collateral',
                    //         status: 'Completed'
                    //     };
                    // });

                    // const transactions = await Promise.all(transactionPromises);
                    // @ts-ignore
                    setTransactions(parsedEvents);
                } catch (error) {
                    console.error("Error fetching events:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        getUserInfo();
        fetchEvents();

        if (isConnected && address) {
            const points = calculateLendPoints();
            setLendPoints(points);
        }
    }, [isConnected, address, lend, borrow, balance]);


    const calculateLendPoints = () => {
        const lendPoint = (parseFloat(lend) + parseFloat(borrow) + parseFloat(balance)) * 2;
        return lendPoint.toString();
    }

    const formatAmount = (amount: Transaction['amount']): string => {
        if (amount && amount.type === "BigNumber") {
            return ethers.utils.formatUnits(amount.hex, 18);
        }
        return "N/A";
    };


    useEffect(() => {
        const points = calculateLendPoints();
        setLendPoints(points);
    }, [isConnected, address,]);

    return (
        <div className="flex flex-col justify-between px-28 py-16">
            <div className="pb-5 text-[30px] font-bold ">Dashboard</div>
            <div className="flex gap-5">
                <div className="card shadow-xl w-[50%] bg-white rounded-3xl p-5">
                    <div className="card-body">
                        <h2 className="card-title"> Your Lends  </h2>
                        <div className="p-5">
                            {isConnected ? (
                                <div className='flex gap-10'>
                                    <div className="font-bold text-2xl "> {balance} USC</div>
                                    <div className="font-bold text-2xl "> {lend} NIBS</div>
                                </div>

                            ) : (
                                <div>
                                    <progress className="progress p-2 "></progress>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card shadow-xl w-[50%] bg-white rounded-3xl p-5">
                    <div className="card-body">
                        <h2 className="card-title">Your Loans</h2>
                        <div className="p-5">
                            {isConnected ? (
                                <div className="font-bold text-2xl "> {borrow} USC</div>
                            ) : (
                                <div>
                                    <progress className="progress p-2 "></progress>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <div className=" w-[50%]">
                    <div className="m-5 p-5 rounded-lg">
                        <div className="p-0">
                            {isConnected ? (
                                <div className="font-bold text-2xl "> {lendPoints} Points</div>
                            ) : (
                                <div>
                                    <progress
                                        className="progress p-2 bg-gray-100"
                                        value={0}
                                        max="100"
                                    ></progress>
                                </div>
                            )}
                        </div>
                        <h2 className="">Nimbus Points</h2>
                    </div>
                </div>
                <div className="w-[50%]">
                    <div className="m-5 p-5 rounded-lg">
                        <div className="p-0">
                            {isConnected ? (
                                <div className="font-bold text-2xl "> {tokenTransaction}</div>
                            ) : (
                                <div>
                                    <progress
                                        className="progress p-2 bg-gray-100"
                                        value={0}
                                        max="100"
                                    ></progress>
                                </div>
                            )}
                        </div>
                        <h2 className="">Total Transaction</h2>
                    </div>
                </div>
            </div>

            {/* loan table  */}
            <div>
                <div className="text-xl font-bold"> Your Transactions</div>
                <div className="card w-full my-5 p-5 items-center bg-gray-100 shadow-xl">
                    {!isConnected ? (
                        <div className="card-body">

                            <h2 className="card-title">
                                Connect your wallet to view your loan transactions
                            </h2>
                        </div>
                    )
                        : (
                            <div className="w-full">
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    {/* @ts-ignore */}
                                    <TransactionTable transactions={transactions} />
                                </div>

                            </div>
                        )
                    }
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
