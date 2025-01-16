import React from 'react'
import styles from './css/home.module.css'
import { Navbar } from '@/component'
import { heroImage, calebImage, zacImage } from '@/public/assets'
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
    <div className={styles.collectionContainer}>
      <h1>OUR COLLECTION</h1>
      <div className={styles.collectionGrid}>
        <div className={styles.collection1}>
          <div className={styles.menCollection}>
            <p>MEN'S SWIMWEAR</p>
          </div>
          <div className={styles.childrenCollection}>
            <p>CHILDREN'S<br /> SWIMWEAR</p>
          </div>
        </div>
        <div className={styles.collection2}>
          <div className={styles.googlesCollection}>
            <p>CRYSTAL VISION GOOGLES</p>
          </div>
          <div className={styles.womenCollection}>
            <p>WOMAN'S<br />SWIMWEAR</p>
          </div>
        </div>
        <div className={styles.sponsor}>
          <h2>SPONSOR</h2>
          <div className={styles.sponsorProfile}>
            <div>
            <h4>CAELEB DRESSEL</h4>
            <p>SWIMMING ATHLETE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className={styles.extras}>
    <div className={styles.overflowTop}>
    <div className={styles.extrasImage}>
    <div className={styles.imagesDown}>
      <Image src={calebImage} alt='calebExtra'/>
      <div className={styles.extrasImageLine}></div>
    </div>
    <div className={styles.imagesUp}>
      <Image src={zacImage} alt='zacExtra'/>
      <div className={styles.extrasImageLine}></div>
    </div>
    </div>
    <div className={styles.extrasText}>
      <p className={styles.extrasTitle}>
        <span className={styles.overflowTitle}>DIVE INTO EXCELLENCE:</span>
        <br/>
        EVERYTHING YOU NEED FOR SWIMMING!</p>
      <p className={styles.extrasDesc}>
        At Aqua Shop, we provide top-quality 
        swimming gear for everyone—from beginners to pros. 
        Our mission is to enhance your swimming 
        experience with reliable, stylish, and durable products.
        </p>
    </div>
    </div>
  </div>
</div>
)
}


export default home