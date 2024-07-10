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
        return <div>Please connect your wallet to borrow.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Borrow</h1>
            <form onSubmit={handleBorrow} className="max-w-md">
                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-2">Amount to Borrow</label>
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
                    <label htmlFor="collateral" className="block mb-2">Collateral Amount</label>
                    <input
                        type="number"
                        id="collateral"
                        value={collateral}
                        onChange={(e) => setCollateral(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Borrow
                </button>
            </form>
        </div>
    )
}

export default Borrow