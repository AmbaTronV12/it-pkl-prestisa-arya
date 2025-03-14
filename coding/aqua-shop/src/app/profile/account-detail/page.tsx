"use client";

import React, { useState, useEffect } from "react";
import styles from './account.module.css'
import Image from "next/image";
import { imageEditIcon, editIcon } from "@/public/assets";
import { NavbarProfile, Sidebar } from '@/component'
import { useAuth } from "../../context/authContext";

const accountDetail = () => {
    const { user, login, isLoggedIn } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const [photoUrl, setPhotoUrl] = useState(
      user?.profile_photo && typeof user.profile_photo === "string" 
        ? user.profile_photo 
        : "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    );      
    const [isEditing, setIsEditing] = useState(false);
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      birth_date: user?.birth_date ? user.birth_date.split("T")[0] : "",
    });
  
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
    
  
  
    if (isLoading) {
      return <p>Loading...</p>;
    }

    const handleEditClick = () => {
      setIsEditing(true);
    };
    
    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    const profilePhotoUrl = profileData?.profile_photo 
  ? (profileData.profile_photo.startsWith("/") 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}${profileData.profile_photo}`
      : profileData.profile_photo
    ) 
  : "https://static.vecteezy.com/system/resources/previews/009/292/244/large_2x/default-avatar-icon-of-social-media-user-vector.jpg";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Typing: ${e.target.name} = ${e.target.value}`);
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
  
    // Save updated profile
    const handleSave = async () => {
      // Filter out empty fields from formData
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => 
          typeof value === "string" ? value.trim() !== "" : value !== null
        )
      );
      
      try {
        const response = await fetch("/api/profile/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("Response from API:", data);
    
          // Only update user data if it's returned from the backend
          if (data.user) {
            login(data.user, localStorage.getItem("token") || "");
          } else {
            console.log("No user data returned from the API");
          }
    
          setIsEditing(false); // Exit edit mode
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };
    

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      setNewPhoto(file);
      console.log("New photo selected:", file);
      
      // Automatically upload after selection
      handlePhotoUpload(file);
    }
  };
    
    // Handle profile photo upload
    const handlePhotoUpload = async (file: File) => {
      if (!file) return;
    
      const formData = new FormData();
      formData.append("profile_photo", file);
    
      setIsUploading(true);
    
      try {
        const response = await fetch("/api/profile/photo/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
          },
          body: formData,
        });
    
        if (response.ok) {
          const data = await response.json();
          setPhotoUrl(data.profilePhotoUrl); // Update displayed photo
          setNewPhoto(null);
    
          // Update user context
          login({ ...user!, profile_photo: data.profilePhotoUrl }, localStorage.getItem("token") || "");
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
      <NavbarProfile/>
      <div className={styles.containerProfile}>
        <Sidebar />
        <div className={styles.accountDetail}>
          {isEditing ? (
            <div className={styles.editing}>
              <p>Edit Account</p>
              <div className={styles.editWrapper}>
              <div className={styles.editContainer}>
              <span>Username</span>
                <div className={styles.inputBar}>
                 <input placeholder="Username" type="text" name="username" value={formData.username} onChange={handleChange}/>
                </div>
              </div>
              <div className={styles.editContainer}>
              <span>Email</span>
                <div className={styles.inputBar}>
                 <input placeholder="Email" type="email" name="email" value={formData.email} onChange={handleChange}/>
                </div>
              </div>
              <div className={styles.editContainer}>
              <span>Phone Number</span>
                <div className={styles.inputBar}>
                 <input placeholder="Phone Number" type="text" name="phone_number" value={formData.phone_number} onChange={handleChange}/>
                </div>
              </div>
              <div className={styles.editContainer}>
              <span>Birth Date</span>
                <div className={styles.inputBar}>
                  <input placeholder="Birth Date" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange}/>
                </div>
              </div>
              <div className={styles.saveButton} onClick={handleSave}>Save Change</div>
              </div>
              <span className={styles.cancel} onClick={handleCancelEdit}>cancel</span>
            </div>
          ) : (
            <div className={styles.accountInfo}>
              <p>Account Detail</p>
            <div className={styles.wrapper}>
            <div className={styles.imageContainer}>
            <Image
                src={profilePhotoUrl}
                alt="profilePhoto"
                className={styles.profilePhoto}
                width={239}
                height={212}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
              id="fileInput"
            />

            <label htmlFor="fileInput" className={styles.imageEdit}>
              <Image src={imageEditIcon} alt="edit"
              />

            </label>
            </div>
          
            <div className={styles.dataContainer}>
              <div className={styles.dataTitle}>
                <span className={styles.label}>Username</span>
                <span className={styles.value}>{profileData?.username || "N/A"}</span>
              </div>
              <Image src={editIcon} alt="editIcon" onClick={handleEditClick}/>
            </div>
            <div className={styles.dataContainer}>
              <div className={styles.dataTitle}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>{profileData?.phone_number || "N/A"}</span>
              </div>
              <Image src={editIcon} alt="editIcon" onClick={handleEditClick}/>
            </div>
            <div className={styles.dataContainer}>
              <div className={styles.dataTitle}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{profileData?.email || "N/A"}</span>
              </div>
              <Image src={editIcon} alt="editIcon" onClick={handleEditClick}/>
            </div>
            <div className={styles.dataContainer}>
              <div className={styles.dataTitle}>
                <span className={styles.label}>Birth Date</span>
                <span className={styles.value}>{profileData?.birth_date 
                  ? new Date(profileData.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                : "N/A"}</span>
              </div>
              <Image src={editIcon} alt="editIcon" onClick={handleEditClick}/>
            </div>
            <div className={styles.dataContainer}>
              <div className={styles.dataTitle}>
                <span className={styles.label}>Pasword</span>
                <span className={styles.value}>*******</span>
              </div>
              <Image src={editIcon} alt="editIcon"/>
            </div>
          </div>
            </div>
          )
            }
        </div>
      </div>
    </div>
  )
}

export default accountDetail
