import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { BsArrowRight } from 'react-icons/bs'
import AssetsTable from '@/components/assets';

export default function Home() {
  return (
    <main className=" items-center p-32 my-10">
      <div className="hero-content text-black text-center">
        <div className="w-max">
          <div className="mb-5 text-5xl font-serif font-bold">Hey 👋, Welcome To Nimbus Fi
          </div>
          <div className="mb-5 text-xl">
            A decentralized platform enabling users to form community-based credit unions for lending and borrowing at preferential rates.
          </div>
          <div className='py-5'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-xl ">
                <Link
                  href="/lend">
                  <div className="bg-white p-6 rounded-xl ">
                    <h2 className="text-2xl font-semibold mb-4">For Lenders</h2>
                    <p>Earn competitive interest rates by providing liquidity to the community.</p>
                  </div>
                </Link>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl ">
                <Link
                  href="/borrow">
                  <div className="bg-white p-6 rounded-xl ">
                    <h2 className="text-2xl font-semibold mb-4">For Borrowers</h2>
                    <p>Access loans backed by cryptocurrency assets at favorable rates.</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between px-28 py-16">
        <AssetsTable />
      </div>
    </main>
  )
}
