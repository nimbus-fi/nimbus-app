"use client"
import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { getLendingPoolContract } from '../utils/contracts'

const Borrow: React.FC = () => {
    const { active, account, library } = useWeb3React()
    const [amount, setAmount] = useState('')
    const [collateral, setCollateral] = useState('')
    const [activeLoan, setActiveLoan] = useState<any>(null)
    const [isBorrowing, setIsBorrowing] = useState(false)
    const [isRepaying, setIsRepaying] = useState(false)

    useEffect(() => {
        if (active && account) {
            fetchActiveLoan()
        }
    }, [active, account])

    const fetchActiveLoan = async () => {
        if (library) {
            const contract = getLendingPoolContract(library)
            const loan = await contract.loans(account)
            if (loan.amount.gt(0) && !loan.repaid) {
                setActiveLoan({
                    amount: ethers.utils.formatEther(loan.amount),
                    collateral: ethers.utils.formatEther(loan.collateralAmount),
                    interestRate: loan.interestRate.toNumber(),
                    startTime: new Date(loan.startTime.toNumber() * 1000).toLocaleString(),
                })
            } else {
                setActiveLoan(null)
            }
        }
    }

    const handleBorrow = async (e: React.FormEvent) => {
        e.preventDefault()
        if (library) {
            try {
                setIsBorrowing(true)
                const contract = getLendingPoolContract(library)
                const amountInWei = ethers.utils.parseEther(amount)
                const tx = await contract.takeLoan(amountInWei)
                await tx.wait()
                await fetchActiveLoan()
                setAmount('')
                setCollateral('')
            } catch (error) {
                console.error('Error borrowing:', error)
            } finally {
                setIsBorrowing(false)
            }
        }
    }

    const handleRepay = async () => {
        if (library && activeLoan) {
            try {
                setIsRepaying(true)
                const contract = getLendingPoolContract(library)
                const tx = await contract.repayLoan()
                await tx.wait()
                await fetchActiveLoan()
            } catch (error) {
                console.error('Error repaying:', error)
            } finally {
                setIsRepaying(false)
            }
        }
    }

    if (!active) {
        return <div>Please connect your wallet to borrow.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Borrow</h1>
            {activeLoan ? (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Active Loan</h2>
                    <p>Amount: {activeLoan.amount} ETH</p>
                    <p>Collateral: {activeLoan.collateral} ETH</p>
                    <p>Interest Rate: {activeLoan.interestRate}%</p>
                    <p>Start Time: {activeLoan.startTime}</p>
                    <button
                        onClick={handleRepay}
                        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                        disabled={isRepaying}
                    >
                        {isRepaying ? 'Repaying...' : 'Repay Loan'}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleBorrow} className="max-w-md">
                    <div className="mb-4">
                        <label htmlFor="amount" className="block mb-2">Amount to Borrow (ETH)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="collateral" className="block mb-2">Collateral Amount (ETH)</label>
                        <input
                            type="number"
                            id="collateral"
                            value={collateral}
                            onChange={(e) => setCollateral(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        disabled={isBorrowing}
                    >
                        {isBorrowing ? 'Borrowing...' : 'Borrow'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default Borrow