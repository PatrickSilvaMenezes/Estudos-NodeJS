import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import { Router } from 'express';
import https from 'https';
import path from 'path';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { Strategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const routes = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const config = {
  CLIENT_ID:  process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
}

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  //show who loged in
  console.log('Google profile', profile);

  //done to supply users that are authenticated
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// implements some middlewares that are useful for security issues
app.use(helmet());
app.use(passport.initialize());

function checkLoggedIn(req, res, next){
  const isLoggedIn = true; 
  if (!isLoggedIn) {
    return res.status(401).json({
      erro: 'You must log in first!',
    });
  }
  next();
};
app.use(routes);

routes.get('/secret', checkLoggedIn, (req, res) => {
  return res.send('Your personal secret value is 42!');
})

//login endpoinst

//endpoint where user will request to google authorize
routes.get('/auth/google', passport.authenticate('google', {
  scope: ['email'],
}));
// endpoint where google will send the authorization code response
routes.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'failure',
  successRedirect: '/',
  session: false,
}), (req, res) => console.log('Google called us back!')
);



app.get('/failure', (req, res) => {
  return res.send('Failed to log in!');
});

//endpoint to logout
routes.get('/auth/logout', (req, res) => { });

routes.get('/', (req, res) => {
  return res.sendFile(path.join( __dirname, 'public', 'index.html'));
});

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app).listen(3000, () => console.log('Server is running'));

