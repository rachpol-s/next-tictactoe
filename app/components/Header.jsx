'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-orange-400 text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
        <div className="flex items-center">
          {session ? (
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2"
                style={{ height: '36px' }}
              >
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  className="rounded-full"
                  width={40}
                  height={40}
                />
                <div className="hidden md:flex flex-col">
                  <span className="font-semibold">{session.user.name}</span>
                  <span className="text-sm">{session.user.email}</span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-sm text-center text-gray-500 font-medium rounded-full bg-white hover:bg-gray-200 active:bg-gray-300"
              >
                <p className="text-sm">Logout</p>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 text-sm text-center text-gray-500 font-medium rounded-full bg-white hover:bg-gray-200 active:bg-gray-300"
            >
              <p className="text-sm">Login</p>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
