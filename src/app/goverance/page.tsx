"use client";
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi'
import { ethers } from 'ethers';
import { GOVERNANCE_ADDRESS } from '@/lib/contract';
import GovernanceABI from '@/lib/abi/Governance.json';

interface Proposal {
    id: number;
    description: string;
    forVotes: string;
    againstVotes: string;
    executed: boolean;
    endTime: Date;
}

const Governance: React.FC = () => {
    const account = useAccount()
    const address = account.address;

    // const { active, account, library } = useWeb3React();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [proposalDescription, setProposalDescription] = useState('')
    const [newProposal, setNewProposal] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (address && account.isConnected) {
            fetchProposals();
        }
    }, []);

    const getGovernanceContract = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("provider", provider);
        if (!provider) throw new Error("No Web3 Provider");
        return new ethers.Contract(GOVERNANCE_ADDRESS, GovernanceABI.abi, provider.getSigner());
    };

    const fetchProposals = async () => {
        const contract = getGovernanceContract();
        const count = await contract.getProposalCount();
        const fetchedProposals: Proposal[] = [];

        for (let i = 0; i < count.toNumber(); i++) {
            const proposal = await contract.getProposal(i);
            fetchedProposals.push({
                id: i,
                description: proposal.description,
                forVotes: ethers.utils.formatEther(proposal.forVotes),
                againstVotes: ethers.utils.formatEther(proposal.againstVotes),
                executed: proposal.executed,
                endTime: new Date(proposal.endTime.toNumber() * 1000)
            });
        }

        setProposals(fetchedProposals);
    };

    const createProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProposal.trim()) return;

        setLoading(true);
        try {
            console.log("Creating proposal:", newProposal);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(GOVERNANCE_ADDRESS, GovernanceABI.abi, provider.getSigner());
            console.log("contract", contract);
            const tx = await contract.createProposal(newProposal);
            await tx.wait();
            setNewProposal('');
            await fetchProposals();
        } catch (error) {
            console.error("Error creating proposal:", error);
        } finally {
            setLoading(false);
        }
    };

    const vote = async (proposalId: number, support: boolean) => {
        setLoading(true);
        try {
            const contract = getGovernanceContract();
            const tx = await contract.vote(proposalId, support);
            await tx.wait();
            await fetchProposals();
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!account.isConnected) {
        return <div className="flex items-center align-middle min-h-screen text-center justify-center text-4xl font-bold">
            <div>
                Please connect your wallet.
            </div>
        </div>
    }

    return (
        <div className="container mx-auto px-32 py-16">
            <h1 className="text-3xl font-bold mb-6">Governance</h1>

            <form onSubmit={createProposal} className="mb-8 ">
                <input
                    type="text"
                    value={newProposal}
                    onChange={(e) => setNewProposal(e.target.value)}
                    placeholder="Enter new proposal"
                    className="w-full p-2 border rounded bg-white"
                />
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2">Proposal Description</label>
                    <textarea
                        id="description"
                        value={proposalDescription}
                        onChange={(e) => setProposalDescription(e.target.value)}
                        className="w-full p-2 border rounded-xl bg-white"
                        rows={3}
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Creating...' : 'Create Proposal'}
                </button>
            </form>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Active Proposals</h2>
                {proposals.map((proposal) => (
                    <div key={proposal.id} className="border p-4 mb-4 rounded">
                        <h3 className="text-xl font-semibold">{proposal.description}</h3>
                        <p>For: {proposal.forVotes} | Against: {proposal.againstVotes}</p>
                        <p>Ends: {proposal.endTime.toLocaleString()}</p>
                        {!proposal.executed && new Date() < proposal.endTime && (
                            <div className="mt-2">
                                <button
                                    onClick={() => vote(proposal.id, true)}
                                    disabled={loading}
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Vote For
                                </button>
                                <button
                                    onClick={() => vote(proposal.id, false)}
                                    disabled={loading}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Vote Against
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Governance;