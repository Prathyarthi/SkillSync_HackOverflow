import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import errorMiddleware from './middlewares/error.middleware.js';
config();
import linkedinRoutes from './routes/linkedinRoutes.js'
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

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

app.use('/api/v1/user', userRoutes);
app.use('/api/v1', otherRoutes);
app.use('/api/v1/linkedin', linkedinRoutes)

app.all('*', (_req, res) => {
    res.status(404).send('OOPS!!! 404 Page Not Found');
});

app.use(errorMiddleware);


////

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


// app.use(require('express-session')({ secret: 'NzqTiSbBesQyxh6k', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(session({ secret: process.env.CLIENT_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});
/////

export default app;
