const { v4 : uuidv4 } =require("uuid")
class Batallas{
    constructor(user1, user2){
        this.id= uuidv4()
        this.user1= user1
        this.user2= user2
        this.movimientos=[]
    }
}
module.exports = Batallas