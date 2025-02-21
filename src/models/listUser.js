const User = require("./user");

class UserList {
    constructor() {
        this.users = [ new User("Carlos", "sebas", "123", "12313123123"),new User("Jonatan", "jona", "123", "12313123123") ];
    }
    addUser(name, user, password, idSocket) {
        const existingUser = this.users.find(u => u.user === user && u.password === password);
        if (existingUser) {
            console.log(existingUser)
            // Si el usuario ya existe, solo actualiza su idSocket
            existingUser.idSocket = idSocket;
            existingUser.estado=true
            return { mensaje: "Usuario ya registrado, idSocket actualizado", usuario: existingUser };
        }
        // Si no existe, crea un nuevo usuario y agrégalo a la lista
        const newUser = new User(name, user, password, idSocket);
        this.users.push(newUser);
        return { mensaje: "Nuevo usuario registrado", usuario: newUser };
    }
    
    removeUser(idUser) {
        const user = this.users.find(user => user.idSocket === idUser);
        if (user) {
            setTimeout(() => {
                if (user.idSocket === idUser) {
                    user.estado = false;
                    console.log(`Usuario ${user.user} desconectado.`);
                }
            }, 2000);
        }
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
