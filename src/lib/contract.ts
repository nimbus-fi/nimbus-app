import { ethers } from 'ethers'

export const COMMUNITY_UNION_ADDRESS = '0x...'; // Replace with actual address
export const LENDING_POOL_ADDRESS = '0x...'; // Replace with actual address


export function getCommunityUnionContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(COMMUNITY_UNION_ADDRESS, COMMUNITY_UNION_ABI, provider.getSigner());
}

export function getLendingPoolContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, provider.getSigner());
}

export const COMMUNITY_UNION_ABI = [
    // Add the ABI for CommunityUnion contract
];

export const LENDING_POOL_ABI = [
    // Add the ABI for LendingPool contract
];
