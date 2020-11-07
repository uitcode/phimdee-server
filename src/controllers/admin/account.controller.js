const methodDB = require('../../models/method');
const accountModel = require('../../models/admin/account.model');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const RSA = require('../../service/rsa');

const dotenv = require('dotenv');
dotenv.config("./config.env");
const JWT_SECRET = process.env.JWT_SECRET;

let optionsCookie = {
  // maxAge: 1000 * 60 * 15,
  httpOnly: false,
  signed: false
}

const encodedToken = (accountID) => {
  return JWT.sign({
    iss: 'Admin Duy',
    sub: accountID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, JWT_SECRET)
}

const responseVerify = (req, res) => {
  res.setHeader('Authorization', encodedToken(req.user.id))
  res.status(200).json({
    status: true,
    phone: req.user.phone,
    email: req.user.email,
  });
}

const responseLogin = (req, res) => {
  res.setHeader('Authorization', encodedToken(req.user.id))
  res.cookie('dee', encodedToken(req.user.id), optionsCookie)
  res.cookie('liame', RSA.encodeRSA(req.user.email), optionsCookie)
  res.cookie('detac', RSA.encodeRSA('eurt2891'), optionsCookie)
  res.cookie('elur', RSA.encodeRSA(req.user.rule), optionsCookie)
  res.cookie('eman', req.user.name, optionsCookie)
  res.cookie('ratava', req.user.avatar, optionsCookie)
  res.status(200).json({
    status: true,
    name: req.user.name,
    rule: req.user.rule,
    email: req.user.email,
    avatar: req.user.avatar
  });
}

const secret = async (req, res, next) => {
  console.log('ahihi secret');
}

const verify = async (req, res, next) => {
  console.log('ahihi verify');
  console.log(!!!req.user.phone);
  if (!!!req.user.phone) {
    let obj = {phone: req.body.phone}
    await methodDB.updateOne('admin', 'id', req.user.id, obj);
    responseLogin(req, res);
  } else if (req.user.phone.substr(req.user.phone.length - 9) == req.body.phone.substr(req.body.phone.length - 9)) {
    responseLogin(req, res);
  } else {
    res.status(500).json({
      status: false,
      message: 'verify fail'
    });
  }
  // console.log(req.user.phone.substr(req.user.phone.length - 9));
  // res.status(200).json({
  //   status: true
  // });
  // responseVerify(req, res);
}

const signIn = async (req, res, next) => {
  console.log('ahihi signIn');
  responseVerify(req, res);
}

const signUp = async (req, res, next) => {
  try {
    const checkExistEmail = await methodDB.findOne('admin', 'email', req.body.email);
    if ((!checkExistEmail.status && !!checkExistEmail.data.password) || (checkExistEmail.exist && !!checkExistEmail.data.password)) throw checkExistEmail.message;
    else {
      let response
      if (checkExistEmail.exist) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        response = await methodDB.updateOne('admin', 'email', req.body.email, req.body);
      } else {
        response = await accountModel.signUp(req.body);
      }
      if (!response.status) throw response.message;
      else {
        res.setHeader('Authorization', encodedToken(response.insertId))
        res.status(200).json({
          status: true
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error
    });
  }
}

const authGoogle = async (req, res, next) => {
  console.log('ahihi authGoogle');
  responseLogin(req, res);
}

const authFacebook = async (req, res, next) => {
  console.log('ahihi authFacebook');
  responseLogin(req, res);
}

module.exports = {
  secret,
  signIn,
  signUp,
  authGoogle,
  authFacebook,
  verify
}