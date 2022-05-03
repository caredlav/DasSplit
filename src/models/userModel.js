const path = require('path');
const fs = require('fs');
const currentDB = JSON.parse(fs.readFileSync(path.resolve(__dirname,"./users.json")),"utf-8");

const newId = () => {
	let ultimo = 0;
	currentDB.forEach(user => {
		if (user.id > ultimo){
			ultimo = user.id;
		}
	});
	return ultimo + 1
}

const userModel={
    
    newUser: (user)=>{
        let createNewUser={
            id: newId(),
            name: user.userName,
            email: user.email,
            pass: user.pass
        };
        currentDB.push(createNewUser);
        let jsonUsers=JSON.stringify(currentDB,null,4);
        fs.writeFileSync(path.resolve(__dirname,"./users.json"),jsonUsers);
    },
    findUser: (userData)=>{
        return currentDB.filter(user=>user.email==userData.email && user.pass==userData.pass)[0];
    }
}

module.exports = userModel;