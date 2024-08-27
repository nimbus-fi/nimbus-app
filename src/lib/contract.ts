import { ethers } from 'ethers'
import LENDING_POOL from '@/lib/abi/LendingPool.json';
import COMMUNITY_UNION from '@/lib/abi/CommunityUnion.json';
import NIMBUS_FINANCE_JSON from '@/lib/abi/NimbusFinance.json';


export const COMMUNITY_UNION_ADDRESS = '0x24CE782a28B95F40b8840e45A6ec9dB35e325e8C';
export const LENDING_POOL_ADDRESS = '0x92589b38d3B5d32318b328B985408babF4379d3F';
export const GOVERNANCE_ADDRESS = '0x63BfB6792B81c307c84948d17E55a8068aFE279F';
export const COLLATERAL_MANAGER_ADDRESS = '0x80680813A9B99d550eD5F815aA451f137A736Bd6';
export const NIMBUS_TOKEN_ADDRESS = '0x7c6aa54Eaeea04Cf8950b1451faF0B21CB6037c2';
export const COLLATERAL_TOKEN_ADDRESS = '0xF312CAD90A6943b9718d3E73d0bf6f9D4b497f35';
export const NIMBUS_FINANCE = '0xe3C1dB3A836727dEfc413cdb8E2ee227981cFbc9';

export const LOAN_CONTRACT = '0x766E384Bcf39b95A922BAd71098533bf652BfA11'

export const USDC_EDUCHAIN ="0x77721D19BDfc67fe8cc46ddaa3cc4C94e6826E3C";
// OwnerWallet = 0xBB79D409D53E7E0bE4E412465dEBee16A7E208f2;


export function getCommunityUnionContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(COMMUNITY_UNION_ADDRESS, COMMUNITY_UNION.abi, provider.getSigner());
}

export function getLendingPoolContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL.abi, provider.getSigner());
}

export function getNimbusFinanceContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(NIMBUS_FINANCE, NIMBUS_FINANCE_JSON.abi, provider.getSigner());
}