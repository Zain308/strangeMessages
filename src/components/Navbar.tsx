"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import type { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

function Navbar() {
  const { data: session } = useSession()
  const user: User | undefined = session?.user as User
  const pathname = usePathname()

  // Don't show navbar on dashboard since it has its own header
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/verify")
  ) {
    return null
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">True Feedback</span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-600 text-sm hidden sm:inline">
                  Welcome, <span className="font-semibold">{user?.username || user?.email}</span>
                </span>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
