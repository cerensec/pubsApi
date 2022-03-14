const express = require('express');
const app = express();

const mysql = require('promise-mysql');
const cors = require('cors');
app.use(cors());


// parse url's
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'));

// middleware: control of the access of the different routes depending if he's logged in or not (withAuth.js)
// const withAuth = require('./withAuth');
// withAuth();

// if the api is online we load it, if not we use the local one
if(!process.env.HOST_DB){
    var config = require('./configLocal');
}else{
    var config = require('./config');
}

// we get all the routes
const userRoutes = require('./routes/userRoutes');
const pubRoutes = require('./routes/pubRoutes')

// DB connection 
const host = process.env.HOST_DB || config.db.host;
const database = process.env.DATABASE_DB || config.db.database;
const user = process.env.USER_DB || config.db.user;
const password = process.env.PASSWORD_DB || config.db.password;
const port = process.env.PORT_DB || config.db.port;

mysql.createConnection({
    host: host,
	database: database,
	user: user,
	password: password
})
.then((db)=>{
    console.log('Connected to db');
    setInterval(async function(){
        let res = await db.query('SELECT 1');
    },10000);

    app.get('/',(req,res,next)=>{
        res.json({status:200, results:"Welcome to the api !"})
    })

    // all the routes are in the modules
    userRoutes(app,db);
	pubRoutes(app,db)

})
.catch(err=>console.log("Error connecting to db",err))

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Listening port "+PORT+" all is ok")
})