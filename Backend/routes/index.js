

const express = require('express')

const router = express.Router()
 const  userSignUpController = require('../controller/user/userSignUp')
const userSignInController = require('../controller/user/userSigin')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const uploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetailsController= require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')

// Payment and Order controllers
const { createCheckoutSessionController, checkoutSuccess, checkoutCancel } = require('../controller/payment/checkoutController')
const { handleStripeWebhook } = require('../controller/payment/webhookController')
const { getUserOrders, getAllOrders, getOrderById } = require('../controller/order/orderController')
const { checkPurchase } = require('../controller/order/checkPurchaseController')

// Review controller
const { createReview, getProductReviews, updateReview, deleteReview, toggleHelpfulVote } = require('../controller/review/reviewController')

// Wishlist controller
const { toggleWishlist, getUserWishlist, getWishlistAnalytics } = require('../controller/wishlist/wishlistController')

router.post('/signup',userSignUpController)

router.post('/signin',userSignInController)
router.get('/user-details',authToken,userDetailsController)
router.get('/userLogout',userLogout)
router.get('/all-user',authToken,allUsers)
router.post('/update-user',authToken, updateUser)

//  product 

router.post('/upload-product',authToken,uploadProductController)
router.get('/get-product',getProductController)
router.post('/update-product',authToken,updateProductController)
router.get('/get-categoryProduct',getCategoryProduct)
router.post('/category-Product',getCategoryWiseProduct)
router.post('/product-details',getProductDetailsController)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.get('/get',getCategoryProduct)
//  user add to cart 
router.post('/addtocart',authToken,addToCartController)
router.get('/countAddToCartProduct',authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

// Payment routes
router.post('/checkout/create-session', authToken, createCheckoutSessionController)
router.get('/checkout/success', authToken, checkoutSuccess)
router.get('/checkout/cancel', authToken, checkoutCancel)

// Order routes
router.get('/orders/user', authToken, getUserOrders)
router.get('/orders/all', authToken, getAllOrders)
router.get('/orders/check-purchase/:productId', authToken, checkPurchase)
router.get('/orders/:orderId', authToken, getOrderById)

// Review routes
router.post('/reviews', authToken, createReview)
router.get('/reviews/:productId', getProductReviews)
router.put('/reviews/:reviewId', authToken, updateReview)
router.delete('/reviews/:reviewId', authToken, deleteReview)
router.post('/reviews/:reviewId/helpful', authToken, toggleHelpfulVote)

// Wishlist routes
router.post('/wishlist/toggle', authToken, toggleWishlist)
router.get('/wishlist', authToken, getUserWishlist)
router.get('/wishlist/analytics', authToken, getWishlistAnalytics)

module.exports = router