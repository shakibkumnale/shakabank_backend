
const  mongoose  = require("mongoose");
const jwt =require("jsonwebtoken");
const e = require("cors");
const userSchegma= new mongoose.Schema({
// accno:{
//     type:Number,
//     required:true

// },
// acctype:{
//     type:String,
//     required:true

// },
// pass:{ 
//     type:String,
//     required:true
// },

// branch:{ 
//     type:String,
//     required:true
// },
// balance:{
//     required:true,
//     type:Number
// },
// email:{ type:String,
//     required:true,
//     unique: true },

// fname:{ type:String,
//     required:true},

// lname:{ type:String,
//     required:true},

// mobile:{ type:String,
//     required:true,
//     unique:true},
Fname:{
    type:String,
    required:true

},
Lname:{
    type:String,
    required:true

},
Password:{ 
    type:String,
    required:true
},

City:{ 
    type:String,
    required:true
},

Email:{ type:String,
    required:true,
    unique: true
},

Phone:{ type:String,
    required:true,
    unique:true
},
DOB:{ type:String,
    require:true
   

},
Branch:{ 
    type:String
    // required:true
},
Balance:{
    // required:true,
    type:Number
},
    
Accno:{
    type:String
        
        // required:true
    
    },
acctype:{
        type:String
        // required:true
    
    },
    UPIID:{ type:String,
    // required:true
    },
tokens:[{
    token:{
    type:String
    // required:true
    }
}]
})


 userSchegma.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "shaka");
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (error) {
    return error;
        console.error("Error generating auth token:", error);
        // throw new Error("Error generating auth token");
   
    }
};
const User = new mongoose.model("user",userSchegma);
module.exports=User;
