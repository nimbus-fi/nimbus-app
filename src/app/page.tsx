import Image from 'next/image'
import Head from 'next/head'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Head>
          <title>Nimbus Fi - Decentralized Lending Platform</title>
          <meta name="description" content="Community-based credit unions for DeFi lending and borrowing" />
        </Head>

        <h1 className="text-4xl font-bold mb-6">Welcome to Nimbus Fi</h1>
        <p className="text-xl mb-4">
          A decentralized platform enabling users to form community-based credit unions for lending and borrowing at preferential rates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">For Lenders</h2>
            <p>Earn competitive interest rates by providing liquidity to the community.</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">For Borrowers</h2>
            <p>Access loans backed by cryptocurrency assets at favorable rates.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
