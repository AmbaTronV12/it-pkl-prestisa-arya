"use client"
import React from 'react'
import { useAuth } from '@/app/context/authContext';
import styles from './login.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginImage, toggleIcon, toggleIcon1 } from '@/public/assets';

const Register = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleChangeToRegister = () => {
        router.push('/register');
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
    
          const data = await res.json();
    
          if (res.ok) {
            // Save token to local storage or cookie
            localStorage.setItem("token", data.token);
            //AuthContext
            login({ username: data.username });
            // Redirect to home or protected page
            router.push("/homepage");
          } else {
            setError(data.error || "Failed to log in. Please try again.");
          }

        } catch (err) {
          console.error("Login error:", err);
          setError("An unexpected error occurred.");
        }
      };

  return (
    <div className={styles.page}>
        <div className={styles.container}>
            <Image src={loginImage} alt='registerImage'/>
            <div className={styles.registerContent}>
                <h1>Hi, Let's Make Your<br/> Account First</h1>
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <div className={styles.inputContainer}>
                    <p>Email</p>
                        <div className={styles.inputBar}>
                            <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                    <p>Password</p>
                        <div className={styles.inputBar}>
                            <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                            <Image src={showPassword ? toggleIcon1 : toggleIcon} alt={showPassword ? "Hide password" : "Show password"}  onClick={togglePasswordVisibility}/>
                        </div>
                        
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button
                    type="submit" className={styles.submit}
                    >Sign In</button>
                </form>
                <p className={styles.changer}>Don't Have an Account? <span onClick={handleChangeToRegister}>Register</span></p>
            </div>
        </div>
    </div>
  )
}

export default Register