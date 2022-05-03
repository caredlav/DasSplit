const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

const routerHome = require('./routes/home.routes');

app.set("view engine", "ejs");

app.set("views",path.resolve(__dirname,"./views"));

app.use(express.static("public"));

app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(session({secret: "hidden msg", resave: false, saveUninitialized: false}));
app.use(express.json());

app.use("/",routerHome);

app.listen(3000,()=>console.log("corriendo en puerto 3000"));