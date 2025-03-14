"use client";

import React, { useState, useEffect } from "react";
import styles from './profile.module.css';
import { NavbarProfile, Sidebar } from '@/component';
import Link from "next/link";
import { useAuth } from '../context/authContext';
import Image from 'next/image';
import { emailIcon, phonebookIcon, cardIcon, cardIcon2 } from '@/public/assets';

const Profile = () => {
  const { user, login, isLoggedIn } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState(user?.profile_photo?.startsWith("/uploads/")
  ? user.profile_photo:"https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg");;
  const [isLoading, setIsLoading] = useState(true); // New state to handle loading

  // Fetch user profile data
  useEffect(() => {
        const fetchUserProfile = async () => {
          setIsLoading(true); // Ensure loading starts
          
          const storedToken = localStorage.getItem("token");
        
          if (!storedToken) {
            console.warn("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
          }
        
          try {
            const response = await fetch("/api/profile", {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });
        
            if (!response.ok) {
              throw new Error("Failed to fetch user profile.");
            }
        
            const data = await response.json();
        
            if (!data || typeof data !== "object") {
              throw new Error("Invalid response data.");
            }
        
            console.log("Fetched user profile:", data); // Debugging log ✅
        
            setProfileData(data); // ✅ Fix here
        
          } catch (error) {
            console.error("Error fetching profile:", error);
          } finally {
            setIsLoading(false); // Stop loading
          }
        };
        
      
        fetchUserProfile();
      }, [isLoggedIn]);

  useEffect(() => {
    const fetchShippingAddresses = async () => {
      const storedToken = localStorage.getItem("token");
    
      if (!storedToken) {
        console.warn("No token found. Redirecting to login...");
        window.location.href = "/login"; // Redirect user to login page
        return;
      }
    
      if (!isLoggedIn) return; // Prevent unnecessary API calls if not logged in
    
      try {
        setIsLoading(true); // Set loading state before making request
    
        const response = await fetch("/api/profile/shipping", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch shipping addresses.");
        }
    
        if (Array.isArray(data) && data.length > 0) {
          setShippingAddresses(data);
        } else {
          console.warn("No shipping addresses found.");
          setShippingAddresses([]); // Ensure state is updated
        }
      } catch (error) {
        console.error("Error fetching shipping addresses:", error);
      } finally {
        setIsLoading(false); // Ensure loading state is turned off
      }
    };
    fetchShippingAddresses();
  }, [isLoggedIn]);
  
  useEffect(() => {
    const fetchPaymentMethod = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch("/api/profile/payment", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          console.log("Fetched payment method:", data);  // Log the fetched data
  
          if (response.ok) {
            setPaymentMethod(data);
          } else {
            console.error("Failed to fetch payment method");
            setPaymentMethod(null);
          }
        } catch (error) {
          console.error("Error fetching payment method:", error);
          setPaymentMethod(null);  // Set to null in case of error
        }
      }
    };
  
    fetchPaymentMethod();
  }, [isLoggedIn]);

