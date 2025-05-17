const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");


router.get("/",function(req,res){
  let error  = req.flash("error");
  res.render("index",{error, loggedin: false});
});

router.get("/logout",function(req,res){
  res.clearCookie("token");
  req.flash("success", "logged out successfully");
  res.redirect("/");
})

router.get("/shop", isLoggedIn, async function(req,res){
  let products = await productModel.find();
  res.render("shop",{products})

});

router.get("/addtocart/:id", isLoggedIn, async function(req,res){
  let user = await userModel.findOne({_id: req.user._id});
  user.cart.push(req.params.id);
  await user.save();
  req.flash("success", "added to cart");
  res.redirect("/shop");
})



router.get('/cart',isLoggedIn, async (req, res) => {
  try {
    // assuming user is authenticated and stored in req.user or session
    const userId = req.user._id;

    const user = await userModel.findById(userId).populate('cart');
  

    const cartMap = new Map();
    user.cart.forEach(item => {
      const key = item._id.toString();
      if (cartMap.has(key)) {
        cartMap.get(key).quantity += item.quantity;
      } else {
        cartMap.set(key, { productId: key, quantity: item.quantity });
      }
    });

    const groupedCartItems = Array.from(cartMap.values());
    const productIds = groupedCartItems.map(item => item.productId);

    // Step 2: Fetch product details from DB
    const productsFromDb = await productModel.find({ _id: { $in: productIds } });

    // Step 3: Merge with quantity
    const products = groupedCartItems.map(item => {
      const product = productsFromDb.find(p => p._id.toString() === item.productId);
      return {
      _id: product?._id,
        name: product?.name || 'Unknown Product',
        price: product?.price || 0,
        image: product?.image,
        discount: product?.discount || 0,
        quantity: item.quantity
      };
    });

    // console.log(products[0]._id);

    res.render('cart', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading cart");
  }
});


// increse the count and decrease the count 

router.post("/cart/increase/:id", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  // res.send(productId);

  const user = await userModel.findById(userId);
  const existingItem = user.cart.find(item=> item._id.toString() === productId);

  if(existingItem){
    existingItem.quantity += 1;
  }
  else{
    user.cart.push({product: productId, quantity: 1});
  }
  await user.save();
  res.redirect("/cart");

})

router.post("/cart/decrease/:id", isLoggedIn, async(req,res)=>{
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await userModel.findById(userId);

    const existingItem = user.cart.find(item=> item._id.toString() === productId);

    if(existingItem){
      if(existingItem.quantity > 1){
        existingItem.quantity -= 1;
      }
      else{
        user.cart = user.cart.filter(item => item._id.toString() !== productId);
      }
    }
    await user.save();
    res.redirect("/cart");
})







module.exports = router;