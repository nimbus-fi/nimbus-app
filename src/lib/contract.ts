import { ethers } from 'ethers'

export const COMMUNITY_UNION_ADDRESS = '0x832716905503D1AedCf324765eD3c7c49b65a57e';  
export const LENDING_POOL_ADDRESS = '0x92589b38d3B5d32318b328B985408babF4379d3F';  
export const GOVERNANCE_ADDRESS = '0xDa2656359decA09E2Bf335CAe988421b2a740ADe'; 
export const COLLATERAL_MANAGER_ADDRESS = '0x80680813A9B99d550eD5F815aA451f137A736Bd6';
export const NIMBUS_TOKEN_ADDRESS = '0x6Bbe2559Ea2fbB1634e343AabfFA6E5bAE2d9229';  
export const COLLATERAL_NIMBUS_TOKEN_ADDRESS = '0xF312CAD90A6943b9718d3E73d0bf6f9D4b497f35';  

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
