const  mongoose  = require("mongoose");
const hisSchema=  new mongoose.Schema({
    mode:{
        type:String,
    required:true
    },
    ammount:{
        type:String,
        required:true
      
    },
    time:{
    type:String,
    required:true
    },
    sender:{
        type:String,
        required:true
    },
    sendername:{
        type:String,
        required:true
    },
    receivername:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    }
})
const Hist = new mongoose.model("tansactionhis",hisSchema);
module.exports=Hist;
