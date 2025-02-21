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
                const { nombre, usuario, password } = data
                const user = this.lista.addUser(nombre, usuario, password, socket.id) 
                this.io.emit("catidad-de-connectados", this.lista.getUsers().length)
                console.log(user.usuario)
                socket.emit("dato-del-usuario", user)
                //console.log(this.lista.getUsers())
            })
            socket.on("disconnect", () => {
                this.lista.removeUser(socket.id);
                console.log(`Usuario desconectado: ${socket.id}`);
                this.io.emit("catidad-de-connectados", this.lista.getUsers().length); // Enviar lista actualizada
            });

            this.io.emit("catidad-de-connectados", this.lista.getUsers().length); // Enviar lista actualizada

            socket.on("añadir-sala", (data) => {
                console.log(data)
                this.salas.añadirCola(data);
                setTimeout(() => {
                    this.salas.eliminarUsuarios(data)
                }, 5000);
                if (this.salas.cola.length >= 2) {  // Verifica correctamente la longitud de la cola
                    const { user1, user2, nuevaBatalla } = this.salas.crearBatalla();  // Obtiene los jugadores de la batalla
                    console.log("Empezó la batalla");
                    // Enviar evento a ambos jugadores
                    this.io.to(user1.idSocket).emit("comenzar-batalla", { mensaje: "¡La batalla ha comenzado!", jugadores: [user1, user2], idBatalla: nuevaBatalla.id });
                    this.io.to(user2.idSocket).emit("comenzar-batalla", { mensaje: "¡La batalla ha comenzado!", jugadores: [user1, user2], idBatalla: nuevaBatalla.id });
                }
            });
            socket.on("nuevo-movimiento", (data) => {
                console.log("Movimiento recibido:", data);
                const { idBatalla, index, usuario } = data;

                this.salas.addMovimiento(idBatalla, index, usuario.name);
                const { user1, user2 } = this.salas.getBatalla(idBatalla);

                const esTurnoUser1 = usuario.idSocket=== user1.idSocket;

                // Alternar turnos correctamente
                this.io.to(user1.idSocket).emit("turno", { turno: !esTurnoUser1 });
                this.io.to(user2.idSocket).emit("turno", { turno: esTurnoUser1 });

                // Enviar el movimiento a ambos jugadores
                this.io.to(user1.idSocket).emit("movimiento-realizado", { index, usuario });
                this.io.to(user2.idSocket).emit("movimiento-realizado", { index, usuario });
            });

            socket.on("batalla-ganada", (data) => {
                console.log("batalla-ganada:", data);
                const { idBatalla, usuario } = data;
                const { user1, user2 } = this.salas.getBatalla(idBatalla);
                if(usuario.idSocket === user1.idSocket){
                    this.salas.resolverBatalla(idBatalla,user1.id,user2.id)
                }else{
                    this.salas.resolverBatalla(idBatalla,user2.id,user1.id)
                }
                this.io.to(user1.idSocket).emit("ganador", { usuario });
                this.io.to(user2.idSocket).emit("ganador", { usuario });
            });


        });
    }
}
module.exports = Socket


