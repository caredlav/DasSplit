const path = require('path');
const userModel = require('../models/userModel');

const homeController = {
    getHome: (req,res) => {
        res.render('home');
    },
    getRegister: (req,res)=>{
        res.render("register");
    },
    createUser: (req,res)=>{
        const userData= req.body
        userModel.newUser(userData);
        res.redirect("login");
    },
    getLogin: (req,res)=>{
        res.render("login");
    },
    login: (req,res)=>{
        const userData=req.body;
        let userFound= userModel.findUser(userData);
        if(userFound!=undefined){
            res.redirect("/");
        }else{
            res.send("Usuario no existente en base de datos");
        }        
    }
}

module.exports = homeController;