//  const storedPhoto = localStorage.getItem("profile_photo");
const profilePhotoUrl = profileData?.profile_photo 
? (profileData.profile_photo.startsWith("/") 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${profileData.profile_photo}`
    : profileData.profile_photo
  ) 
: "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  const getCardLogo = (cardType: string | null | undefined) => {
    if (!cardType) return cardIcon; // Return a default icon if cardType is null or undefined
    
    const normalizedCardType = cardType.toLowerCase().replace(/\s+/g, ''); // Normalize the card type string
    
    if (normalizedCardType.includes("visa")) return cardIcon2;  // Return the Visa icon
    if (normalizedCardType.includes("master")) return cardIcon; // Return the MasterCard icon
  
    return cardIcon; // Default fallback icon if the card type doesn't match known types
  };

  const formatCardNumber = (cardNumber: string) => {
    const maskedNumber = cardNumber.slice(-4); // Get only the last 4 digits
    return `•••• •••• •••• ${maskedNumber}`;
  };
  
  const formatExpirationDate = (date: string) => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: '2-digit', year: '2-digit' }; // Format month and year
    return dateObj.toLocaleDateString('en-US', options); // Returns date like "10/28"
  };

  // Handle profile photo upload
  
  console.log(getCardLogo(paymentMethod?.card_type));  // Check what URL is being returned
  return (
    <div className={styles.page}>
      <NavbarProfile />
      <div className={styles.containerProfile}>
        <Sidebar />
        <div className={styles.profileGrid}>
          <div className={styles.profile1}>
            {isLoading ? (
              <p>Loading profile...</p>
            ) : (
              <>
                <Image
                  src={profilePhotoUrl}
                  alt="profilePhoto"
                  className={styles.profilePhoto}
                  width={239}
                  height={212}
                />
                <h4>{profileData?.username || "N/A"}</h4>
                <div>
                <div className={styles.profileIcon}>
                  <Image src={emailIcon} alt="email" />
                  <p>{profileData?.email || "N/A"}</p>
                </div>
                <div className={styles.profileIcon}>
                  <Image src={phonebookIcon} alt="phone" />
                  <p>{profileData?.phone_number || "N/A"}</p>
                </div>
                </div>
                
                <div className={styles.editButton}><Link href={"/profile/account-detail"}>Edit</Link></div>
                
              </>
            )}
          </div>
          <div className={styles.profile2}>
            <div className={styles.accountData}>
              <div className={styles.dataWrapper}>
              <p>Account Data</p>
              <div className={styles.wrapperAdjuster1}>
              <div className={styles.dataContainer}>
                <span className={styles.label}>Username</span>
                <span className={styles.value}>{profileData?.username || "N/A"}</span>
              </div>
              <div className={styles.dataContainer}>
                <span className={styles.label}>Birth Date</span>
                <span className={styles.value}>{profileData?.birth_date ? new Date(profileData.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</span>
              </div>
              </div>
              </div>
              <div className={styles.editButton}><Link href={"/profile/account-detail"}>Edit</Link></div>
            </div>
            <div className={styles.shippingAddress}>
              <div className={styles.dataWrapper}>
                <p>Shipping Address</p>
                {shippingAddresses.length > 0 ? (
                <div className={styles.wrapperAdjuster2}>
                   {shippingAddresses.map((address, index) => (
                    <div key={index} className={styles.adjuster}>
                      <div className={styles.dataContainer}>
                        <span className={styles.label}>Address</span>
                        <span className={styles.value}>{address.street_name || "N/A"}</span>
                      </div>
                      <div className={styles.dataContainer}>
                        <span className={styles.label}>City</span>
                        <span className={styles.value}>{address.city || "N/A"}</span>
                      </div>
                      <div className={styles.dataContainer}>
                        <span className={styles.label}>State</span>
                        <span className={styles.value}>{address.state || "N/A"}</span>
                      </div>
                      <div className={styles.dataContainer}>
                        <span className={styles.label}>Country</span>
                        <span className={styles.value}>{address.country || "N/A"}</span>
                      </div>
                      <div className={styles.dataContainer}>
                        <span className={styles.label}>Zip Code</span>
                        <span className={styles.value}>{address.zip_code || "N/A"}</span>
                      </div>
                    </div>

                   ))}
                </div>
                ):(
                  <p>No shipping addresses found.</p>
                )}
              </div>
              <div className={styles.editButton}><Link href={"/profile/shipping-addresses"}>Edit</Link></div>
            </div>
          </div>
          <div className={styles.profile3}>
            <div className={styles.paymentMethod}>
              <div className={styles.dataWrapper}>
                <p>Payment Method</p>
                
                {paymentMethod ? (
                  <div
                  className={`${styles.cardImage} ${paymentMethod?.card_type?.toLowerCase().includes('visa') ? styles.visa : styles.master}`}
                > 
                  <div className={styles.cardContainer}>
                  <p> {paymentMethod?.card_number ? formatCardNumber(paymentMethod?.card_number) : "N/A"}</p>
                  
                  <div className={styles.cardInfo}>
                    <div className={styles.cardData}>
                      <span className={styles.datalabel}>Card Holder Name</span>
                      <span className={styles.data}>{paymentMethod?.card_holder || "N/A"}</span>
                    </div>
                    <div className={styles.cardData}>
                      <span className={styles.datalabel}>Expired Date</span>
                      <span className={styles.data}>{formatExpirationDate(paymentMethod?.expiration_date || "N/A")}</span>
                    </div>
                  </div>
                  </div>
                </div>
                 ) : paymentMethod === null ? (
                  <p>No payment method found.</p>
                ) : (
                  <p>Loading payment method...</p>
                )}
                
              </div>
            </div>
            <div className={styles.paymentMethod2}>
              <div className={styles.wrapperAdjuster3}>
                <div className={styles.dataContainer}>
                  <span className={styles.label}>Card Type</span>
                  <span className={styles.value}>{paymentMethod?.card_type || "N/A"}</span>
                </div>
                <div className={styles.dataContainer}>
                  <span className={styles.label}>Card Holder</span>
                  <span className={styles.value}>{paymentMethod?.card_holder || "N/A"}</span>
                </div>
                <div className={styles.dataContainer}>
                  <span className={styles.label}>Expire</span>
                  <span className={styles.value}>{formatExpirationDate(paymentMethod?.expiration_date || "N/A")}</span>
                </div>
                <div className={styles.dataContainer}>
                  <span className={styles.label}>Card Holder</span>
                  <span className={styles.value}>{paymentMethod?.card_holder || "N/A"}</span>
                </div>
                <div className={styles.dataContainer}>
                  <span className={styles.label}>Card Number</span>
                  <span className={styles.value}> {paymentMethod?.card_number ? formatCardNumber(paymentMethod?.card_number) : "N/A"}</span>
                </div>
              </div>
              <div className={styles.editButton}><Link href={"/profile/payment-method"}>Edit</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
