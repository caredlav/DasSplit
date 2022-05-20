const path = require('path');
const fs = require('fs');
const currentDB = JSON.parse(fs.readFileSync(path.resolve(__dirname,"./users.json")),"utf-8");
const currentPaysDB= JSON.parse(fs.readFileSync(path.resolve(__dirname,"./pays.json")),"utf-8");
const bcryptjs=require('bcryptjs');
const nodemailer = require('nodemailer');

const newId = () => {
	let ultimo = 0;
	currentDB.forEach(user => {
		if (user.id > ultimo){
			ultimo = user.id;
		}
	});
	return ultimo + 1
}

const newInvoice=()=>{
    let ultimo = 0;
    currentPaysDB.forEach(pay=>{
        if(pay.compromiso.invoice>ultimo){
            ultimo = pay.compromiso.invoice;
        }
    });
    return ultimo + 1
}

const userModel={
    
    newUser: (user)=>{
        let createNewUser={
            id: newId(),
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            pass: bcryptjs.hashSync(user.pass,12),
            limitInv: 2,
            usersInv: [],
            funds: {
                user1:{
                    name: user.name,
                    amount: 0
                }
            } 
        };
        currentDB.push(createNewUser);
        let jsonUsers=JSON.stringify(currentDB,null,4);
        fs.writeFileSync(path.resolve(__dirname,"./users.json"),jsonUsers);
    },
    findUser: (userData)=>{
        return currentDB.filter(user=>user.email==userData.email && bcryptjs.compareSync(userData.pass,user.pass))[0];
    },
    sharingAccount: (userData,userInv)=>{
        const trasnporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'caredlav@gmail.com',
                pass: 'mowvlxmholopjdtl'
            }
        });        
        let userToUpdate= currentDB.filter(user=>user.email==userData.email)[0];
        let userDBUpdated=currentDB.filter(user=>user.email!=userData.email);
        if(userToUpdate.limitInv>0){
            userToUpdate.limitInv-=1;   
            userToUpdate.usersInv.push(userInv);            
            if(Object.keys(userToUpdate.funds).length==1){
                userToUpdate.funds={
                    ...userToUpdate.funds,
                    user2: {
                        name: userInv,
                        amount: 0
                    }
                }
            }else if(Object.keys(userToUpdate.funds).length==2){
                userToUpdate.funds={
                    ...userToUpdate.funds,
                    user3: {
                        name: userInv,
                        amount: 0
                    }
                }
            }                              
        }
        userDBUpdated.push(userToUpdate);
        let jsonUsers=JSON.stringify(userDBUpdated,null,4);
        fs.writeFileSync(path.resolve(__dirname,"./users.json"),jsonUsers);
        return trasnporter;
    },
    submitPay: (payData,userInSession)=>{
        let newPay={
            accountID: userInSession.id,
            compromiso: {
                invoice: newInvoice(),
                debe: {
                    name: payData.userOwes,
                    amount: parseInt(payData.amount) 
                },
                esperando: {
                    name: payData.userWaiting
                },
                nota: {
                    razon: payData.note,
                    fecha: payData.date
                },
                status: "pendiente"
            }
        }
        currentPaysDB.push(newPay);
        let jsonPays=JSON.stringify(currentPaysDB,null,4);
        fs.writeFileSync(path.resolve(__dirname,"./pays.json"),jsonPays);

        let userToUpdate= currentDB.filter(user=>user.id==userInSession.id)[0];
        let userDBUpdated=currentDB.filter(user=>user.id!=userInSession.id);
        if(userToUpdate.funds.user1.name===payData.userOwes){        
            userToUpdate.funds.user1.amount-=payData.amount            
        }else if(userToUpdate.funds.user2.name===payData.userOwes){
            userToUpdate.funds.user2.amount-=payData.amount
        }else{
            userToUpdate.funds.user3.amount-=payData.amount
        }
        userDBUpdated.push(userToUpdate);
        let jsonUsers=JSON.stringify(userDBUpdated,null,4);
        fs.writeFileSync(path.resolve(__dirname,"./users.json"),jsonUsers);
    },
    payDues: (dueInfo,userInSession)=>{
        let userToUpdate =currentDB.filter(user=>user.id==userInSession.id)[0];
        let userDBUpdated=currentDB.filter(user=>user.id!=userInSession.id);
        let payToUpdate=currentPaysDB.filter(pay=>pay.accountID==userInSession.id && pay.compromiso.invoice==dueInfo.invoice)[0];
        let payDBUpdated=currentPaysDB.filter(pay=>pay.compromiso.invoice!=dueInfo.invoice);
        if(userToUpdate.funds.user1.name===dueInfo.debedor){            
            userToUpdate.funds.user1.amount+=parseInt(dueInfo.pago);
            if(userToUpdate.funds.user1.amount==0){
                payToUpdate.compromiso.status="saldado";
            }else{
                payToUpdate.compromiso.debe.amount-=dueInfo.pago;
            }
        }else if(userToUpdate.funds.user2.name===dueInfo.debedor){
            userToUpdate.funds.user2.amount+=parseInt(dueInfo.pago);
            if(userToUpdate.funds.user2.amount==0){
                payToUpdate.compromiso.status="saldado";
            }else{
                payToUpdate.compromiso.debe.amount-=dueInfo.pago;
            }
        }else{
            userToUpdate.funds.user3.amount+=parseInt(dueInfo.pago);
            if(userToUpdate.funds.user3.amount==0){
                payToUpdate.compromiso.status="saldado";
            }else{
                payToUpdate.compromiso.debe.amount-=dueInfo.pago;
            }
        }
        userDBUpdated.push(userToUpdate);
        payDBUpdated.push(payToUpdate);
        let jsonUsers=JSON.stringify(userDBUpdated,null,4);
        let jsonPays=JSON.stringify(payDBUpdated,null,4);
        fs.writeFileSync(path.resolve(__dirname,"./users.json"),jsonUsers);
        fs.writeFileSync(path.resolve(__dirname,"./pays.json"),jsonPays);
    },
    getPaysInDB: (userInfo)=>{
        return currentPaysDB.filter(info=>info.accountID==userInfo.id);
    },
    getInfoDue: (invoice)=>{
        return currentPaysDB.filter(info=>info.compromiso.invoice==invoice)[0];
    },
    getUsersUsingAccount: (info)=>{
        return currentDB.filter(users=>users.id==info.id)[0];
    },
    checkEmailIfExist: (info)=>{
        return currentDB.filter(user=>user.email==info.email)[0].email;
    }
}

module.exports = userModel;