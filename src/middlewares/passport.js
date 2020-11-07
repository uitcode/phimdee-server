const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-token').Strategy
const FacebookStrategy = require('passport-facebook-token');
const { ExtractJwt } = require('passport-jwt')
const methodDB = require('../models/method');
const accountModel = require('../models/admin/account.model');

const dotenv = require('dotenv');
dotenv.config("./config.env");
const JWT_SECRET = process.env.JWT_SECRET;

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    const account = await methodDB.findById('admin', payload.sub)

    if (!account.status || !account.exist) return done(null, false)
    
    done(null, account.data)
  } catch (error) {
    done(error, false)
  }
}));

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const account = await methodDB.findOne('admin', 'email', email, ['password', 'id', 'name', 'rule', 'email', 'avatar', 'phone']);
    if (!account.status || !account.exist) return done(null, false)

    const isCorrectPassword = await accountModel.isValidPassword(password, account.data.password);

    if (!isCorrectPassword || account.data.password == "") return done(null, false);

    done(null, account.data);
  } catch (error) {
    done(error, false)
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.AUTH_Google_clientID,
  clientSecret: process.env.AUTH_Google_clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!!!profile._json.email) return done(null, false);
    else {
      const account = await methodDB.findOne('admin', 'email', profile._json.email, ['id', 'name', 'rule', 'email', 'avatar']);
      if (!account.status) return done(null, false);
      if (account.exist) {
        const obj = {
          name: profile._json.name,
          avatar: profile._json.picture,
          idGoogle: profile._json.id
        }
        await methodDB.updateOne('admin', 'id', account.data.id, obj);
        obj.email = account.data.email;
        obj.id = account.data.id;
        obj.rule = account.data.rule;
        return done(null, obj);
      }
      else {
        const obj = {
          email: profile._json.email,
          name: profile._json.name,
          idGoogle: profile._json.id,
          avatar: profile._json.picture
        }
        let response = await accountModel.signUp(obj);
        if (!response.status) return done(null, false);
        obj.id = response.insertId;
        obj.rule = 0;
        done(null, obj);
      }
    }
  } catch (error) {
    done(error, false)
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.AUTH_Facebook_clientID,
  clientSecret: process.env.AUTH_Facebook_clientSecret,
  fbGraphVersion: 'v7.0'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!!!profile._json.email) return done(null, false);
    else {
      const account = await methodDB.findOne('admin', 'email', profile._json.email, ['id', 'name', 'rule', 'email', 'avatar']);
      if (!account.status) return done(null, false);
      if (account.exist) {
        const obj = {
          name: profile._json.name,
          avatar: profile.photos[0].value,
          idFacebook: profile._json.id
        }
        await methodDB.updateOne('admin', 'id', account.data.id, obj);
        obj.email = account.data.email;
        obj.id = account.data.id;
        obj.rule = account.data.rule;
        return done(null, obj);
      }
      else {
        const obj = {
          email: profile._json.email,
          name: profile._json.name,
          idFacebook: profile._json.id,
          avatar: profile.photos[0].value
        }
        let response = await accountModel.signUp(obj);
        obj.id = response.insertId;
        obj.rule = 0;
        if (!response.status) return done(null, false);
        done(null, obj);
      }
    }
  } catch (error) {
    done(error, false)
  }
}
));