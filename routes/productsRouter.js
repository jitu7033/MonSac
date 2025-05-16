const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');

const router = express.Router();


router.get("/", isLoggedIn, function(req,res){
  res.send("hey");
});

module.exports = router;
