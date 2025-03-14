"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import styles from "./navbar.module.css";
import { Logo, seacrhIcon, cartIcon, profileIcon, successIcon } from "@/public/assets";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductType {
  product_id: number;
  product_name: string;
  product_image: {
    primary: string;
    hover: string;
    gallery: string[];
  };
  total_price: number;
  quantity: number;
}

const DELIVERY_FEE = 50000; // Fixed delivery fee

const Navbar = () => {
  
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, user } = useAuth(); // Auth context
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cartData, setCartData] = useState([]);



  console.log("Stored Cart Data:", JSON.parse(localStorage.getItem("cart") || "[]"));

  const handleConfirmPurchase = async () => {
    if (!isLoggedIn) {
      alert("You need to log in to proceed with the purchase.");
      return;
    }
  
    if (!user || !user.user_id) {  
      alert("User data is missing. Please log in again.");
      console.error("User Data:", user);
      return;
    }
  
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  
    try {
      for (const item of cartItems) {
        const orderData = {
          user_id: user.user_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image.primary,
          category: item.category,
          quantity: item.quantity,
          total_price:
            (parseInt(String(item.total_price).replace(/\./g, ""), 10) || 0) * item.quantity + DELIVERY_FEE,
        };
  
        console.log("Order Data being sent:", orderData);
  
        const response = await fetch("/api/orders/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
  
        const responseData = await response.json();
        console.log("Server Response:", responseData);
  
        if (!response.ok) {
          alert(`Error: ${responseData.message}`);
          return;
        }
      }
  
      setPaymentSuccess(true);
      alert("All orders placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
  
      setTimeout(() => {
        setShowCheckout(false);
        setPaymentSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log("Stored Cart Data:", storedCart);
      setCartData(storedCart);
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Toggle cart popup
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
    if (!isCartOpen) setShowCheckout(false); // Close checkout when cart opens
  };

  const openCheckout = () => {
    setShowCheckout(true);
    setIsCartOpen(false); // Close cart when checkout opens
  };

  const closeCheckout = () => {
    setShowCheckout(false);
  };

  // ✅ Remove item from cart
  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/catalog?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // Handle profile icon click
  const handleProfileClick = () => {
    router.push(isLoggedIn ? "/profile" : "/register");
  };

  console.log('isLoggedIn: '+isLoggedIn);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.total_price, 0);
  const finalTotal = totalPrice + DELIVERY_FEE;

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <Link href="/homepage">
        <Image src={Logo} alt="Logo" className={styles.logo} priority />
      </Link>

      {/* Search Bar & Icons */}
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
            <Image src={cartIcon} alt="Cart" onClick={toggleCart}/>
          </div>
          <div className={styles.Icon} onClick={handleProfileClick}>
            <Image src={profileIcon} alt="Profile" />
          </div>
        </div>
      </div>

      {/* Category Links */}
      <div className={styles.links}>
        <Link href="/catalog?category=Women">WOMEN</Link>
        <Link href="/catalog?category=Men">MEN</Link>
        <Link href="/catalog?category=Children">KIDS</Link>
        <Link href="/catalog?category=Goggles">GOGGLES</Link>
        <Link href="/catalog?category=Accessories">ACCESSORIES</Link>
      </div>

      {/* Signup Offer */}
      <div className={styles.signupOffer}>
        <p>
          Sign Up and get 20% off your first order.{" "}
          <Link href="/register">Sign Up Now</Link>
        </p>
      </div>
      {isCartOpen && (
  <div className={styles.cartpopup}>
    <div className={styles.headertable}>
      <h3>My Cart</h3>
      <span className={styles.closeBtn} onClick={toggleCart}>X</span>
    </div>
    <table className={styles.cartTable}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  {cartItems.length > 0 ? (
    cartItems.map((item, index) => (
      <tr key={index}>
        <td className={styles.imageandname}>
          <div className={styles.wrapper}>
            <Image
              src={item.product_image.primary}
              alt={item.product_name}
              width={68}
              height={68}
              layout="responsive"
            />
            <div>
              <p>{item.product_name}</p>
              <p>{item.category}</p>
            </div>
          </div>
        </td>
        <td className={styles.data}>{item.selectedSize}</td>
        <td className={styles.data}>IDR {item.product_price}</td>
        <td className={styles.data}>{item.quantity}</td>
        <td className={styles.data}>IDR {new Intl.NumberFormat("id-ID").format(item.total_price)}</td>
        <td className={styles.data}>
          <button onClick={() => handleRemoveItem(index)}>✖</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className={styles.emptyCart}>Your cart is empty.</td>
    </tr>
  )}
</tbody>

    </table>
    <button className={styles.checkoutbtn} onClick={openCheckout}>Checkout</button>
  </div>
)}

     {/* Checkout Popup */}
     {showCheckout && (
  <div className={styles.checkoutOverlay} onClick={() => setShowCheckout(false)}>
    <div className={styles.checkoutPopup} onClick={(e) => e.stopPropagation()}>
      {paymentSuccess ? (
        <div>
          <h3 className={styles.title}>PAYMENT SUCCESSFUL</h3>
          <p className={styles.borderbottom2}>YOUR ORDER HAS BEEN PLACED</p>
          <Image src={successIcon} alt="Success" />
          <p className={styles.summary}>ORDER SUMMARY</p>
          {cartItems.map((item) => (
            <div key={item.product_id} className={styles.orderSummary}>
              <span>{item.product_name}</span>
              <span>
                IDR {((parseInt(item.product_price.replace(/\./g, ""), 10) || 0) * item.quantity).toLocaleString("id-ID")}
              </span>
            </div>
          ))}

          <div className={styles.details}>
            <div className={styles.dataContainer}>
              <span>TOTAL ITEMS:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className={styles.dataContainer}>
              <span>DELIVERY:</span>
              <span>IDR {DELIVERY_FEE}</span>
            </div>
            <div className={styles.dataContainer}>
              <span>TOTAL:</span>
              <span>
                IDR {(
                  cartItems.reduce((total, item) => total + (parseInt(item.product_price.replace(/\./g, ""), 10) || 0) * item.quantity, 0) + DELIVERY_FEE
                ).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button onClick={() => setShowCheckout(false)} className={styles.button}>
            CLOSE
          </button>
        </div>
      ) : (
        <div>
          <h3 className={styles.title}>TOTAL AMOUNT</h3>
          <h2 className={styles.total}>
            IDR {(
              cartItems.reduce((total, item) => total + (parseInt(item.product_price.replace(/\./g, ""), 10) || 0) * item.quantity, 0) + DELIVERY_FEE
            ).toLocaleString("id-ID")}
          </h2>
          <p className={styles.borderbottom}>PAYMENT SECURE</p>

          <p className={styles.summary}>ORDER SUMMARY</p>
          {cartItems.map((item) => (
            <div key={item.product_id} className={styles.orderSummary}>
              <span>{item.product_name}</span>
              <span>
                IDR {((parseInt(item.product_price.replace(/\./g, ""), 10) || 0) * item.quantity).toLocaleString("id-ID")}
              </span>
            </div>
          ))}

          <div className={styles.details}>
            <div className={styles.dataContainer}>
              <span>TOTAL ITEMS:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className={styles.dataContainer}>
              <span className={styles.label}>SUBTOTAL:</span>
              <span className={styles.value}>IDR {(
                  cartItems.reduce((total, item) => total + (parseInt(item.product_price.replace(/\./g, ""), 10) || 0) * item.quantity, 0)).toLocaleString("id-ID")}
              </span>
            </div>
            <div className={styles.dataContainer}>
              <span>DELIVERY:</span>
              <span>IDR {DELIVERY_FEE}</span>
            </div>
            <div className={styles.dataContainer}>
              <span>TOTAL PAYMENT:</span>
              <span>
                IDR {(
                  cartItems.reduce((total, item) => total + (parseInt(item.product_price.replace(/\./g, ""), 10) || 0) * item.quantity, 0) + DELIVERY_FEE
                ).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button className={styles.checkoutButton} onClick={handleConfirmPurchase}>
            CONFIRM CHECKOUT
          </button>
        </div>
      )}
    </div>
  </div>
)}


    </nav>
  );
};

export default Navbar;
