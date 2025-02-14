const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Socket = require('./socket')
const cors = require("cors")
class Server {
    constructor(){
        this.app=express()
        this.port=process.env.PORT
        this.server = http.createServer(this.app)
        this.io = socketio(this.server,{

        } );
    }
    middleware(){
        this.app.use(express.static(path.resolve( __dirname ,"../../public")))
        this.app.use(cors())
    }
    excecute(){
        this.middleware()
        this.configurarSocket()
        this.server.listen(this.port, () => {
            console.log("server corriendo en el puerto " + this.port)
        });
    }
    configurarSocket(){
        new Socket(this.io)
    }

}

module.exports = Server