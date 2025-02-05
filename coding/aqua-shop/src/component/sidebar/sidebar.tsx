"use client";

import React from 'react';
import styles from './sidebar.module.css';
import Link from "next/link";
import { useAuth } from '@/app/context/authContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.linkContainer}>
        <div className={styles.navLinks}>
          <Link href="/profile" className={styles.navLink}>
            Account Home
          </Link>
          <Link href="/profile/shipping-addresses" className={styles.navLink}>
            Order
          </Link>
        </div>
        <Link href="/" className={styles.logOut} onClick={handleLogout}>
          Log Out
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
