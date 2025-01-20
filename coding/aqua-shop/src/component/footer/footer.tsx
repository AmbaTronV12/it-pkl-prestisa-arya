import React from 'react'
import Image from "next/image";
import { VisaIcon, MasterIcon, PaypalIcon } from '@/public/assets';
import styles from './footer.module.css'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLink}>
            <p>HELP & INFORMATION</p>
            <a href='#'>Contact Us</a>
            <a href='#'>Return</a>
        </div>
        <div className={styles.footerLink}>
            <p>ABOUT COMPANY</p>
            <a href='#'>About Us</a>
            <a href='#'>Our Commitment</a>
        </div>
        <div className={styles.footerLink}>
            <p>PRODUCT</p>
            <a href="#">Man</a>
            <a href="#">Woman</a>
            <a href="#">Children</a>
            <a href="#">Swimming Equipment</a>
        </div>
        <div className={styles.footerLink}>
            <p>TERM & SERVICE</p>
            <a href='#'>Term & Condition</a>
        </div>
        <div className={styles.footerLink}>
            <p>COMMUNITY</p>
            <a href='#'>Swimming Blog</a>
        </div>
      </div>
      <div className={styles.footerLine}></div>
      <div className={styles.footerPaymentContainer}>
      <p className={styles.footerCopyright}>&copy;Copyright AquaShop.com All rights reserved. All trademarks acknowledged.</p>
      <div className={styles.footerPaymentDisplay}>
        <p>PAY SECURELY WITH</p>
        <div className={styles.paymentLogo}>
            <Image src={VisaIcon} alt='visa'/>
            <Image src={MasterIcon} alt='mastercard'/>
            <Image src={PaypalIcon} alt='paypal' className={styles.paypal}/>
        </div>
      </div>
        </div>
    </div>
  )
}

export default Footer;