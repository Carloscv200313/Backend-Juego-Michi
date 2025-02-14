const Batallas = require('./batallas');
class Salas {
    constructor(userListInstance) { // Recibe la instancia de UserList
        this.cola = [];
        this.lista = userListInstance; // Usa la misma instancia de UserList
        this.batallas = [];
    }

    añadirCola(id) {
        const usuario = this.lista.buscarUser(id);
        if (usuario && !this.cola.some(u => u.id === id)) { // Verifica duplicados
            this.cola.push(usuario);
        }
        return this.cola;
    }


    verCola() {
        return this.cola;
    }

    eliminarUsuarios(id) {
        this.cola = this.cola.filter(user => user.id !== id);
        return this.cola;
    }
    crearBatalla() {
        if (this.cola.length >= 2) {
            const user1 = this.cola.shift(); // Extrae el primer jugador
            const user2 = this.cola.shift(); // Extrae el segundo jugador
            const nuevaBatalla = new Batallas(user1, user2);
            console.log("id de la batalla ===="+nuevaBatalla.id)
            this.batallas.push(nuevaBatalla); // Agrega la batalla a la lista de batallas activas
            return { user1, user2, nuevaBatalla }
        }
    }
    verBatallas() {
        return this.batallas;
    }
    getBatalla(id) {
        return this.batallas.find(batalla => batalla.id === id) || null;
    }
    addMovimiento(id, movimiento , user) {
        const batalla = this.getBatalla(id);
        if (batalla) {
            batalla.movimientos.push({user,movimiento});
        } else {
            console.error(`No se encontró la batalla con ID: ${id}`);
        }
    }
    resolverBatalla(batalla, resultado) {
        // resultado debe ser un objeto con { ganador: id, perdedor: id, empate: boolean }
        this.batallas = this.batallas.filter(b => b !== batalla); // Remueve la batalla resuelta
    }
}

module.exports = Salas;
