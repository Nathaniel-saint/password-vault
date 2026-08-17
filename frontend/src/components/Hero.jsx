import React from 'react'
import { Link } from 'react-router-dom'
import hero_img from '../assets/hero_img.png'
import '../styles/Hero.css'

function Hero() {
  return (
    <>
        <div className="hero-section">
            <div className="hero-text">
                <h1 className="hero-heading">
                    Never lose a <br/> domain again.
                </h1>
                <p className="hero-para">Securely manage your entire domain portfolio, store passwords, and get automatic expiry alerts, all in one place.</p>
                <div className="hero-links">
                    <Link className='get-link' to='/register'>Get Started For Free</Link>
                    <Link className='demo-link' to='/'>Watch a Demo</Link>
                </div>
            </div>
            {/* Hero image */}
            <img className='hero-img' src={hero_img} alt="" />
        </div>
    </>
  )
}

export default Hero