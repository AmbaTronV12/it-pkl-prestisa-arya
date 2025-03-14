"use client"
import React, { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import styles from './navbar.module.css'
import { Logo, seacrhIcon, cartIcon, profileIcon } from "@/public/assets";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const navbar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoggedIn } = useAuth(); 

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
          router.push(`/catalog?search=${encodeURIComponent(trimmedQuery)}`);
        }
      };

    const profileIconClick = () => {
      if (isLoggedIn) {
        router.push('/profile'); 
      } else {
        router.push('/register');
      }
    }
return(
    <nav className={styles.navbar}>
    <Link href="/homepage">
        <Image src={Logo} alt="Logo" className={styles.logo} priority />
    </Link>
    <div className={styles.content1}> 
      <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search Products"
          />
          <button type="submit" aria-label="Search">
            <Image src={seacrhIcon} alt="Search" />
          </button>
        </form>
        <div className={styles.iconWrapper}>
          <div className={styles.Icon}>
            <Image src={cartIcon} alt="cart"/>
          </div>
          <div className={styles.Icon}>
            <Image src={profileIcon} alt="profile" onClick={profileIconClick}/>
          </div>
        </div>
    </div>
    <div className={styles.links}>
    <Link href="/catalog?category=Women">WOMEN</Link>
    <Link href="/catalog?category=Men">MEN</Link>
    <Link href="/catalog?category=Children">KIDS</Link>
    <Link href="/catalog?category=Goggles">GOGGLES</Link>
    <Link href="/catalog?category=Accessories">ACCESSORIES</Link>
    </div>
    <div className={styles.lineSpilter}></div>
   </nav>

)
}

export default navbar;
