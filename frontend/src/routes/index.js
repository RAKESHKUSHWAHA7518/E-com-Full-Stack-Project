  import { createBrowserRouter } from "react-router-dom";
  import App from "../App";
  import Home from "../pages/Home";
  import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import Adminpanel from "../pages/Adminpanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";

  const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children:[
            {
                path: '',
                element: <Home/>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword/>

            },
            {
                path: 'Sign-up',
                element: <SignUp/>
            },
            {
                path: 'cart',
                element: <Cart/>
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path: 'product-category',
                element: <CategoryProduct/>
            },
            {
                path: 'product/:id',
                element: <ProductDetails/>
            },
            {
                path:'admin-panel',
                element:<Adminpanel/>,
                children:[
                    {
                        path:'all-users',
                        element:<AllUsers/>

                    },
                    {
                        path:'All-product',
                        element:<AllProducts/>
                    }
                ]
            }
        ]
    }

  ])

  export default router