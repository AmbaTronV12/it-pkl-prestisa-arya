"use client"
import React from "react";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import styles from './navbar.module.css'
import { Logo, seacrhIcon, cartIcon, profileIcon } from "@/public/assets";
import { useRouter } from 'next/navigation';


const navbar = () => {
    const router = useRouter();
    const { isLoggedIn } = useAuth(); 

    console.log('isLoggedIn:', isLoggedIn); // Debug the state

    const profileIconClick = () => {
      if (isLoggedIn) {
        router.push('/profile'); 
      } else {
        router.push('/register');
      }
    }
return(
    <div className={styles.navbar}>
    <Image src={Logo} alt="Logo" className={styles.logo}/>
    <div className={styles.content1}>
    <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
          <Image src={seacrhIcon} alt="search"/>
        </div>
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
      <h2>WOMAN</h2>
      <h2>MAN</h2>
      <h2>KIDS</h2>
      <h2>GOOGLES</h2>
      <h2>SWIMSUIT</h2>
    </div>
    <div className={styles.signupOffer}>
      <p>Sign Up and get 20% off to your first order. <a>Sign Up Now</a></p>
    </div>
   </div>

)
}

export default navbar;
