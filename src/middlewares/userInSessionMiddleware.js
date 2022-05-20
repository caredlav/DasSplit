const login=(req,res,next)=>{
    if(req.session.user!=undefined){
        return res.redirect("/profile");
    }
        next();    
}

module.exports=login;