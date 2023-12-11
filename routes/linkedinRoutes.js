import { Router } from "express";
// import axios from 'axios';
// import passport from "passport";
// import { isLoggedIn } from "../middlewares/authMiddleware.js";
// import Linked from "../models/linkedinModel.js";
import { skills } from "../controllers/linkedinController.js";
import upload from "../middlewares/multerMiddleware.js";
const router = Router();

// const setupRoutes = () => {
//     router.get('/', (req, res) => {
//         return res.send('Hello, user! <a href="/api/v1/linkedin/auth/linkedin">Login with LinkedIn</a>');
//     });
//     router.get('/auth/linkedin', passport.authenticate('linkedin'));
//     router.get('/auth/linkedin/callback',
//         passport.authenticate('linkedin', { failureRedirect: '/' }),
//         async (req, res) => {
//             try {
//                 // Log the user object to see its structure
//                 console.log(req.user);

//                 // Check if the access token is stored in a different property
//                 const accessToken = req.user && req.user.accessToken;

//                 if (!accessToken) {
//                     throw new Error('Access token not found in user object');
//                 }
//                 const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                     },
//                 });

//                 const profileDetails = response.data;

//                 console.log(profileDetails);

//                 res.redirect('/profile');
//             } catch (error) {
//                 console.error(error);
//                 res.redirect('/');
//             }
//         }
//     );

//     router.get('/profile', (req, res) => {
//         if (!req.isLoggedIn()) {
//             return res.redirect('/');
//         }

//         res.json(req.user);
//         const jsonResponseString = profileDetails;

//         const linkedinData = JSON.parse(jsonResponseString);

//         const linkedinDetails = Linked.create({
//             given_name: linkedinData.given_name,
//             email: linkedinData.email,
//             skills: linkedinData.skills,
//             experience: linkedinData.experience,
//             location: linkedinData.location
//         });
//         linkedinDetails.save();

//         res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             user,
//         });

//         if (!linkedinDetails) {
//             return next(
//                 new AppError('User registration failed, please try again later', 400)
//             );
//         }
//     });

//     router.get('/logout', (req, res) => {
//         req.logout();
//         res.redirect('/');
//     });




// }


// export { setupRoutes, router };

router.post("/skills", upload.single("picture"), skills);

export default router