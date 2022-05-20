const guest=(req,res,next)=>{
    if(req.session.user==undefined){
        return res.redirect("/");
    }
        next();    
}

module.exports=guest;