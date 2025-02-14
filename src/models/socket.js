const UserList = require("./listUser");
const Salas = require("./sala-espera");
class Socket {
    constructor(io) {
        this.io = io
        this.lista = new UserList
        this.salas = new Salas(this.lista);
        this.socketEvents()
    }
    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log("connectadooo")
            socket.on("registrar", (data) => {
                console.log(data)
                this.lista.addUser(socket.id, data, socket)
                this.io.emit("catidad-de-connectados", this.lista.getUsers().length)
                socket.emit("dato-del-usuario", this.lista.buscarUser(socket.id))
                //console.log(this.lista.getUsers())
            })
            socket.on("disconnect", () => {
                this.lista.removeUser(socket.id);
                console.log(`Usuario desconectado: ${socket.id}`);
                this.io.emit("catidad-de-connectados", this.lista.getUsers().length); // Enviar lista actualizada
            });

            socket.on("añadir-sala", () => {
                this.salas.añadirCola(socket.id);
                if (this.salas.cola.length >= 2) {  // Verifica correctamente la longitud de la cola
                    const { user1, user2 ,nuevaBatalla} = this.salas.crearBatalla();  // Obtiene los jugadores de la batalla
                    console.log("Empezó la batalla");
                    // Enviar evento a ambos jugadores
                    this.io.to(user1.id).emit("comenzar-batalla", { mensaje: "¡La batalla ha comenzado!",jugadores:[ user1, user2] , idBatalla: nuevaBatalla.id  } );
                    this.io.to(user2.id).emit("comenzar-batalla", { mensaje: "¡La batalla ha comenzado!",jugadores:[ user1, user2] , idBatalla: nuevaBatalla.id});
                }
            });
            socket.on("nuevo-movimiento", (data) => {
                console.log("Movimiento recibido:", data);
                const { idBatalla, index, usuario } = data;
            
                this.salas.addMovimiento(idBatalla, index, usuario.id);
                const { user1, user2 } = this.salas.getBatalla(idBatalla);
            
                const esTurnoUser1 = usuario.id === user1.id;
            
                // Alternar turnos correctamente
                this.io.to(user1.id).emit("turno", { turno: !esTurnoUser1 });
                this.io.to(user2.id).emit("turno", { turno: esTurnoUser1 });
            
                // Enviar el movimiento a ambos jugadores
                this.io.to(user1.id).emit("movimiento-realizado", { index, usuario });
                this.io.to(user2.id).emit("movimiento-realizado", { index, usuario });
            });
            
        });
    }
}
module.exports = Socket


