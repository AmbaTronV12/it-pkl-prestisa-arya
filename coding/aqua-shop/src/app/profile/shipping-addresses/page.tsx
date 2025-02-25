import React, { useEffect, useState } from 'react'
import styles from './shipping.module.css'
import { NavbarProfile, Sidebar } from '@/component'
import { useAuth } from '@/app/context/authContext'

const shippingAddress = () => {
  const { user, isLoggedIn } = useAuth();
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      if (isLoggedIn) {
        try {
          const response = await fetch('/api/profile/shipping', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.length > 0) {
            setShippingAddresses(data);
          } else {
            console.error('No shipping addresses found.');
          }
        } catch (error) {
          console.error('Error fetching shipping addresses:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchShippingAddresses();
  }, [isLoggedIn]);

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

  const handleShippingSave = async () => {
    const filteredShippingData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== '')
    );

    try {
      const response = await fetch('/api/shipping-address/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(filteredShippingData),
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
          <p>Shipping Address</p>

        </div>
      </div>
      
    </div>
  )
}

export default shippingAddress
