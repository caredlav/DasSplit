const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

const homeController = {
    getHome: (req,res) => {
        res.render('home');
    },
    getRegister: (req,res)=>{
        res.render("register");
    },
    createUser: (req,res)=>{
        let userData= req.body
        let errors=validationResult(req);        
        if(errors.isEmpty()){
            let existsUser= userModel.checkEmailIfExist(userData);
            if(existsUser!=null){
                res.render('register', {
                    errors: { msg: "Ya existe un usuario registrado con el email ingresado." },
                    oldData: req.body
                });
            }else{
                userModel.newUser(userData);
                res.redirect("/login");  
            }            
        }else{
            return res.render("register",{errors: errors.mapped(), oldData: req.body});            
        }
        
    },
    getLogin: (req,res)=>{
        res.render("login");
    },
    login: (req,res)=>{
        const userData=req.body;
        let errors=validationResult(req);
        if(errors.isEmpty()){
            let userFound= userModel.findUser(userData);
            if(userFound!=null){
            req.session.user=userFound;                      
            res.redirect("/profile");
            }else{
            res.render("login",{errors: {msg: "El correo o la contraseña están erróneos. Por favor, vuelva a intentarlo."}});
        }  
        }else{
            res.render("login",{errors: errors.mapped()});
        }               
    },
    getUserDetail: (req,res)=>{
        res.render("userDetail");
    },
    sendInvitation: async(req,res)=>{
        let userToInvite=req.body;
        let userInviting=req.session.user        
       contentHTML=`   
        <h2>Hola ${userToInvite.name}</h2>     
        <p>Acabas de recibir una invitación por parte de ${userInviting.name} ${userInviting.lastName} para compartir la cuenta de DasSplit.
        Te recomendamos contactar a la persona ${userInviting.email} para validar la información.</p>                        
       `
        try {
           let trasnporter= userModel.sharingAccount(userInviting,userToInvite.name);
           let message={
               from: '"DasSplit" <no-reply@dassplit.com>',
               to: userToInvite.email,
               subject: 'Invitación para usar DasSplit',
               html: contentHTML
           }
            
            const info= await trasnporter.sendMail(message);
            // console.log("mensaje sent",info.messageId);
            res.render("userDetail");
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getAdmPayments: (req,res)=>{
        let userInSession=req.session.user;
        let pays= userModel.getPaysInDB(userInSession);        
        let users=userModel.getUsersUsingAccount(userInSession);
        res.render("admPayments",{pays: pays, users: users});
    },
    submitPay: (req,res)=>{
        let errors=validationResult(req);
        if(errors.isEmpty()){
           let payInfo=req.body;
        let userInSession=req.session.user;
        userModel.submitPay(payInfo,userInSession);
        res.redirect("/profile"); 
        }else{
            let userInSession=req.session.user;
            let users=userModel.getUsersUsingAccount(userInSession);
            return res.render("newPayDue",{errors: errors.mapped(), users: users, oldData: req.body});
        }        
    },
    getPayDues: (req,res)=>{       
        let invoice=req.params.inv;
        let infoDue=userModel.getInfoDue(invoice);
        res.render("payDues",{due: infoDue});
    },
    payDues: (req,res)=>{
        let payDue=req.body;
        let userInSession=req.session.user;
        userModel.payDues(payDue,userInSession);
        res.redirect("/profile");
    },
    logOut: (req,res)=>{
        req.session.destroy();
        return res.redirect("/");
    },
    getNewPay: (req,res)=>{
        let userInSession=req.session.user;
        let users=userModel.getUsersUsingAccount(userInSession);
        res.render("newPayDue",{users: users});
    }
}

module.exports = homeController;