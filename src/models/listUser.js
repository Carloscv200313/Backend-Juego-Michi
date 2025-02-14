const User = require("./user");

class UserList {
    constructor() {
        this.users = [];
    }
    addUser(name, user , password , idSocket) {
        const newUser = new User(name, user, password, idSocket);
        this.users.push(newUser);
        return this.users;
    }
    loginUser(usuario, password, idSocket) {
        const user = this.users.find(user => user.user === usuario && user.password === password);
        if (user) {
            user.idSocket = idSocket;  
            user.estado = true
            return user;  
        }
        return { mensaje: "Usuario no encontrado" };
    }
    
    removeUser(idUser) {
        this.users.forEach(user => {
            if (user.id === idUser) {
                user.estado = false; 
            }
        });
    }    
    buscarUser(idUser) {
        return this.users.find(user => user.id === idUser); // Retorna un solo usuario o undefined
    }
    getUsers() {
        return this.users.filter(user=> user.estado === true); // Nombre corregido para reflejar que devuelve múltiples usuarios
    }

    ganados(idUser) {
        this.users = this.users.map(user => {
            if (user.id === idUser) {
                user.ganados = (user.ganados || 0) + 1; // Asegura que `ganados` existe
            }
            return user;
        });
    }

    perdidos(idUser) {
        this.users = this.users.map(user => {
            if (user.id === idUser) {
                user.perdidos = (user.perdidos || 0) + 1; // Asegura que `perdidos` existe
            }
            return user;
        });
    }
    
}

module.exports = UserList;
