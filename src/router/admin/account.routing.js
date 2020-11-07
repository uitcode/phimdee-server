let router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../../middlewares/passport');

const userController = require('../../controllers/admin/account.controller')

router.post("/signup", userController.signUp);
router.post("/signin", passport.authenticate('local', { session: false }), userController.signIn);
router.get("/secret", passport.authenticate('jwt', { session: false }), userController.secret);
router.post("/verify", passport.authenticate('jwt', { session: false }), userController.verify);
router.post("/auth/google", passport.authenticate('google-token', { session: false }), userController.authGoogle);
router.post("/auth/facebook", passport.authenticate('facebook-token', { session: false }), userController.authFacebook);

module.exports = router;