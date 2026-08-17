import React from 'react'
import { Link } from 'react-router-dom'
import { FaLinkedinIn, FaFacebook, FaInstagram } from "react-icons/fa"
import '../styles/Footer.css'

function Footer() {
  return (
    <>
        <footer className='footer'>
            <p>&copy; 2026 Adroit 360. All rights reserved.</p>
            <div className="socials">                
                <Link to='/'><FaLinkedinIn size='1.5em'/></Link>
                <Link to='/'><FaFacebook size='1.5em' /></Link>
                <Link to='/'><FaInstagram size='1.5em' /></Link>
            </div>
        </footer>
    </>
  )
}

export default Footer