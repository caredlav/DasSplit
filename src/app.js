const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const userLogged=require('./middlewares/userLoggedMiddleware');

const routerHome = require('./routes/home.routes');
const res = require('express/lib/response');

app.set("view engine", "ejs");

app.set("views",path.resolve(__dirname,"./views"));

app.use(express.static("public"));

app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(session({secret: "hidden msg", resave: false, saveUninitialized: false}));
app.use(express.json());
app.use(userLogged);

app.use("/",routerHome);

app.use((req,res,next)=>{
    res.status(404).render("error");
});

app.listen(3000,()=>console.log("corriendo en puerto 3000"));