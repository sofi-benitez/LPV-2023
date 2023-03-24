const { json } = require("sequelize");
const {sequelize} = require("../../connection");

const listar = async function(req, res) {
    console.log("listar usuarios");
    try {
        const users = await sequelize.query("SELECT * FROM users Where deleted IS false");
        console.log("users",users);
        if(users && users[0]){
            res.json({
                success : true,
                usuarios : users[0]
            });
        }else{
            res.json({
                success : true,
                usuarios : []
            });
        }
    } catch(error) {
        res.json({
            success : false,
            error : error.message
        });
    }
};

const Consultarid = async function(req, res) {
    console.log("listar usuarios");
    try {
        const users = await sequelize.query(`SELECT * 
                                            FROM users 
                                            Where id = ${req.params.id}
                                            and deleted IS false`);
        console.log("users",users);
        if(users && users[0] && users[0][0]){
            res.json({
                success : true,
                usuario : users[0][0]
            });
        }else{
            res.json({
                success : true,
                usuario : null //porque no existe
            });
        }
    } catch(error) {
        res.json({
            success : false,
            error : error.message
        });
    }
};

const actualizar = async function(req, res) {
    console.log("actualizar usuarios");

    let usuariosRetorno = null;
    const data = req.body;
    const id = req.body.id;
    
    let userExiste = null;
    try {
        if(id){
            userExiste = await sequelize.query("SELECT * FROM users WHERE id = "+ id);
        }
        if (userExiste && userExiste[0][0] && userExiste[0][0].id) {
            //Confirma que el usuario existe y actualiza
            const retornoUpdate = await sequelize.query(`UPDATE users SET
                                                    name      = '${data.name}',
                                                    last_name = '${data.last_name}',
                                                    avatar    = '${data.avatar}',
                                                    email     = '${data.email}',
                                                    password  = '${data.password}',
                                                    deleted   = '${data.deleted}'
                                                    WHERE id = ${id}`);
            usuariosRetorno = await sequelize.query("SELECT * FROM users WHERE id = " + userExiste[0][0].id);
            usuariosRetorno = usuariosRetorno[0][0];
            //res.send("actualizado usuario");
        } else {
            //agg sino
            const retornInsert = await sequelize.query(`INSERT INTO users (name, last_name, avatar, email, password, deleted)
                                                        VALUES ('${data.name}', '${data.last_name}', '${data.avatar}', '${data.email}', '${data.password}', false) 
                                                        RETURNING id`);
            usuariosRetorno = await sequelize.query("SELECT * FROM users WHERE id = " + retornInsert[0][0].id);
            usuariosRetorno = usuariosRetorno[0][0];
            //res.send("Nuevo usuario");
        }
        res.json({
            success : true,
            user : usuariosRetorno
        });
    } catch(error) {
        res.json({
            success : false,
            error : error.message
        });
    }
};

const eliminar = async function(req, res) {
    console.log("eliminar usuarios");
    try{
        await sequelize.query("UPDATE users SET deleted = true WHERE id = " + req.params.id);
        res.json({
            success : true
        });
        //res.send("Usuario eliminado");
    } catch(error) {
        res.json({
            success : false,
            error : error.message
        });
    }
    
};


module.exports = {
    listar, Consultarid, actualizar, eliminar
};