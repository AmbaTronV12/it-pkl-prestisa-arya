"use client"

import React, { useEffect, useState } from 'react'
import styles from './shipping.module.css'
import { NavbarProfile, Sidebar } from '@/component'
import { useAuth } from '@/app/context/authContext'

const shippingAddress = () => {
  const { user, isLoggedIn } = useAuth();
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    street_name: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
  });
  

  // Form data for editing
  const [formData, setFormData] = useState({
    street_name: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
  });

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
    

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await fetch('/api/profile/shipping/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ addressId }),
      });
  
      if (response.ok) {
        console.log('Shipping address deleted successfully');
        setShippingAddresses(shippingAddresses.filter(address => address.id !== addressId));
      } else {
        console.error('Failed to delete shipping address');
      }
    } catch (error) {
      console.error('Error deleting shipping address:', error);
    }
  };

  const handleAddNewAddress = async () => {
    const isFormComplete = Object.values(newAddress).every(value => value.trim() !== '');
  
    if (!isFormComplete) {
      console.error('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('/api/profile/shipping/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAddress),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('New shipping address added successfully:', data);
        setShippingAddresses([...shippingAddresses, data.newAddress]);
        setNewAddress({
          street_name: '',
          city: '',
          state: '',
          country: '',
          zip_code: '',
        }); // Clear form after submission
      } else {
        console.error('Failed to add new shipping address');
      }
    } catch (error) {
      console.error('Error adding new shipping address:', error);
    }
  };
  
  
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };


  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShippingSave = async (addressId: number) => {
    const filteredShippingData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== '')
    );
  
    try {
      const response = await fetch('/api/profile/shipping/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          addressId: addressId, // Send the address ID
          updates: filteredShippingData, // Send the updated fields
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Shipping address updated successfully:', data);
        setIsEditing(false);
      } else {
        console.error('Failed to update shipping address');
      }
    } catch (error) {
      console.error('Error updating shipping address:', error);
    }
  };
  

  if (isLoading) {
    return <p>Loading...</p>;
  }


  return (
    <div className={styles.page}>
      <NavbarProfile/>
      <div className={styles.shippingContainer}>
        <Sidebar/>
        <div className={styles.shippingAddress}>
        {isAdding ? (
  // ADD ADDRESS FORM (Appears when user clicks "Add Address")
  <div className={styles.addressForm}>
    <p>Add New Address</p>
    <div className={styles.addressWrapper}>
      <div className={styles.address1}>
        <div className={styles.editContainer}>
          <span>Street Name</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter street name" 
              type="text" 
              name="street_name" 
              value={newAddress.street_name} 
              onChange={handleNewAddressChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.address2}>
        <div className={styles.editContainer}>
          <span>Country</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter country" 
              type="text" 
              name="country" 
              value={newAddress.country} 
              onChange={handleNewAddressChange}
            />
          </div>
        </div>
        <div className={styles.editContainer}>
          <span>State</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter state" 
              type="text" 
              name="state" 
              value={newAddress.state} 
              onChange={handleNewAddressChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.address3}>
        <div className={styles.editContainer}>
          <span>City</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter city" 
              type="text" 
              name="city" 
              value={newAddress.city} 
              onChange={handleNewAddressChange}
            />
          </div>
        </div>
        <div className={styles.editContainer}>
          <span>Zip Code</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter zip code" 
              type="text" 
              name="zip_code" 
              value={newAddress.zip_code} 
              onChange={handleNewAddressChange}
            />
          </div>
        </div>
      </div>
    </div>
      <div className={styles.editButton} onClick={handleAddNewAddress}>
        Save Address
      </div>
      <div className={styles.cancel} onClick={() => setIsAdding(false)}>
        Cancel
      </div>
    
  </div>
) : isEditing ? (
  // EDIT ADDRESS FORM (Appears when user clicks "Edit Address")
  <div className={styles.addressForm}>
    <p>Edit Address</p>
    <div className={styles.addressWrapper}>
      <div className={styles.address1}>
        <div className={styles.editContainer}>
          <span>Street Name</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter street name" 
              type="text" 
              name="street_name" 
              value={formData.street_name} 
              onChange={handleShippingChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.address2}>
        <div className={styles.editContainer}>
          <span>Country</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter country" 
              type="text" 
              name="country" 
              value={formData.country} 
              onChange={handleShippingChange}
            />
          </div>
        </div>
        <div className={styles.editContainer}>
          <span>State</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter state" 
              type="text" 
              name="state" 
              value={formData.state} 
              onChange={handleShippingChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.address3}>
        <div className={styles.editContainer}>
          <span>City</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter city" 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleShippingChange}
            />
          </div>
        </div>
        <div className={styles.editContainer}>
          <span>Zip Code</span>
          <div className={styles.inputBar}>
            <input 
              placeholder="Enter zip code" 
              type="text" 
              name="zip_code" 
              value={formData.zip_code} 
              onChange={handleShippingChange}
            />
          </div>
        </div>
      </div>
    </div>
    
      {shippingAddresses.map((address) => (
        <div key={address.address_id} className={styles.editButton} onClick={() => handleShippingSave(address.address_id)}>
          Save Address
        </div>
      ))}
      <div className={styles.cancel} onClick={handleCancelEdit}>
        Cancel
      </div>
  
  </div>
) : (
  // SHIPPING ADDRESS LIST (Default view)
  <div className={styles.addressContainer}>
    {shippingAddresses.length === 0 ? (
      <div className={styles.dataWrapper}>
        <p>No shipping addresses found.</p>
        <div className={styles.editButton} onClick={() => setIsAdding(true)}>
          Add Address
        </div>
      </div>
    ) : (
      shippingAddresses.map((address) => (
        <div key={address.address_id} className={styles.dataWrapper}>
          <p>Shipping Address</p>
          <div className={styles.dataContainer}>
            <span className={styles.label}>Address</span>
            <span className={styles.value}>{address.street_name || "N/A"}</span>
          </div>
          <div className={styles.dataContainer}>
            <span className={styles.label}>City</span>
            <span className={styles.value}>{address.city || "N/A"}</span>
          </div>
          <div className={styles.dataContainer}>
            <span className={styles.label}>Country</span>
            <span className={styles.value}>{address.country || "N/A"}</span>
          </div>
          <div className={styles.dataContainer}>
            <span className={styles.label}>State</span>
            <span className={styles.value}>{address.state || "N/A"}</span>
          </div>
          <div className={styles.dataContainer}>
            <span className={styles.label}>Zip Code</span>
            <span className={styles.value}>{address.zip_code || "N/A"}</span>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.editButton} onClick={handleEditClick}>
              <span>Edit Address</span>
            </div>
            <div className={styles.deleteButton} onClick={() => handleDeleteAddress(address.address_id)}>
              <span>Delete Address</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}

        </div>
      </div>
      
    </div>
  )
}

export default shippingAddress
