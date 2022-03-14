//installer dependence pour envoyer des push notif sur ton mobile!
const Expo = require("expo-server-sdk").default;
const expo = new Expo();

module.exports = (app, db)=>{
	//route d'envoi d'une push notification
	//installer dependence pour envoyer des push notif sur ton mobile!

const Expo = require("expo-server-sdk").default;
const expo = new Expo();

module.exports = (app, db)=>{
	//route d'envoi d'une push notification
	app.post('/api/notif', async (req, res, next)=>{
	    const token = req.body.token; //recup l'uuid (pas celui de connexion
	    console.log("token", token)
	    //si le token uuid n'est pas pas un token valide de expo
	   	if (!Expo.isExpoPushToken(token)) {
	            console.log("Token invalide");
	            res.json({ error: "Token invalide" });
	    } else {
	        //sinon c'est valide
	    	//on prépare les infos de la popup de notification à afficher (par défault ici)
	    	let messages = [
					            {
					                to: token,
					                sound: "default", 
					                body: req.body.msg,
					                data: { desDonnes: "datarazlekazelkzalekazle" }
					            }
					        ];	        
			//envoi la notification vers l'user
			expo
	            .sendPushNotificationsAsync(messages)
	            .then(ticket => {
	                console.log("Ticket recu : ", ticket);
	                res.json({ ticket: ticket });
	            })
	            .catch(err => {
	                console.log(" Erreur de notification ", err);
	                res.json({ error: err });
	            });
	        
	    }	    
	})
}
}