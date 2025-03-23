
const  jwt = require('jsonwebtoken')

async function authToken (req, res, next) {
    try {
        const token = req.cookies?.token ||req.headers?.cookie.split("token=")[1];
       

        console.log(token);
        if(!token){
            return res.status(200).json({
                message: " User Not login",
                error:true,
                success:false
            })
          }

        jwt.verify(token,process.env.TOKEN_SECRET_KEY, function(err, decoded) {
          
          console.log(err);
          console.log(decoded);

          if(err){
            console.log("Error auth",err);
          } 

          req.userId= decoded?._id

          next()

          
             
          });
          
         

    } catch (err) {
        res.status(400).json({
            message:err.message ||err,
            error:true,
            data:[],
            success: false,
        
        })
    }

}

module.exports = authToken




// async function authToken(req, res, next) {
//     try {
//         // Check if token exists in cookies or in req.token
//         const token = req.cookie?.token || req.headers?.cookie.split("token=")[1];
        
//         console.log(token);
//         if (!token) {
//             // If token doesn't exist, throw an error
//             throw new Error("Token not found");
//         }

//         // Log the token for debugging purposes
        

//         // Pass the token to the next middleware
//         req.token = token;
//         next();
//     } catch (err) {
//         // Handle errors by sending a response
//         res.status(400).json({
//             message: err.message || err,
//             error: true,
//             data: [],
//             success: false,
//         });
//     }
// }

// module.exports = authToken;



// async function authToken(req, res, next) {
//     try {
//         // Check if token exists in cookies or in the cookie header
//         const cookieHeader = req.headers.cookie;
//         if (!cookieHeader) {
//             throw new Error("Cookie header not found");
//         }

//         // Extract the token from the cookie header
//         const token = cookieHeader.split("token=")[1];
//         console.log(token);

//         if (!token) {
//             // If token doesn't exist, throw an error
//             throw new Error("Token not found in the cookie");
//         }

//         // Pass the token to the next middleware
//         req.token = token;
//         next();
//     } catch (err) {
//         // Handle errors by sending a response
//         res.status(400).json({
//             message: err.message || err,
//             error: true,
//             data: [],
//             success: false,
//         });
//     }
// }

// module.exports = authToken;



 