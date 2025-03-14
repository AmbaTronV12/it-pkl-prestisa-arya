"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import styles from "./catalog.module.css";
import { Footer, Navbar } from "@/component";
import { catalogCart } from "@/public/assets";
import Image from "next/image";
import { Product } from "@/pages/api/products/filter"; // Import the Product interface
import Link from "next/link";

const categories = {
  Men: ["Aquashort", "Briefs", "Jammer"],
  Women: ["Swimming Costumes", "Rash Vests", "Racing", "Bikini"],
  Children: ["Boy's Swimwear", "Boy's Rash Vests", "Girl's Swimwear", "Girl's Rash Vests"],
  Goggles:["Biofuse", "Fastskin"],
  Accessories: ["Fins", "Pullbuoy", "Paddle", "Kickboard"],
};

const CatalogPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") ?? "";
  const categoryParam = searchParams?.get("category") ?? null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedSubcategory(null); // Reset subcategory when category changes
  }, [categoryParam]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = new URL("/api/products/filter", window.location.origin);
        if (selectedCategory) url.searchParams.append("category", selectedCategory);
        if (selectedSubcategory) url.searchParams.append("subcategory", selectedSubcategory);
        if (searchQuery) url.searchParams.append("search", searchQuery);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.message) {
          setProducts([]);
          setMessage(data.message);
        } else {
          setProducts(data);
          setMessage(null);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when changing category
  
    // ✅ Update the URL dynamically
    const params = new URLSearchParams();
    params.set("category", category); // Add category to URL
    router.push(`/catalog?${params.toString()}`);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.catalog}>
        {/* ✅ Filter Section */}
        <div className={styles.filtercontainer}>
          <h3>FILTER PRODUCT</h3>
          <div className={styles.categorysection}>
            <h4>Category</h4>
            <div className={styles.categorygroup}>
              {Object.entries(categories).map(([category, subcategories]) => (
                <details key={category} open={!!openCategories[category]}>
                  <summary onClick={() => handleCategoryChange(category)}>{category}</summary>
                  {subcategories.map((subcategory) => (
                    <label key={subcategory} className={styles.checkboxcontainer}>
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubcategory === subcategory}
                        onChange={() => handleSubcategoryChange(subcategory)}
                      />
                      {subcategory}
                      <span className={styles.checkmark}></span>
                    </label>
                  ))}
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Product Grid */}
        <div className={styles.productGrid}>
          {message ? (
            <p className={styles.noResults}>{message}</p> // Shows "No products found" message
          ) : (
            products.map((_, index) =>
              index % 3 === 0 ? (
                <div key={index} className={styles.productContainer}>
                  {products.slice(index, index + 3).map((product) => (
                      <Link href={`/product/${product.product_id}`} key={product.product_id} className={styles.productCard}>
                      <div className={styles.imageContainer}>
                        <Image
                          src={product.product_image.primary}
                          alt={product.product_name}
                          layout="fill"
                          objectFit="cover"
                          className={`${styles.primary} ${styles.image}`}
                        />
                        <Image
                          src={product.product_image.hover}
                          alt={product.product_name}
                          layout="fill"
                          objectFit="cover"
                          className={`${styles.hover} ${styles.image}`}
                        />
                      </div>
                      <p className={styles.name}>{product.product_name}</p>
                      <p className={styles.price}>IDR {product.product_price}</p>
                      <div className={styles.button}>
                        <button>BUY</button>
                        <Image src={catalogCart} alt="cart" />
                      </div>
                      </Link>
                  ))}
                </div>
              ) : null
            )
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CatalogPage;
