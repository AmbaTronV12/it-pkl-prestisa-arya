"use client"
import React from 'react'
import styles from './register.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { registerImage, toggleIcon, toggleIcon1 } from '@/public/assets';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleChangeToLogin = () => {
        router.push('/login');
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000); // Redirect after success
    } else {
        setError(data.error || 'Failed to register');
    }
  };

  return (
    <div className={styles.page}>
        <div className={styles.container}>
            <Image src={registerImage} alt='registerImage'/>
            <div className={styles.registerContent}>
                <h1>Hi, Let's Make Your<br/> Account First</h1>
                <form onSubmit={handleRegister} className={styles.registerForm}>
                    <div className={styles.inputContainer}>
                        <p>Username</p>
                        <div className={styles.inputBar}>
                            <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            />
                        </div>
                    </div>
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
                    <div className={styles.termContainer}>
                    <input
                    type="checkbox"
                    id="term"
                    required
                    className={styles.checkbox}
                    />
                    <label htmlFor='term' className={styles.term}>I Agree to the <a href='#'>Terms & Service</a></label>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && (
                        <p className={styles.success}>Registration successful! Redirecting...</p>
                    )}
                    <button
                    type="submit" className={styles.submit}
                    >Create Account</button>
                </form>
                <p className={styles.changer}>Already Have an Account? <span onClick={handleChangeToLogin}>Sign In</span></p>
            </div>
        </div>
    </div>
  )
}

export default Register