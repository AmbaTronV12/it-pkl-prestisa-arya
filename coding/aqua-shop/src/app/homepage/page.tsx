"use client"
import React, { useState, useEffect } from 'react';
import styles from './css/home.module.css'
import { Navbar } from '@/component';
import { heroImage, calebImage, zacImage, cartProductIcon } from '@/public/assets';
import Image from 'next/image';

interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: {
    primary: string;
    hover: string;
    gallery: string[];
  };
};

const home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product1, setProduct1] = useState<Product | null>(null);
  const [product2, setProduct2] = useState<Product | null>(null);
  const [product3, setProduct3] = useState<Product | null>(null);
  const [product4, setProduct4] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data: Product[] = await response.json();

        // Filter specific products by ID
        const product1Data = data.find((product) => product.product_id === 1) || null;
        const product2Data = data.find((product) => product.product_id === 2) || null;
        const product3Data = data.find((product) => product.product_id === 3) || null;
        const product4Data = data.find((product) => product.product_id === 4) || null;

        setProducts(data); // Store all products
        setProduct1(product1Data); // Set data for product 1
        setProduct2(product2Data); // Set data for product 2
        setProduct3(product3Data); // Set data for product 3
        setProduct4(product4Data); // Set data for product 4
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
          <Image src={calebImage} alt='calebExtra' />
          <div className={styles.extrasImageLine}></div>
        </div>
        <div className={styles.imagesUp}>
          <Image src={zacImage} alt='zacExtra' />
          <div className={styles.extrasImageLine}></div>
        </div>
      </div>
      <div className={styles.extrasText}>
        <p className={styles.extrasTitle}>
          <span className={styles.overflowTitle}>DIVE INTO EXCELLENCE:</span>
          <br />
          EVERYTHING YOU NEED FOR SWIMMING!</p>
        <p className={styles.extrasDesc}>
          At Aqua Shop, we provide top-quality
          swimming gear for everyone—from beginners to pros.
          Our mission is to enhance your swimming
          experience with reliable, stylish, and durable products.
        </p>
      </div>
    </div>
        <div className={styles.newArrival}>
          <div className={styles.newArrivalContent}>
            <h3>NEW ARRIVALS</h3>
            <div className={styles.newArrivalProducts}>

           {product1 && (
                <div className={styles.newArrivalHighlight}>
                  <Image src={product1.product_image.primary} alt={product1.product_name} layout='fill' objectFit='cover' className={styles.primary} />
                  <Image src={product1.product_image.hover} alt={product1.product_name} layout='fill' objectFit='cover' className={styles.hover} />
                  <p className={styles.highlightName}>{product1.product_name}</p>
                </div>
              )}
          <div className={styles.newArrivalOthers}>
            <div className={styles.newArrivalCategory}>
              <div className={styles.category}>
                <p>MEN'S SWIMWEAR</p>
              </div>
              <div className={styles.category}>
                <p>WOMEN'S SWIMWEAR</p>
              </div>
              <div className={styles.category}>
                <p>CHILDREN'S SWIMWEAR</p>
              </div>
            </div>
            <div className={styles.newArrivalOtherProduct}>
            {product2 && (
                <div className={styles.product}>
                  <div className={styles.imageContainer}>
                    <Image src={product2.product_image.primary} alt={product2.product_name} layout='fill' objectFit='cover' className={styles.primary} />
                    <Image src={product2.product_image.hover} alt={product2.product_name} layout='fill' objectFit='cover' className={styles.hover} />
                  </div>
                  <p className={styles.name}>{product2.product_name}</p>
                  <p className={styles.price}>IDR{product2.product_price}</p>
                  <div className={styles.button}>
                    <button>BUY</button>
                    <Image src={cartProductIcon} alt='cart' />
                  </div>
                </div>
              )}
              {product3 && (
                <div className={styles.product}>
                  <div className={styles.imageContainer}>
                    <Image src={product3.product_image.primary} alt={product3.product_name} layout='fill' objectFit='cover' className={styles.primary} />
                    <Image src={product3.product_image.hover} alt={product3.product_name} layout='fill' objectFit='cover' className={styles.hover} />
                  </div>
                  <p className={styles.name}>{product3.product_name}</p>
                  <p className={styles.price}>IDR{product3.product_price}</p>
                  <div className={styles.button}>
                    <button>BUY</button>
                    <Image src={cartProductIcon} alt='cart' />
                  </div>
                </div>
              )}
              {product4 && (
                <div className={styles.product}>
                  <div className={styles.imageContainer}>
                    <Image src={product4.product_image.primary} alt={product4.product_name} layout='fill' objectFit='cover' className={styles.primary} />
                    <Image src={product4.product_image.hover} alt={product4.product_name} layout='fill' objectFit='cover' className={styles.hover} />
                  </div>
                  <p className={styles.name}>{product4.product_name}</p>
                  <p className={styles.price}>IDR{product4.product_price}</p>
                  <div className={styles.button}>
                    <button>BUY</button>
                    <Image src={cartProductIcon} alt='cart' />
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default home