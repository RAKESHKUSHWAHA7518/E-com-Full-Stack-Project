  import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaUserCircle  } from "react-icons/fa";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
  
  function Adminpanel() {

    const user =useSelector(state=>state?.user?.user)

    const navigate= useNavigate();

    useEffect(()=>{

      // if(user?.role!==ROLE.SUPERADMIN  ){
      //   navigate('/')
      // }
      if (user?.role !== ROLE.SUPERADMIN && user?.role !== ROLE.ADMIN) {
        navigate('/');
      }


    },[user])

    return (
      <div className='min-h-[calc(100vh-120px)] hidden  md:flex'>
        <aside className='bg-gray-50 min-h-full w-full max-w-60 shadow-[rgba(0,0,0,0.2)]'>
          <div className='h-32 flex justify-center items-center flex-col text-center'>
          <div className='text-5xl   cursor-pointer relative flex justify-center   '  >

          {
           user?.profilePic ? (
             <img src= {user?.profilePic} className='w-20 rounded-full h-20 ' alt={user?.name}/>
              ): (
             <FaUserCircle />

            )
          }

</div>
<h1 className='capitalize font-bold text-lg'>{user?.name}</h1>
<p>{user?.role}</p>
          </div>

          <div>
            <nav className='grid'>
              <Link to={'all-users'} className='p-2 py-1 hover:bg-slate-100'>All User</Link>
              <Link to={'all-product'} className='p-2 py-1  hover:bg-slate-100'>All Product</Link>
              
            </nav>

          </div>
          


        </aside>
        <main className='w-full h-full p-2'>
           <Outlet></Outlet>
        </main>
      </div>
    )
  }
  
  export default Adminpanel
  