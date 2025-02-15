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
            if (user.estado) {
                return { mensaje: "Usuario ya está conectado" };
            }
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
        return this.users.find(user => user.id === idUser && user.estado === true);
    }    
    getUsers() {
        return this.users.filter(user=> user.estado === true);
    }

    usuarioGanador(idUser) {
        this.users = this.users.map(user => {
            if (user.id === idUser) {
                user.ganados = (user.ganados || 0) + 1;
            }
            return user;
        });
    }

    usuarioPerdedor(idUser) {
        this.users = this.users.map(user => {
            if (user.id === idUser) {
                user.perdidos = (user.perdidos || 0) + 1; 
            }
            return user;
        });
    }
    usuarioEmpate(idUser1, idUser2) {
        this.users = this.users.map(user => {
            if (user.id === idUser1 || user.id === idUser2) {
                user.empate= (user.empate || 0) + 1; 
            }
            return user;
        });
    }
    
}

module.exports = UserList;
