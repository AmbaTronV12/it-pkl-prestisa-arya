"use client";

import React, { useEffect, useState } from "react";
import styles from "./payment.module.css";
import { NavbarProfile, Sidebar } from "@/component";
import { useAuth } from "@/app/context/authContext";

const PaymentMethod = () => {
const { isLoggedIn } = useAuth();
const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPayment, setNewPayment] = useState({
  card_type: "",
  card_holder: "",
  card_number: "",
  expiration_date: "",
  cvv: "",
  });

  useEffect(() => {
  const fetchPaymentMethod = async () => {
  if (isLoggedIn) {
  try {
  const storedToken  = localStorage.getItem("token");
    if (!storedToken) {
    console.warn("No token found. Redirecting to login...");
    // Redirect user to login page
    window.location.href = "/login";
    return;
    }

  const response = await fetch("/api/profile/payment", {
  headers: {
  Authorization: `Bearer ${storedToken}`,
  },
  });
  const data = await response.json();
  if (response.ok && data) {
  setPaymentMethod(data);
  }
  } catch (error) {
  console.error("Error fetching payment method:", error);
  }
  }
  };
  fetchPaymentMethod();
  }, [isLoggedIn]);

  const formatExpirationDate = (date: string) => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = { month: '2-digit', year: '2-digit' }; // Format month and year
  return dateObj.toLocaleDateString('en-US', options); // Returns date like "10/28"
  };

  const formatCardNumber = (cardNumber: string) => {
  const maskedNumber = cardNumber.slice(-4); // Get only the last 4 digits
  return `•••• •••• •••• ${maskedNumber}`;
  };

  const handleEditClick = () => {
  setIsEditing(true);
  };

  const handleCancelEdit = () => {
  setIsEditing(false);
  };

  const handleAddPayment = async () => {
  if (Object.values(newPayment).some((value) => value.trim() === "")) {
  console.error("Please fill in all fields.");
  return;
  }

  try {
  const response = await fetch("/api/profile/payment/add", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(newPayment),
  });

  if (response.ok) {
  const data = await response.json();
  console.log("Payment method added successfully:", data);
  setPaymentMethod(data.newPayment);
  setIsEditing(false);
  } else {
  console.error("Failed to add payment method");
  }
  } catch (error) {
  console.error("Error adding payment method:", error);
  }
  };

  const handleUpdatePayment = async () => {
  try {
  const response = await fetch("/api/profile/payment/update", {
  method: "PATCH",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(newPayment),
  });

  if (response.ok) {
  console.log("Payment method updated successfully");
  setPaymentMethod(newPayment);
  setIsEditing(false);
  } else {
  console.error("Failed to update payment method");
  }
  } catch (error) {
  console.error("Error updating payment method:", error);
  }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
    };


    return (
    <div className={styles.page}>
      <NavbarProfile />
      <div className={styles.paymentContainer}>
        <Sidebar />
        <div className={styles.paymentMethod}>
          {isEditing ? (
          <div className={styles.formContainer}>
            <p>{paymentMethod ? "Edit Payment Method" : "Add Payment Method"}</p>
            <div className={styles.form1}>
              <div className={styles.editContainer}>
                <span>Card Number</span>
                <div className={styles.inputBar}>
                  <input type="text" name="card_number" value={newPayment.card_number} onChange={handleInputChange}
                    placeholder="Enter card number" />
                </div>
              </div>
              <div className={styles.editContainer}>
                <span>Expiration Date</span>
                <div className={styles.inputBar}>
                  <input type="text" name="expiration_date" value={newPayment.expiration_date}
                    onChange={handleInputChange} placeholder="MM/YY" />
                </div>
              </div>
            </div>
            <div className={styles.form2}>
              <div className={styles.editContainer}>
                <span>Card Holder Name</span>
                <div className={styles.inputBar}>
                  <input type="text" name="card_holder" value={newPayment.card_holder} onChange={handleInputChange}
                    placeholder="Enter card holder name" />
                </div>
              </div>
              <div className={styles.editContainer}>
                <span>CVV</span>
                <div className={styles.inputBar}>
                  <input type="text" name="cvv" value={newPayment.cvv} onChange={handleInputChange} placeholder="CVV" />
                </div>
              </div>
            </div>
            <div className={styles.editContainer}>
              <span>Card Type</span>
              <select name="card_type" value={newPayment.card_type} onChange={handleInputChange} className={styles.inputBar}>
                <option value="">Select Card Type</option>
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
              </select>
            </div>
            <div className={styles.editButton} onClick={paymentMethod ? handleUpdatePayment : handleAddPayment}>
              {paymentMethod ? "Update Payment" : "Save Payment"}
            </div>
            <div className={styles.cancel} onClick={handleCancelEdit}>
        Cancel
      </div>
          </div>
          ) : (
          <div className={styles.detailsContainer}>
            {paymentMethod ? (
            <div className={styles.dataWrapper}>
              <p>Payment Method</p>
              <div className={styles.dataContainer}>
                <span className={styles.label}>Card Type</span>
                <span className={styles.value}>{paymentMethod.card_type || "N/A"}</span>
              </div>
              <div className={styles.dataContainer}>
                <span className={styles.label}>Cardholder Name</span>
                <span className={styles.value}>{paymentMethod.card_holder || "N/A"}</span>
              </div>
              <div className={styles.dataContainer}>
                <span className={styles.label}>Card Number</span>
                <span className={styles.value}>
                  {paymentMethod.card_number ? formatCardNumber(paymentMethod.card_number) : "N/A"}
                </span>
              </div>
              <div className={styles.dataContainer}>
                <span className={styles.label}>Expiration Date</span>
                <span className={styles.value}>{formatExpirationDate(paymentMethod.expiration_date || "N/A")}</span>
              </div>
              <div className={styles.editButton} onClick={handleEditClick}>
                <span>Edit Address</span>
              </div>
            </div>
            ) : (
            <div className={styles.noPayment} onClick={handleCancelEdit}>
              <p>No payment method added.</p>
              <button>Add Payment</button>
            </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
    );
    };

    export default PaymentMethod;