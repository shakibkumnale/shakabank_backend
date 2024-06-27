const express = require('express')
const router=express.Router();
const auth = require('../middleware/auth');

const {home,signup,login,otp,user,fetchhistory,moneysend}=require('../controllers/auth-controller')

router.route('/moneysend').post(auth,moneysend)
router.route('/login').post(login)
router.route('/fetchhistory').get(auth,fetchhistory)
router.route('/otp').post(otp)
router.route('/user').get(auth,user)

router.route('/signup').post(signup)

module.exports=router;
