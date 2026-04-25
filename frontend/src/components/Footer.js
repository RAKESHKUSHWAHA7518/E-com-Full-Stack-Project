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
                <div className='footer-main-grid'>
                    {/* Brand Section */}
                    <div className='footer-brand-section'>
                        <Link to={"/"} className='footer-logo-link'>
                            <Logo w={140} h={70} />
                        </Link>
                        <p className='brand-tagline'>
                            Experience premium shopping with curated collections. Quality and style delivered to your doorstep.
                        </p>
                        <div className='social-icons-row'>
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.link}
                                    className='social-pill'
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='footer-nav-col'>
                        <h4 className='nav-title'>Shop</h4>
                        <ul className='nav-list'>
                            {footerLinks.shop.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.link} className='nav-link-item'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='footer-nav-col'>
                        <h4 className='nav-title'>Support</h4>
                        <ul className='nav-list'>
                            {footerLinks.customerCare.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.link} className='nav-link-item'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className='footer-newsletter-col'>
                        <h4 className='nav-title'>Newsletter</h4>
                        <p className='newsletter-subtext'>Subscribe to get special offers and once-in-a-lifetime deals.</p>
                        <form className='newsletter-form-simple' onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type='email' 
                                placeholder='Email address' 
                                className='newsletter-input-simple'
                            />
                            <button className='newsletter-btn-simple'>
                                Join
                            </button>
                        </form>
                        <div className='contact-quick-list'>
                            <div className='contact-quick-item'>
                                <FaPhoneAlt size={12} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className='contact-quick-item'>
                                <FaEnvelope size={12} />
                                <span>support@rakesh.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='footer-bottom-bar'>
                    <div className='bottom-copyright'>
                        © {currentYear} Rakesh E-com. All rights reserved.
                    </div>
                    <div className='bottom-links'>
                        {footerLinks.policy.map((item, index) => (
                            <Link key={index} to={item.link} className='bottom-link'>
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
