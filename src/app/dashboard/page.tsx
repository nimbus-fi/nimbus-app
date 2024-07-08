import React from 'react'
import { useAccount } from 'wagmi'

const Dashboard: React.FC = () => {

    const account = useAccount()
    console.log("account:", account)

    if (!account.isConnected) {
        return <div>Please connect your wallet to view the dashboard.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <p className="mb-4">Connected Account: {account.address}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Deposits</h2>
                    {/* Add deposit information here */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
                    {/* Add loan information here */}
                </div>
            </div>
        </div>
    )
}

export default Dashboard