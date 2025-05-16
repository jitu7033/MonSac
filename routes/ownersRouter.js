const express = require('express');

const router = express.Router();
const ownerModel = require('../models/owner-model');



// router post 
router.post("/create", async function(req,res){
  let owner = await ownerModel.find();
  if(owner.length > 0) return res.status(503).send("you dont have permision to create a new owners");
  
  let {fullname, email, password} = req.body;

  console.log(fullname, email, password);

  // res.send("you can create a route")

  let createdOwner = await ownerModel.create({
    fullname : fullname,
    email : email,
    password : password,
  });

  res.status(201).send(createdOwner); 

})



router.get("/",function(req,res){
  res.send("hey");
})

module.exports = router;