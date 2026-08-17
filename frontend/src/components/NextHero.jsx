import React from 'react'
import { CiLock, CiClock1 } from 'react-icons/ci'
import { RiTeamFill } from "react-icons/ri"
import { Link } from 'react-router-dom'
import '../styles/NextHero.css'


function NextHero() {
  return (
    <>
        <div className="next-hero-section">
            <h2 className="rhetoric">Why Domain Guard</h2>
            <div className="hero-grid-container">
                <div className="first-card card">
                    <CiLock size="2em" />
                    <h3>Secure Password Storage</h3>
                    <p>Safely store and manage all your domain registry and account passwords with bank-grade encryption.</p>
                </div>
                <div className="second-card card">
                    <CiClock1 size="2em" />
                    <h3>Automatic Expiry Alerts</h3>
                    <p> Receive timely notifications before any domain or SSL certificate expires, so you never miss a renewal.</p>
                </div>
                <div className="third-card card">
                    <RiTeamFill size="2em" />
                    <h3>Team Access Control</h3>
                    <p> Grant granular access permissions to your team members, ensuring secure collaboration and management.</p>
                </div>
            </div>
                <div className="promp-start">
                    <h3>Start protecting your digital assets today.</h3>
                    <Link to='/register'>Sign up for Free</Link>
                </div>
        </div>
    </>
  )
}

export default NextHero