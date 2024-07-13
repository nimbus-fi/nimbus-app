# 🚀 Nimbus Fi 🚀

## Project Overview

Nimbus Fi is a decentralized finance (DeFi) platform that enables users to form community-based credit unions for lending and borrowing at preferential rates. The platform leverages smart contracts for governance and operations, providing a secure and transparent financial ecosystem.

## Smart Contracts 

| Contract Name                      | Address                                      |
|------------------------------------|----------------------------------------------|
| COMMUNITY_UNION_ADDRESS            | `0x832716905503D1AedCf324765eD3c7c49b65a57e` |
| LENDING_POOL_ADDRESS               | `0x92589b38d3B5d32318b328B985408babF4379d3F` |
| GOVERNANCE_ADDRESS                 | `0xDa2656359decA09E2Bf335CAe988421b2a740ADe` |
| COLLATERAL_MANAGER_ADDRESS         | `0x80680813A9B99d550eD5F815aA451f137A736Bd6` |
| NIMBUS_TOKEN_ADDRESS               | `0x6Bbe2559Ea2fbB1634e343AabfFA6E5bAE2d9229` |
| COLLATERAL_NIMBUS_TOKEN_ADDRESS    | `0xF312CAD90A6943b9718d3E73d0bf6f9D4b497f35` |

## Key Features

1. **Community-Based Credit Unions**
   - Users can join and participate in decentralized credit unions
   - Deposit and withdraw funds within the community pool
   - Earn interest on deposits

2. **Decentralized Governance**
   - Community members can create and vote on proposals
   - Token-weighted voting system
   - Transparent decision-making process

3. **Crypto-Backed Loans**
   - Users can borrow against their cryptocurrency assets
   - Provides liquidity without the need to sell holdings
   - Flexible loan terms and competitive interest rates

4. **Smart Contract-Powered Collateral Management**
   - Automated collateral locking and release
   - Real-time collateral value tracking
   - Liquidation protection mechanisms

## Technical Stack

- **Blockchain**: UBIT Blockchain
- **Smart Contracts**: Solidity
- **Frontend**: Next.js with TypeScript
- **Web3 Integration**: ethers.js and Rainbow Wallet Kit
- **Development Framework**: Hardhat

## Smart Contracts

1. **CommunityUnion**: Manages membership, deposits, and withdrawals
2. **Governance**: Handles proposal creation, voting, and execution
3. **LendingPool**: Manages lending and borrowing operations
4. **CollateralManager**: Handles collateral locking and releasing

## User Interface

The platform features a user-friendly interface with the following pages:

- Home: Overview and navigation
- Community Union: Deposit and withdraw funds
- Governance: Create and vote on proposals
- Lending: Take and repay loans
- Collateral Management: View and manage locked collateral

## Unique Selling Points

1. **Community-Centric Approach**: Empowers users to create and manage their own financial ecosystems
2. **Transparent Governance**: All decisions are made through community voting
3. **Asset Utilization**: Allows users to access liquidity without selling their crypto assets
4. **Preferential Rates**: Community members enjoy better interest rates compared to traditional finance

## Future Enhancements

- Multi-chain support for increased accessibility
- Integration with decentralized exchanges for seamless asset swapping
- Yield farming opportunities within the community pools
- Advanced risk management tools for borrowers and lenders


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
