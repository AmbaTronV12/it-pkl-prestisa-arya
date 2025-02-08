"use client";

import React, { useState, useEffect } from "react";
import styles from './profile.module.css';
import { NavbarProfile, Sidebar } from '@/component';
import { useAuth } from '../context/authContext';
import Image from 'next/image';
import { emailIcon, phonebookIcon } from '@/public/assets';

const Profile = () => {
  const { user, login, isLoggedIn } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState(user?.profile_photo || "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    birth_date: user?.birth_date || "",
  });
  const [isLoading, setIsLoading] = useState(true); // New state to handle loading

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch("/api/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
  
          console.log("Fetched profile data:", data);  // Log the response to ensure it's correct
          if (data.user) {
            setProfileData(data.user);  // Ensure you set the profile data correctly
            setIsLoading(false);  // Set loading to false when data is fetched
          } else {
            console.error("User data not found in response:", data);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setIsLoading(false);  // Set loading to false in case of an error
        }
      }
    };
  
    fetchUserProfile();
  }, [isLoggedIn]);

  // Handle file change for photo upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  // Handle profile photo upload
  const handlePhotoUpload = async () => {
    if (!newPhoto) return;

    const formData = new FormData();
    formData.append("profilePhoto", newPhoto);

    setIsUploading(true);

    try {
      const response = await fetch("/api/profile/photo/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPhotoUrl(data.imageUrl); // Update the displayed photo
        setIsEditing(false);
        setNewPhoto(null);

        // Update the user context with the new photo
        login({ ...user!, profile_photo: data.imageUrl }, localStorage.getItem("token") || "");
      } else {
        console.error("Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

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
                  src={photoUrl}
                  alt="profilePhoto"
                  className={styles.profilePhoto}
                  width={239}
                  height={212}
                />
                <h4>{profileData?.username || "User Name"}</h4>
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
                <div className={styles.editButton}>Edit</div>
              </>
            )}
          </div>
          <div className={styles.profile2}></div>
          <div className={styles.profile3}></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
