const userLogged=(req,res,next)=>{
    res.locals.userLogged=false;
    if(req.session && req.session.user){
        res.locals.userLogged=true;
        res.locals.userLogged=req.session.user;
    }
    next();
}

module.exports=userLogged;