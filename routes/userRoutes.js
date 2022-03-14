const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const withAuth = require('../withAuth');
const secret = 'TemporalSecret';

module.exports = (app, db)=>{
	const UserModel = require('../models/UserModel')(db)

    //route d'ajout d'un utilisateur
    app.post('/api/user/save',async (req,res,next)=>{
        // we check if the email exists
        console.log(req.body)
        let email = await UserModel.getUserByMail(req.body.email)
        // if it doesn't 
        if(email.length > 0){
            res.json({status:500, msg:"This email is already in use"})
        }else{
            let user = await UserModel.saveOneUser(req);
            if(user.code){
                res.json({status:500, msg:"Error creating the user"})
            }
            res.json({status:200, msg:"User saved !"})
        }
    })
    
    
    //route de login de l'utilisateur
    app.post('/api/v1/user/login', async (req,  res, next)=>{
        let user = await UserModel.getUserByMail(req.body.email);
    	if(user.length === 0) {
    		res.json({status: 404, msg: "email inexistant dans la base de donnée"})
    	}
    	let same = await bcrypt.compare(req.body.password, user[0].password);
    	if(same) {
    	    let infos = {id: user[0].id, email: user[0].email}
    		let token = jwt.sign(infos, secret);

    		res.json({status: 200, msg: "connecté", token: token, user: user[0]})
    	    
    	}else{
    	    res.json({status: 401, msg: "mauvais mot de passe"})
    	}
    })
    //route de récupération d'un utilisateur par son id
    app.get('/api/user/:id', async(req,res,next)=>{
        let user = await UserModel.getOneUser(req.params.id);
        if(user.code){
            res.json({status:500,msg:"Error getting the user"});
        }
        res.json({status:200,msg:"User retrieved successfully",user:user[0]});
    })   
    
    //route de mise à jour du token de validation des notifs
    app.put('/api/user/updateNotifToken/:id',withAuth, async(req,res,next)=>{
        let update = await UserModel.updateUuid(req.params.id, req.body.uuid);
        if(user.code){
            res.json({status:500,msg:"Error updating the user Notification Token"})
        }
        res.json({status:200,msg:"Notification Token updated"})
    })  
}