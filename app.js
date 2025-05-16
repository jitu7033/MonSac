const express = require('express')
const app = express();
const expressSession = require('express-session');
const flash = require('connect-flash')

const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine ", "ejs");

const db = require('./config/mongoose-connection');

// app.use(
//   expressSession({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.EXPRESS_SESSION_SECRET,
//   })
// )
// app.use(flash());

const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productRouter = require('./routes/productsRouter')


app.use("/owners", ownersRouter);
app.use("/users",usersRouter);
app.use("/products", productRouter);  


app.listen(3000);