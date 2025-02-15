const { v4 : uuidv4 } =require("uuid")
class User{
    constructor(name, user, password, idSocket){
        this.id= uuidv4();
        this.name = name;
        this.user= user;
        this.password= password;
        this.idSocket = idSocket; 
        this.estado= true
        this.ganados= 0
        this.perdidos= 0
        this.empate=0
    }
}
module.exports = User;