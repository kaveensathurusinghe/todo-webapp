'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-icon">✓</span>
          <span>TodoFlow</span>
        </Link>
        <div className="navbar-right">
          {user && (
            <>
              <span className="navbar-user">👤 {user.name}</span>
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
