"use client";
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

const Borrow: React.FC = () => {
    const account = useAccount()
    console.log("account:", account)

    const [amount, setAmount] = useState('')
    const [collateral, setCollateral] = useState('')

    const handleBorrow = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement borrowing logic here
        console.log('Borrowing:', amount, 'Collateral:', collateral)
    }

    if (!account.isConnected) {
        return <div className="flex items-center align-middle min-h-screen text-center justify-center text-4xl font-bold">
            <div>
                Please connect your wallet.
            </div>
        </div>
    }

    return (
        <div className="flex flex-col justify-between px-28 py-16">
            <h1 className="text-3xl font-bold mb-6">Borrow</h1>
            <form onSubmit={handleBorrow} className="max-w-md">
                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-2">Amount to Borrow</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white "
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="collateral" className="block mb-2">Collateral Amount</label>
                    <input
                        type="number"
                        id="collateral"
                        value={collateral}
                        onChange={(e) => setCollateral(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white "
                        required
                    />
                </div>
                <button type="submit" className="bg-black text-xl font-semibold text-white px-6 py-4 rounded-xl">
                    Borrow
                </button>
            </form>
        </div>
    )
}

export default Borrow