"use client"

import React, { useEffect, useState } from "react";
import styles from './order.module.css'
import Image from "next/image";
import { NavbarProfile, Sidebar } from "@/component";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";

interface OrderType {
    order_id: number;
    product_id: number;
    product_name: string;
    product_image: string;
    category: string;
    total_price: number;
    quantity: number;
    order_date: string;
  }
  

const orderPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const storedToken  = localStorage.getItem("token");
            if (!storedToken) {
                console.warn("No token found. Redirecting to login...");
                // Redirect user to login page
                window.location.href = "/login";
                return;
              }
    
            const res = await fetch("/api/orders", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${storedToken }`,
              },
            });
    
            if (!res.ok) throw new Error("Failed to fetch orders");
    
            const data = await res.json();
            setOrders(data.orders); // Ensure you're accessing `orders` key
          } catch (error) {
            console.error("Error fetching orders:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchOrders();
      }, []);
    
      if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.page}>
            <NavbarProfile/>
            <div className={styles.containerProfile}>
                <Sidebar/>
                <div className={styles.order}>
                    <p className={styles.title}>Order</p>
                {orders.length === 0 ? (
                    <div className={styles.orderContainer}>
                        <p className={styles.empty}>You haven't order yet!</p>
                        <Link href='/catalog' className={styles.button}>Shop Now!</Link>
                    </div>
      ) : (
        <div className={styles.orderContainer}>
          {orders.map((order: any) => (
            <div key={order.order_id} className={styles.orderData}>
              <Image src={order.product_image} alt={order.product_name} width={166} height={162} layout="responsive" />
              <div className={styles.productInfo}>
                <h3>{order.product_name}</h3>
                <p>Category: {order.category}</p>
                <p>Total Price: IDR{order.total_price}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <div  className={styles.countdown}>
                <OrderCountdown key={order.order_id} orderDate={order.order_date}></OrderCountdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
                </div>
            </div>
        </div>
    )
}


const OrderCountdown = ({ orderDate }: { orderDate: string }) => {
    const [timeLeft, setTimeLeft] = useState("");
  
    useEffect(() => {
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 7); // Add 7 days for delivery
  
      const updateCountdown = () => {
        const now = new Date();
        const difference = deliveryDate.getTime() - now.getTime();
  
        if (difference <= 0) {
          setTimeLeft("Delivered");
          return;
        }
  
        const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24)); // Get remaining days
        setTimeLeft(`${daysLeft} day${daysLeft > 1 ? "s" : ""} left`);
      };
  
      updateCountdown(); // Initial call
      const interval = setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour
  
      return () => clearInterval(interval);
    }, [orderDate]);
  
    return <div>📦 {timeLeft}</div>;
  };

export default orderPage