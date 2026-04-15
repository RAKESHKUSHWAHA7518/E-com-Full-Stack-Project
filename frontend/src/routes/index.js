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
import CheckoutSuccess from "../pages/CheckoutSuccess";
import CheckoutCancel from "../pages/CheckoutCancel";
import OrderHistory from "../pages/OrderHistory";
import AdminOrders from "../pages/AdminOrders";
import AdminReviews from "../pages/AdminReviews";
import WishlistPage from "../pages/WishlistPage";
import AdminWishlistAnalytics from "../pages/AdminWishlistAnalytics";

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
                path: 'checkout/success',
                element: <CheckoutSuccess/>
            },
            {
                path: 'checkout/cancel',
                element: <CheckoutCancel/>
            },
            {
                path: 'orders',
                element: <OrderHistory/>
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
                path: 'wishlist',
                element: <WishlistPage/>
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
                    },
                    {
                        path:'orders',
                        element:<AdminOrders/>
                    },
                    {
                        path:'reviews',
                        element:<AdminReviews/>
                    },
                    {
                        path:'wishlist-analytics',
                        element:<AdminWishlistAnalytics/>
                    }
                ]
            }
        ]
    }

  ])

  export default router