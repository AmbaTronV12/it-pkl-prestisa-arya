import React from 'react'
import styles from './css/home.module.css'
import { Navbar } from '@/component'
import { heroImage } from '@/public/assets'
import Image from 'next/image'

const home = () => {
return (
<div className={styles.page}>
  <Navbar></Navbar>
  <div className={styles.hero}>
    <Image src={heroImage} alt='hero' />
    <div className={styles.heroText}>
      <h1>DIVE INTO EXCELLENCE</h1>
      <h2>SHOP NOW</h2>
    </div>
  </div>
  <div className={styles.collection}>
    <h1>OUR COLLECTION</h1>
    <div className={styles.collectionGrid}>
      <div className={styles.collection1}>
        <div className={styles.menCollection}></div>
        <div className={styles.childrenCollection}></div>
      </div>
      <div className={styles.collection2}>
        <div className={styles.googlesCollection}>
        </div>
        <div className={styles.womenCollection}></div>
      </div>
      <div className={styles.sponsor}>
        <div></div>
      </div>
    </div>
  </div>
</div>
)
}


export default home