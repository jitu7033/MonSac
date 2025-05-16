const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {generatToken} = require("../utils/generateToken")
const userRegister = require('../controllers/authController')


module.exports.registerUser =  async function(req,res){
  try{
     let {fullname, email,password} = req.body;

     bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(password,salt,async function(err,hash){
        if(err) return res.send(err.message);
        let user = await userModel.create({
          fullname,
          email,
          password: hash
        });
        let token = generatToken(user);
        // console.log(token);
        res.cookie("token",token);
        res.send(user)
      });
     });
  }catch(err){
    console.log(err.message);
    res.status(500).send(err);
  }
}

module.exports.loginUser = async function(req,res){
  try{
      let {email, password} = req.body;

      let user = await userModel.findOne({email});
      // console.log(user);

      bcrypt.compare(password, user.password, function(req,result){
        if(!result) return res.status(500).send("password not matched ");

        let token = generatToken(user);
        res.cookie("token", token);
        res.send("login successfully");
      })

      // res.send(user)
  }catch(err){
    res.status(500).send(err.message);
  }
}


module.exports.logoutUser = async function(req,res){
  try{
    res.cookie("token","");
    res.send("logout successfully");
  }catch(err){
    req.send(err.message);
  }
}