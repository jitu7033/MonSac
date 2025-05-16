const express = require('express');
const { registerUser , loginUser, logoutUser} = require('../controllers/authController');


const router = express.Router();


router.get("/",function(req,res){
  res.send("hey");
});


// user routes create 

router.post("/create",registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser)

module.exports = router;