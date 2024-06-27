
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://stkbantai1:atWq8c3OFXEp85yp@cluster0.4bzmrka.mongodb.net/ShakaBank?retryWrites=true&w=majority&appName=Cluster0",{

// useNewUrlParser:true
// useUnifiedTopology:true,
// useCreateIndex:true
}).then(()=>{
    console.log("connected")
}).catch((e)=>{
    console.log(e)
})
