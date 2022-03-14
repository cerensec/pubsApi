const withAuth = require('../withAuth');
module.exports = (app, db)=>{
	const PubModel = require('../models/PubModel')(db)
	
	//route de récupération de tous les pub
	app.get('/api/pub',withAuth, async(req,res,next)=>{
        let pubs = await PubModel.getAllPub();
        if(pubs.code){
            res.json({status:500,msg:"Error getting the pubs"})
        }
        res.json({status:200,msg:"Pubs retrieved",pubs:pubs})
    })
	    
	//route de récupération d'un pub par son id
	app.get('/api/pub/:id',withAuth, async(req,res,next)=>{
        let pub = await PubModel.getOnePub(req.params.id);
        if(pub.code){res.json({status:500,msg:"Error getting your pub"})}
        res.json({status:200,msg:"Pub retrieved",pub:pub})
    })
	
	//route de récupération des pub par l'user_id (ses pubs à lui)
	app.get('/api/pubByUser/:id',withAuth, async(req,res,next)=>{
        let pubs = await PubModel.getAllPubByUser(req.params.id);
        if(pubs.code){res.json({status:500,msg:"Error getting the pubs for the user"})}
        res.json({status:200,msg:"Pubs retrieved",pubs:pubs})
    })
	
	//route d'ajout d'un pub
	app.post('/api/pub/save',withAuth, async(req,res,next)=>{
        console.log(req)
        let pub = await PubModel.saveOnePub(req);
        if(pub.code){
            res.json({status:500, msg:"Error creating the user"})
        }
        res.json({status:200, msg:"Pub saved !"})
    })
	
	//route de modification d'un pub
	app.put('/api/pub/update/:id',withAuth,async(req,res,next)=>{
        console.log(req)
        let pub = await PubModel.updatePub(req, req.params.id);
        if(pub.code){
            res.json({status:500,msg:"Error updating the pub"})
        }
        res.json({status:200, msg:"Pub updated !"})

    })
	
	//route de suppression d'un pub
	app.delete('/api/pub/delete/:id',async(req,res,next)=>{
        let pub = await PubModel.deletePub(req.params.id);
        if(pub.code){res.json({status:500,msg:"Error deleting the pub"})}
        res.json({status:200,msg:"Pub deleted"})

    })
	
	//route de récupération d'un pub par rapport au filtres choisis pas l'user
	app.post('/api/pub/getPubWithFilters', withAuth, async(req,res,next)=>{
        let pubs = await PubModel.getPubByFilters(req);
        if(pubs.code){res.json({status:500,err:pubs})}
        res.json({status:200,msg:"Pubs retrieved",pubs:pubs});
    })
	
	
}
	    