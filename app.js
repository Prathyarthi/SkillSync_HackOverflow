import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import errorMiddleware from './middlewares/error.middleware.js';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import linkedinRoutes from './routes/linkedinRoutes.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(morgan('dev'));
app.use(cookieParser());

import userRoutes from './routes/userRoutes.js';
import otherRoutes from './routes/otherRoutes.js';
// import setupRoutes from './routes/linkedinRoutes.js';

app.use('/api/v1/user', userRoutes);
app.use('/api/v1', otherRoutes);
app.use('/api/v1/linkedin', linkedinRoutes);



////
// app.js

// dotenv.config();

// const app = express();

app.use(session({ secret: 'NzqTiSbBesQyxh6k', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LinkedInStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/linkedin/callback',
    scope: ['openid', 'email', 'profile'],
}, (accessToken, refreshToken, profile, done) => {
    return done(null, { ...profile, accessToken });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/api/v1/linkedin', (req, res) => {
    res.send('Hello, guest! <a href="/auth/linkedin">Login with LinkedIn</a>');
});

// app.get('/auth/linkedin', passport.authenticate('linkedin'));

// app.get('/auth/linkedin/callback',
//     passport.authenticate('linkedin', { failureRedirect: '/' }),
//     async (req, res) => {
//         try {
//             // Log the user object to see its structure
//             console.log(req.user);

//             // Check if the access token is stored in a different property
//             const accessToken = req.user && req.user.accessToken;

//             if (!accessToken) {
//                 throw new Error('Access token not found in user object');
//             }

//             const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             });

//             const profileDetails = response.data;

//             console.log(profileDetails);

//             res.redirect('/profile');
//         } catch (error) {
//             console.error(error);
//             res.redirect('/');
//         }
//     }
// );

// app.get('/profile', (req, res) => {
//     if (!req.isAuthenticated()) {
//         return res.redirect('/');
//     }

//     res.json(req.user);
// });


// Initiate LinkedIn authentication
app.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['openid', 'email', 'profile'] }));

// LinkedIn authentication callback route
app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            // Log the user object to see its structure
            console.log(req.user);

            // Check if the access token is stored in a different property
            const accessToken = req.user && req.user.accessToken;

            if (!accessToken) {
                throw new Error('Access token not found in user object');
            }

            const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const profileDetails = response.data;

            console.log(profileDetails);

            // Redirect to the desired destination after authentication
            res.redirect('/profile');
        } catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
);

// Display user profile
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    // Additional logic for displaying the user profile
    res.json(req.user);
});

// Redirect from /api/v1/linkedin to /auth/linkedin automatically
app.get('/api/v1/linkedin-redirect', (req, res) => {
    res.redirect('/auth/linkedin');
});

// Redirect from /auth/linkedin to /profile automatically
app.get('/auth/linkedin-redirect', (req, res) => {
    res.redirect('/profile');
});



app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.all('*', (_req, res) => {
    res.status(404).send('OOPS!!! 404 Page Not Found');
});

app.use(errorMiddleware);

// export default app;
//////


////

// passport.use(new LinkedInStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: 'http://localhost:8080/auth/linkedin/callback',
//     scope: ['openid', 'email', 'profile'],
// }, (accessToken, refreshToken, profile, done) => {
//     return done(null, { ...profile, accessToken });
// }));

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//     done(null, obj);
// });

///
// app.use(require('express-session')({ secret: 'NzqTiSbBesQyxh6k', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());
///

// app.use(session({ secret: process.env.CLIENT_SECRET, resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
// });

export default app;
