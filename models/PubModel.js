module.exports = (_db)=>{
    db = _db;
    return PubModel;
}

class PubModel {
    
    static saveOnePub(req){
        let sql = 'INSERT INTO pub (name, address, zip, city, lat, lng, lange, poussette, jeux, terrasse, creationTimestamp, user_id, description) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),?,?)'
        return db.query(sql,[req.body.name,req.body.address,req.body.zip,req.body.city,req.body.lat,req.body.lng,req.body.lange,req.body.poussette,req.body.jeux,req.body.terrasse,req.body.user_id,req.body.description])
        .then((res)=>{return res})
        .catch((err)=>{return err})        
    }    
    static getAllPub() {
        let sql = 'SELECT * FROM pub'
        return db.query(sql,[])
        .then((res)=>{return res})
        .catch((err)=>{return err}) 
    }
    
    static getOnePub(id) {
        let sql = 'SELECT * FROM pub WHERE id = ?'
        return db.query(sql,[id])
        .then((res)=>{return res})
        .catch((err)=>{return err})
    }
    
    static getAllPubByUser(user_id) {
        let sql = 'SELECT * FROM pub WHERE user_id = ?'
        return db.query(sql,[user_id])
        .then((res)=>{return res})
        .catch((err)=>{return err})
        
    }
    
    static updatePub(req, id){
        let sql = 'UPDATE pub SET address = ?, city = ?, description = ?, jeux = ?, lange = ?, lat = ?, lng = ?, name = ?, poussette = ?, terrasse = ?, user_id = ?, zip = ? WHERE id = ?'
        return db.query(sql,[req.body.address,req.body.city,req.body.description,req.body.jeux,req.body.lange,req.body.lat,req.body.lng,req.body.name,req.body.poussette,req.body.terrasse,req.body.user_id,req.body.zip,id])
        .then((res)=>{return res})
        .catch((err)=>{return err})
    }
    
    static deletePub(id) {
        let sql = 'DELETE FROM pub WHERE id = ?'
        return db.query(sql,[id])
        .then((res)=>{return res})
        .catch((err)=>{return err})
    }
    
    static async getPubByFilters(req) {
        const conditions = [];

        const {
        lange, terrasse, poussette, jeux, lat, lng, distance,
        } = req.body;

        // a partir du moment ou on réceptionne une des 4 valeurs cochées on va préparer
        // une condition where pour notre requête SQL

        // si l'utilisateur a coché l'option lange
        if (lange) {
        conditions.push("lange = 1");
        }

        // si l'utilisateur a coché l'option terrasse
        if (terrasse) {
        conditions.push("terrasse = 1");
        }

        // si l'utilisateur a coché l'option poussette
        if (poussette) {
        conditions.push("poussette = 1");
        }

        // si l'utilisateur a coché l'option jeux
        if (jeux) {
        conditions.push("jeux = 1");
        }

        // requête de l'espace de récupération d'annonces
        // par rapport à la position de l'utilisateur et sur un rayon autour de lui
        const sql = `SELECT 
        id, name, description, address, zip, city, lange, poussette, jeux, terrasse, lat, lng,
        (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance
        FROM pub
        WHERE ${conditions.join(" AND ")}
        HAVING distance < ?
        ORDER BY distance`;

        return db.query(sql,[parseFloat(req.body.lat), parseFloat(req.body.lng),parseFloat(req.body.lat),distance])
        .then((pub)=>{return pub})
        .catch((err)=>{return err})
    }
    
}