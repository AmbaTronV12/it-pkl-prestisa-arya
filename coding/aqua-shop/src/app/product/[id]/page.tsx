"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./product.module.css";
import { Product } from "@/pages/api/products/filter"; // Import Product interface
import { Footer, Navbar } from "@/component";
import { catalogCart, successIcon } from "@/public/assets";
import { useAuth } from "@/app/context/authContext";


const ProductDetailPage = () => {
  const { isLoggedIn, user } = useAuth(); // ✅ Call useAuth() to get the actual value
  const params = useParams();
  const id = params?.id as string; // ✅ Explicitly cast to string
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const sizes =
  product?.category === "Goggles" || product?.category === "Accessories"
    ? ["One Size"]
    : ["XS", "S", "M", "L", "XL", "XXL"];


  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
  
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  
    const newCartItem = {
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      product_image: {
        primary: product.product_image.primary, // Ensure correct format
        hover: product.product_image.hover,
        gallery: product.product_image.gallery,
      },
      category: product.category,
      total_price:
        (parseInt(String(product.product_price).replace(/\./g, ""), 10) || 0) * quantity + DELIVERY_FEE, 
      selectedSize,
      quantity,
    };
  
    // Check if the product with the same size already exists in the cart
    const existingIndex = cartItems.findIndex(
      (item: any) => item.product_id === product.product_id && item.selectedSize === selectedSize
    );
  
    if (existingIndex !== -1) {
      // If product with same size exists, update the quantity
      cartItems[existingIndex].quantity += quantity;
    } else {
      // Otherwise, add new item
      cartItems.push(newCartItem);
    }
  
    localStorage.setItem("cart", JSON.stringify(cartItems));
  
    alert("Product added to cart!");
  };
  
  const DELIVERY_FEE = 50000; // Fixed delivery fee

  const handleBuy = async () => {
    if (!isLoggedIn) {
      alert("You need to log in to proceed with the purchase.");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size before proceeding.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Or wherever you store it

      const [shippingRes, paymentRes] = await Promise.all([
        fetch("/api/profile/shipping", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/profile/payment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
  
      if (shippingRes.status === 401 || paymentRes.status === 401) {
        alert("Your session has expired. Please log in again.");
        return;
      }
  
      const shippingData = await shippingRes.json();
      const paymentData = await paymentRes.json();
  
      if (!shippingData || shippingData.error) {
        alert("Please add a shipping address before proceeding.");
        return;
      }
  
      if (!paymentData || paymentData.error) {
        alert("Please add a payment method before proceeding.");
        return;
      }
  
      // ✅ Show the confirmation popup
      setShowPopup(true);
    } catch (error) {
      console.error("Error checking checkout requirements:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  const handleConfirmPurchase = async () => {
    if (!isLoggedIn) {
      alert("You need to log in to proceed with the purchase.");
      return;
    }
  
    if (!user || !user.user_id) {  // Ensure user and user_id exist
      alert("User data is missing. Please log in again.");
      console.error("User Data:", user);
      return;
    }
  
    if (!product || !selectedSize) {
      alert("Missing product data or size selection.");
      return;
    }
  
    const orderData = {
      user_id: user.user_id, // Ensure user_id exists
      product_id: product.product_id,
      product_name: product.product_name,
      product_image: product.product_image.primary,
      category: product.category,
      quantity,
      total_price:
        (parseInt(String(product.product_price).replace(/\./g, ""), 10) || 0) * quantity + DELIVERY_FEE, 
    };
  
    console.log("Order Data being sent:", orderData); // 🔍 Debugging
  
    try {
      const response = await fetch("/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const responseData = await response.json();
      console.log("Server Response:", responseData); // 🔍 Debugging
  
      if (response.ok) {
        setPaymentSuccess(true);
        alert("Order placed successfully!");
      } else {
        alert(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  

  useEffect(() => {
    if (!id) return;
  
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
  
        if (!data.error) {
          setProduct(data);
          setSelectedImage(data.product_image.primary); // Set default image
  
          // First, try to get related products by subcategory
          const relatedRes = await fetch(`/api/products/filter?subcategory=${data.subcategory}`);
          const relatedData = await relatedRes.json();
  
          let filteredRelated = Array.isArray(relatedData)
            ? relatedData.filter((p: Product) => p.product_id !== data.product_id)
            : [];
  
          // If no related products by subcategory, fetch by category instead
          if (filteredRelated.length === 0) {
            const categoryRes = await fetch(`/api/products/filter?category=${data.category}`);
            const categoryData = await categoryRes.json();
  
            filteredRelated = Array.isArray(categoryData)
              ? categoryData.filter((p: Product) => p.product_id !== data.product_id)
              : [];
          }
  
          // Limit to 4 related products
          setRelatedProducts(filteredRelated.slice(0, 4));
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
  
    fetchProduct();
  }, [id]);
  

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  if (!product) return <p className={styles.error}>Product not found.</p>;

  return (
    <div className={styles.page}>
      <Navbar/>
      {showPopup && (
  <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      {paymentSuccess ? (
        <div>
          <h3>PAYMENT SUCCESS</h3>
      <p className={styles.borderbottom2}>YOUR PAYMENT IS A SUCCESSFUL WAIT FOR YOUR ITEMS TO ARRIVE</p>
      <Image src={successIcon} alt="payment success" />
      <p className={styles.summary}>ORDER SUMMARY</p>
      <div className={styles.orderSummary}>
        <span>{product.product_name}</span>
        <span>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1)).toLocaleString("id-ID")}</span>
      </div>
      <div className={styles.preview}>
        <Image src={product.product_image.primary} alt="preview" width={156} height={141} layout="responsive" />
        </div>
      <div className={styles.details}>
        <div className={styles.dataContainer}>
            <span className={styles.label}>QTY:</span>
            <span className={styles.value}>{quantity}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>SIZE:</span>
            <span className={styles.value}>{selectedSize}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>SUBTOTAL:</span>
            <span className={styles.value}>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1)).toLocaleString("id-ID")}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>DELIVERY:</span>
            <span className={styles.value}>IDR {DELIVERY_FEE}</span>
        </div>
      </div>
      <div className={styles.dataContainer}>
            <span className={styles.label}>TOTAL:</span>
            <span className={styles.value}>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1) + DELIVERY_FEE).toLocaleString("id-ID")}</span>
        </div>

        </div>
      ) : (
        <div>
        <h3>TOTAL AMOUNT</h3>
      <h2>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1) + DELIVERY_FEE).toLocaleString("id-ID")}</h2>
      <p className={styles.borderbottom}>PAYMENT SECURE</p>
      <p className={styles.summary}>ORDER SUMMARY</p>
      <div className={styles.orderSummary}>
        <span>{product.product_name}</span>
        <span>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1)).toLocaleString("id-ID")}</span>
      </div>
      <div className={styles.preview}>
        <Image src={product.product_image.primary} alt="preview" width={156} height={141} layout="responsive" />
        </div>
      <div className={styles.details}>
        <div className={styles.dataContainer}>
            <span className={styles.label}>QTY:</span>
            <span className={styles.value}>{quantity}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>SIZE:</span>
            <span className={styles.value}>{selectedSize}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>SUBTOTAL:</span>
            <span className={styles.value}>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1)).toLocaleString("id-ID")}</span>
        </div>
        <div className={styles.dataContainer}>
            <span className={styles.label}>DELIVERY:</span>
            <span className={styles.value}>IDR {DELIVERY_FEE}</span>
        </div>
      </div>
      <div className={styles.dataContainer}>
            <span className={styles.label}>TOTAL:</span>
            <span className={styles.value}>IDR {((parseInt(String(product?.product_price).replace(/\./g, ""), 10) || 0) * (quantity || 1) + DELIVERY_FEE).toLocaleString("id-ID")}</span>
        </div>

      <button onClick={handleConfirmPurchase}>BUY</button>
      </div>
      )}
    </div>
  </div>
)}

      <div className={styles.productDetail}>
        <div className={styles.productContainer}>
        {/* ✅ Thumbnail Gallery */}
        <div className={styles.imageProduct}>
        <div className={styles.thumbnailGallery}>
          <Image
            src={product.product_image.primary}
            alt="Primary Image"
            width={65}
            height={65}
            onClick={() => setSelectedImage(product.product_image.primary)}
            className={styles.thumbnail}
          />
          <Image
            src={product.product_image.hover}
            alt="Hover Image"
            width={65}
            height={65}
            onClick={() => setSelectedImage(product.product_image.hover)}
            className={styles.thumbnail}
          />
          {product.product_image.gallery.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Gallery Image ${index + 1}`}
              width={65}
              height={65}
              onClick={() => setSelectedImage(image)}
              className={styles.thumbnail}
            />
          ))}
        </div>

        {/* ✅ Main Image */}
        <div className={styles.mainImage}>
          {selectedImage && (
            <Image src={selectedImage} alt="Selected Product Image" width={500} height={500} />
          )}
        </div>
        </div>
          <div className={styles.dataProduct}>
            <h2>{product.product_name}</h2>
            <span className={styles.price}>IDR{product.product_price}</span>
            <div className={styles.sizeSelector}>
              <p>Size:</p>
              <div className={styles.sizeOptions}>
                {sizes.map((size) => (
                  <button
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.selectedSize : ""}`}
                  onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </div>

          <div className={styles.quantitySelector}>
            <p>Quantity:</p>
            <div className={styles.quantityControls}>
              <button onClick={() => handleQuantityChange(-1)} className={styles.quantityButton}>−</button>
              <span className={styles.quantity}>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className={styles.quantityButton}>+</button>
            </div>
          </div>
          <div className={styles.button}>
              <button onClick={handleBuy}>BUY</button>
              <Image src={catalogCart} alt="cart" onClick={handleAddToCart} />
         </div>
          </div>
        </div>
        <div className={styles.desc}>
          <span>Description</span>
          <p>{product.product_desc}</p>
        </div>
        <div className={styles.relatedProduct}>
        <h2>Other Customers Bought:</h2>
        <div className={styles.productGrid}>
          {relatedProducts.map((related) => (
            <div key={related.product_id} className={styles.productCard} onClick={() => router.push(`/product/${related.product_id}`)}>
              <div className={styles.imageContainer}>
                <Image src={related.product_image.primary} alt={related.product_name} layout="fill" objectFit="cover" className={`${styles.primary} ${styles.image}`} />
                <Image src={related.product_image.hover} alt={related.product_name} layout="fill" objectFit="cover" className={`${styles.hover} ${styles.image}`} />
              </div>
              <p className={styles.name}>{related.product_name}</p>
              <p className={styles.price}>IDR {related.product_price}</p>
              <div className={styles.button}>
                <button>BUY</button>
                <Image src={catalogCart} alt="cart" />
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProductDetailPage;
