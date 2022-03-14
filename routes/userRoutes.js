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
    app.post('/api/user/login', async (req,res,next)=>{
        // we check if the user exists in the db
        let user = await UserModel.getUserByEmail(req.body.email);
        // if the response is an empty array it doesn't exists
        if(user.length === 0){
            // we send an error message saying that the user doesn't exists
            res.json({status:500, msg:"User not found"});
        }
        // we compare the passwords
        console.log("password",req.body.password)
        bcrypt.compare(req.body.password, user[0].password)
        .then((same)=>{
            console.log(same);
            // if they are the same
            if(same){
                res.json({status:200,msg:"Passwords match"})
            // else
            }else{
                // json negative response with 401 status with incorrect password
                res.json({status:500,msg:"Passwords don't match"})
            }   
        })              
    })

    
    //route de récupération d'un utilisateur par son id
    app.get('/api/user/:id', async(req,res,next)=>{
        let user = await UserModel.getOneUser(req.params.id);
        if(user.code){
            res.json({status:500,msg:"Error getting the user"});
        }
        res.json({status:200,msg:"User retrieved successfully",user:user});
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