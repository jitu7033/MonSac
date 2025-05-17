const express = require('express');
const { registerUser , loginUser, logoutUser} = require('../controllers/authController');


const router = express.Router();




// user routes create 

router.post("/register",registerUser);
router.post("/login", loginUser);


module.exports = router;