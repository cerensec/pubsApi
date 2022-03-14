const bcrypt = require('bcrypt');
const saltRounds = 10;
 
module.exports = (_db)=>{
    db = _db;
    return UserModel;
}

class UserModel {
    static saveOneUser(req){
        console.log("Body",req.body)
        return bcrypt.hash(req.body.password, saltRounds)
        .then((hash)=>{
        let sql = 'INSERT INTO users(address,city,creationTimestamp,email,firstName,lastName,password,phone,role,uuid,zip) VALUES (?,?,NOW(),?,?,?,?,?,"user",NULL,?)'
        return db.query(sql,[req.body.address,req.body.city,req.body.email,req.body.firstName,req.body.lastName,hash,req.body.phone,req.body.zip])
        .then((res)=>{return res})
        .catch((err)=>{return err})
        })
        .catch(err=>console.log("Error hashing the password: ",err))
	}
	
	static getUserByEmail(email){
        let sql = 'SELECT * FROM users WHERE email = ?'
        return db.query(sql,[email])
        .then((res)=>{return res})
        .catch((err)=>{return err})
    }
	
	static getOneUser(id) {
        let sql = 'SELECT * FROM users WHERE id = ?';
        return db.query(sql,[id])
        .then((res)=>{return res})
        .catch((err)=>{return err})
	}
	
	static updateUuid(id, uuid){
        let sql = 'UPDATE users set uuid = ? WHERE id = ?'
        return db.query(sql,[uuid,id])
        .then((res)=>{return res})
        .catch((err)=>{return err})	    
	}
}