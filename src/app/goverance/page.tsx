"use client";
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

const Governance: React.FC = () => {
    const account = useAccount()
    const [proposalTitle, setProposalTitle] = useState('')
    const [proposalDescription, setProposalDescription] = useState('')

    const handleSubmitProposal = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement proposal submission logic here
        console.log('Submitting proposal:', proposalTitle, proposalDescription)
    }

    if (!account.isConnected) {
        return <div>Please connect your wallet to participate in governance.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Governance</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Active Proposals</h2>
                {/* Add list of active proposals here */}
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Submit New Proposal</h2>
                <form onSubmit={handleSubmitProposal} className="max-w-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2">Proposal Title</label>
                        <input
                            type="text"
                            id="title"
                            value={proposalTitle}
                            onChange={(e) => setProposalTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2">Proposal Description</label>
                        <textarea
                            id="description"
                            value={proposalDescription}
                            onChange={(e) => setProposalDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows={4}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
                        Submit Proposal
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Governance