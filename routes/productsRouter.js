const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');

const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');




router.post("/create", upload.single("image"), async function(req,res){

 try{ 
  let product = await productModel.create({
    image : req.file.buffer,
    name : req.body.name,
    price : req.body.price,
    discount : req.body.diacount,
    bgcolor : req.body.bgcolor,
    panelcolor : req.body.panelcolor,
    textcolor : req.body.textcolor,
  })
  req.flash("success", "product created successfully");
  res.redirect("/owners/admin");
}catch(err){
  req.flash("error", "something went wrong");
  res.redirect("/owners/admin");
}
})


router.get("/", isLoggedIn, function(req,res){
  res.send("hey");
});

module.exports = router;
