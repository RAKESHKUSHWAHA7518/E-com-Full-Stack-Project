import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

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
        <footer className='bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900'>
            <div className='container mx-auto px-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
                    {/* Brand Section */}
                    <div className='flex flex-col gap-6'>
                        <Link to={"/"} className='flex items-center brightness-0 invert'>
                            <Logo w={100} h={50} />
                        </Link>
                        <p className='text-sm leading-relaxed text-slate-400'>
                            Elevate your shopping experience with Rakesh E-com. We provide high-quality products with seamless delivery and top-notch customer support.
                        </p>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-3 text-slate-400 hover:text-red-500 transition-colors cursor-pointer'>
                                <FaPhoneAlt size={14} />
                                <span className='text-xs'>+91 98765 43210</span>
                            </div>
                            <div className='flex items-center gap-3 text-slate-400 hover:text-red-500 transition-colors cursor-pointer'>
                                <FaEnvelope size={14} />
                                <span className='text-xs'>support@rakesh-ecom.com</span>
                            </div>
                            <div className='flex items-center gap-3 text-slate-400'>
                                <FaMapMarkerAlt size={14} />
                                <span className='text-xs'>Mumbai, Maharashtra, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-white font-bold text-base mb-6 uppercase tracking-wider'>Shop</h4>
                        <ul className='flex flex-col gap-3'>
                            {footerLinks.shop.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.link} className='text-sm hover:text-red-500 hover:pl-2 transition-all duration-300'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className='text-white font-bold text-base mb-6 uppercase tracking-wider'>Customer Care</h4>
                        <ul className='flex flex-col gap-3'>
                            {footerLinks.customerCare.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.link} className='text-sm hover:text-red-500 hover:pl-2 transition-all duration-300'>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className='text-white font-bold text-base mb-6 uppercase tracking-wider'>Join Our Newsletter</h4>
                        <p className='text-sm text-slate-400 mb-6'>
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <div className='flex flex-col gap-3'>
                            <div className='relative'>
                                <input 
                                    type='email' 
                                    placeholder='Enter your email' 
                                    className='w-full bg-slate-900 border border-slate-800 rounded-full py-3 px-6 text-sm outline-none focus:border-red-500 transition-colors'
                                />
                                <button className='absolute right-1 top-1 bottom-1 bg-red-600 hover:bg-red-700 text-white rounded-full px-5 text-sm font-bold transition-all'>
                                    Join
                                </button>
                            </div>
                            <div className='flex items-center gap-4 mt-4'>
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.link}
                                        whileHover={{ scale: 1.2, color: "#f43f5e" }}
                                        className='text-slate-400 text-lg transition-colors'
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-xs text-slate-500'>
                        © {currentYear} Rakesh E-com. All rights reserved.
                    </p>
                    <div className='flex items-center gap-8'>
                        {footerLinks.policy.map((item, index) => (
                            <Link key={index} to={item.link} className='text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors'>
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
