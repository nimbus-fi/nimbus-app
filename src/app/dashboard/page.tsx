"use client";
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

const Dashboard = () => {
    const account = useAccount();
    const { isConnected, address } = account;
    // const { sendTransaction, fetchQuery } = useTransaction();
    // const { status, address } = useChain(CHAIN_NAME);
    // console.log("status", status, "address", address)

    // create states for restaked, delegated, restaked points, restaked ratio
    const [restaked, setRestaked] = React.useState("0.1");
    const [delegated, setDelegated] = React.useState("0.2");
    const [restakedPoints, setRestakedPoints] = React.useState("0");
    const [tokenTransaction, setTokenTransaction] = React.useState("2");

    const [HistroyqueryData, setHistoryQueryData] = React.useState()
    const [StakequeryData, setStakeQueryData] = React.useState()
    const [RestakequeryData, setRestakeQueryData] = React.useState()
    const [RewardequeryData, setRewardQueryData] = React.useState()
    const [UnbondRequestData, setUnbondReQuestQueryData] = React.useState()
    const [DelegationData, setDelegationDataQueryData] = React.useState()


    const convertToNibi = (value: string): string => {
        const valueAsNumber = parseFloat(value);
        const dividedValue = valueAsNumber / Math.pow(10, 6);
        return dividedValue.toString();
    }

    const calculateRestakedPoints = () => {
        const restakedPoint = (parseFloat(restaked) + parseFloat(delegated)) * 2;
        return restakedPoint.toString();
    }


    useEffect(() => {
        const points = calculateRestakedPoints();
        setRestakedPoints(points);
    }, [isConnected, address,]);

    // useEffect(() => {

    // }, []);

    return (
        <div className="flex flex-col justify-between px-28 py-16">
            <div className="pb-5 text-[30px] font-bold ">Dashboard</div>
            <div className="flex gap-5">
                <div className="card shadow-xl w-[50%] bg-white rounded-3xl p-5">
                    <div className="card-body">
                        <h2 className="card-title"> Your Deposits  </h2>
                        <div className="p-5">
                            {isConnected ? (
                                <div className="font-bold text-2xl "> {restaked} UBIT</div>
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
                                <div className="font-bold text-2xl "> {delegated} UBIT</div>
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
                                <div className="font-bold text-2xl "> {restakedPoints} Points</div>
                            ) : (
                                <div>
                                    <progress
                                        className="progress p-2 "
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
                                        className="progress p-2 "
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
                <div className="card w-full my-5 p-5 items-center bg-base-200 shadow-xl">
                    {!isConnected ? (
                        <div className="card-body">

                            <h2 className="card-title">
                                Connect your wallet to view your restaked tokens
                            </h2>
                        </div>
                    )
                        : (
                            <div className="w-full">
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Validator
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Stake
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Voting Power
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Commission
                                                </th>
                                                {/* <th scope="col" className="px-6 py-3">
                            Action
                          </th> */}
                                                {/* <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Delegate</span>
                          </th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    nibiru-0
                                                </th>
                                                <td className="px-6 py-4">
                                                    0.00
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className=" ">98,481,678,444 NIBI</div>
                                                        <div className="text-sm text-gray-500">25.68%</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    5%
                                                </td>
                                                {/* <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delegate</a>
                          </td> */}
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    nibiru-1
                                                </th>
                                                <td className="px-6 py-4">
                                                    0.00
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className=" ">95,000,259,372 NIBI</div>
                                                        <div className="text-sm text-gray-500">24.77%</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    10%
                                                </td>
                                                {/* <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delegate</a>
                          </td> */}
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    nibiru-2
                                                </th>
                                                <td className="px-6 py-4">
                                                    0.00
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className=" ">95,000,135,539 NIBI
                                                        </div>
                                                        <div className="text-sm text-gray-500">24.77%</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    10%
                                                </td>
                                                {/* <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delegate</a>
                          </td> */}
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    nibiru-3
                                                </th>
                                                <td className="px-6 py-4">
                                                    0.00
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className=" ">95,000,087,717 NIBI
                                                        </div>
                                                        <div className="text-sm text-gray-500">24.77%</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    10%
                                                </td>
                                                {/* <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delegate</a>
                          </td> */}
                                            </tr>
                                        </tbody>
                                    </table>
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
