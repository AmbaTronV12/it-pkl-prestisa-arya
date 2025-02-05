import React from 'react'
import styles from './profile.module.css'
import { NavbarProfile, Sidebar } from '@/component'

const profile = () => {
  return (
    <div className={styles.page}>
      <NavbarProfile/>
      <Sidebar></Sidebar>
      
    </div>
  )
}

export default profile