const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/MONSAC')
.then(function(){
  console.log("connected");
}).catch(function(err){
  console.log("error : ", err);
});

module.exports = mongoose.connection;