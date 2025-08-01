'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

// Updated CSS to match premium modern dark navbar
const styles = `
  .navbar {
    background-color: #111827;
    border-bottom: 1px solid #1f2937;
    padding: 1rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.75rem;
    font-weight: 700;
    color: #f9fafb;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .logo:hover {
    color: #38bdf8;
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .welcome-text {
    font-size: 0.95rem;
    color: #d1d5db;
    margin-right: 1rem;
  }

  .nav-button {
    padding: 0.5rem 1.1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }

  .login-button {
    background-color: #0ea5e9;
    color: #fff;
    border: none;
    box-shadow: 0 0 10px rgba(14,165,233,0.4);
  }

  .login-button:hover {
    background-color: #0284c7;
    box-shadow: 0 0 15px rgba(14,165,233,0.6);
  }

  .logout-button {
    background-color: transparent;
    color: #f9fafb;
    border: 1px solid #4b5563;
  }

  .logout-button:hover {
    background-color: #1f2937;
    border-color: #6b7280;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      align-items: flex-start;
    }

    .nav-items {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin-top: 1rem;
    }

    .welcome-text {
      margin: 0 0 0.5rem 0;
    }
  }
`

function Navbar() {
  const { data: session } = useSession()
  const user: User | undefined = session?.user as User

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            Strange Message
          </Link>
          <div className="nav-items">
            {session ? (
              <>
                <span className="welcome-text">
                  Welcome, {user?.username || user?.email}
                </span>
                <Button
                  variant="outline"
                  className="nav-button logout-button"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button className="nav-button login-button">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
