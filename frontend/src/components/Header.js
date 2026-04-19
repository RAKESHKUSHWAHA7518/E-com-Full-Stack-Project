import React, { useContext, useState, useEffect } from 'react'
import Logo from './Logo'
import { GoSearch } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { selectWishlistCount } from '../store/wishlistSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useSelector(state => state?.user?.user)
    const wishlistCount = useSelector(selectWishlistCount)
    const context = useContext(Context)

    const [menuDisplay, setMenuDisplay] = useState(false)
    const [search, setSearch] = useState("")

    // Sync search input with URL
    useEffect(() => {
        const URLSearch = new URLSearchParams(location.search)
        const searchQuery = URLSearch.get("q")
        if (searchQuery) setSearch(searchQuery)
    }, [location.search])

    const handleLogout = async () => {
        const fetchData = await fetch(SummaryApi.logout_user.url, {
            method: SummaryApi.logout_user.method,
            credentials: 'include'
        })
        const data = await fetchData.json();
        if (data.success) {
            toast.success(data.message)
            dispatch(setUserDetails(null))
            navigate('/login')
        }
        if (data.error) {
            toast.error(data.message)
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target
        setSearch(value)
        if (value) {
            navigate(`/search?q=${value}`)
        } else {
            navigate("/search")
        }
    }

    return (
        <header className='h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 fixed w-full z-40 transition-all duration-300 shadow-sm'>
            <div className='h-full flex items-center px-4 md:px-8 container mx-auto justify-between gap-4'>
                <div className='flex items-center shrink-0'>
                    <Link to={"/"} className='flex items-center'>
                        <Logo w={110} h={55} />
                    </Link>
                </div>

                {/* Desktop Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='hidden md:flex items-center w-full max-w-sm border border-slate-300 rounded-full focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all bg-slate-50 overflow-hidden group h-10'
                >
                    <input
                        type='text'
                        placeholder='Search for products...'
                        className='w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400 text-sm px-4 h-full'
                        onChange={handleSearch}
                        value={search}
                    />
                    <div
                        className='w-12 h-full bg-red-600 flex items-center justify-center text-white cursor-pointer hover:bg-red-700 transition-colors'
                    >
                        <GoSearch size={18} />
                    </div>
                </motion.div>

                <div className='flex items-center gap-4 md:gap-7'>
                    {/* User Profile / Admin Menu */}
                    <div className='relative flex items-center justify-center'>
                        {user?._id && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='text-3xl cursor-pointer rounded-full transition-all focus-within:ring-2 focus-within:ring-red-500'
                                onClick={() => setMenuDisplay(prev => !prev)}
                            >
                                {user?.profilePic ? (
                                    <img src={user?.profilePic} className='w-9 h-9 rounded-full object-cover border border-slate-200' alt={user?.name} />
                                ) : (
                                    <FaUserCircle className='text-slate-500' />
                                )}
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {menuDisplay && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className='absolute bg-white top-full mt-3 right-0 h-fit shadow-xl rounded-xl p-2 min-w-[170px] border border-slate-100 z-50'
                                >
                                    <nav className='flex flex-col gap-0.5'>
                                        {(user?.role === ROLE.ADMIN || user?.role === ROLE.SUPERADMIN) && (
                                            <Link to={'/admin-panel/all-users'} className='whitespace-nowrap hover:bg-slate-50 hover:text-red-500 p-2.5 rounded-lg transition-all hidden md:block text-xs font-bold text-slate-700' onClick={() => setMenuDisplay(false)}>
                                                Admin Panel
                                            </Link>
                                        )}
                                        <Link to={'/orders'} className='whitespace-nowrap hover:bg-slate-50 hover:text-red-500 p-2.5 rounded-lg transition-all block text-xs font-bold text-slate-700' onClick={() => setMenuDisplay(false)}>
                                            My Orders
                                        </Link>
                                        <Link to={'/profile'} className='whitespace-nowrap hover:bg-slate-50 hover:text-red-500 p-2.5 rounded-lg transition-all block text-xs font-bold text-slate-700' onClick={() => setMenuDisplay(false)}>
                                            My Profile
                                        </Link>
                                    </nav>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Wishlist */}
                    {user?._id && (
                        <Link to={"/wishlist"} className='relative flex items-center'>
                            <motion.div
                                whileHover={{ scale: 1.1, color: "#f43f5e" }}
                                className='text-xl cursor-pointer text-slate-500 transition-colors'
                            >
                                <FaHeart />
                                {wishlistCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className='p-1 text-white w-4 h-4 flex items-center bg-red-600 rounded-full justify-center absolute -top-1.5 -right-2 ring-1 ring-white'
                                    >
                                        <p className='text-[8px] font-bold'>{wishlistCount}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    )}

                    {/* Cart */}
                    {user?._id && (
                        <Link to={"/cart"} className='relative flex items-center'>
                            <motion.div
                                whileHover={{ scale: 1.1, color: "#ef4444" }}
                                className='text-xl cursor-pointer text-slate-700'
                            >
                                <FaCartShopping />
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className='p-1 text-white w-4 h-4 flex items-center bg-red-600 rounded-full justify-center absolute -top-1.5 -right-2 ring-1 ring-white'
                                >
                                    <p className='text-[8px] font-bold'>{context?.cartProductCount}</p>
                                </motion.div>
                            </motion.div>
                        </Link>
                    )}

                    {/* Login/Logout Button */}
                    <div className='flex items-center'>
                        {user?._id ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className='px-5 py-1.5 rounded-full bg-red-600 text-white font-bold text-sm shadow-md hover:bg-red-700 transition-all'
                            >
                                Logout
                            </motion.button>
                        ) : (
                            <Link to={"/login"}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='px-6 py-1.5 rounded-full bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/10 hover:bg-red-700 transition-all'
                                >
                                    Login
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header