import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        shop: [
            { name: "All Products", link: "/all-products" },
            { name: "Featured Products", link: "/" },
            { name: "Categories", link: "/" },
            { name: "New Arrivals", link: "/" },
        ],
        customerCare: [
            { name: "My Account", link: "/profile" },
            { name: "Wishlist", link: "/wishlist" },
            { name: "Cart", link: "/cart" },
            { name: "Order History", link: "/orders" },
        ],
        policy: [
            { name: "Privacy Policy", link: "/" },
            { name: "Terms of Service", link: "/" },
            { name: "Shipping Policy", link: "/" },
            { name: "Return Policy", link: "/" },
        ]
    }

    const socialLinks = [
        { icon: <FaFacebookF />, link: "#" },
        { icon: <FaTwitter />, link: "#" },
        { icon: <FaInstagram />, link: "#" },
        { icon: <FaLinkedinIn />, link: "#" },
        { icon: <FaYoutube />, link: "#" },
    ]

    return (
        <footer className='footer-container'>
            <div className='footer-content'>
                <div className='footer-grid'>
                    {/* Brand Section */}
                    <div className='footer-brand'>
                        <Link to={"/"} className='brand-logo' style={{ filter: 'brightness(0) invert(1)' }}>
                            <Logo w={120} h={60} />
                        </Link>
                        <p className='brand-description'>
                            Experience excellence in every purchase. Rakesh E-com brings you curated products with a commitment to quality and seamless shopping.
                        </p>
                        <div className='footer-contact-list'>
                            <div className='contact-item'>
                                <FaPhoneAlt size={14} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className='contact-item'>
                                <FaEnvelope size={14} />
                                <span>support@rakesh-ecom.com</span>
                            </div>
                            <div className='contact-item'>
                                <FaMapMarkerAlt size={14} />
                                <span>Mumbai, Maharashtra, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className='footer-title'>Catalog</h4>
                        <ul className='footer-links'>
                            {footerLinks.shop.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.link} className='footer-link'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className='footer-title'>Assistance</h4>
                        <ul className='footer-links'>
                            {footerLinks.customerCare.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.link} className='footer-link'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div className='newsletter-section'>
                        <h4 className='footer-title' style={{ marginBottom: '1rem' }}>Newsletter</h4>
                        <p className='newsletter-text'>
                            Get exclusive access to new launches and seasonal offers.
                        </p>
                        <form className='newsletter-form' onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type='email' 
                                placeholder='Email address' 
                                className='newsletter-input'
                            />
                            <button className='newsletter-button'>
                                Join
                            </button>
                        </form>
                        <div className='social-links'>
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.link}
                                    className='social-icon'
                                    whileHover={{ y: -5 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='bottom-bar'>
                    <p className='copyright'>
                        © {currentYear} Rakesh E-com. All rights reserved. Crafted with passion.
                    </p>
                    <div className='policy-links'>
                        {footerLinks.policy.map((item, index) => (
                            <Link key={index} to={item.link} className='policy-link'>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
