const userController = require('../../controller/users/users.controller');

module.exports = function(app) {

    app.get("/users/list", userController.listar);
    app.get("/user/:id", userController.Consultarid);
    app.post("/users/update", userController.actualizar);
    app.post("/users/delete/:id", userController.eliminar);
    
}