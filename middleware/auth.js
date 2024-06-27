// 
const jwt = require("jsonwebtoken");
const UserModel = require('../model/users');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
            console.log(authHeader);
     
        if (!authHeader) {
            return res.status(401).send("Authorization header missing");
        }

        const token = authHeader.replace("Bearer ", "");
         
        if (!token) {
            return res.status(401).send("Token not found");
        }

        let verifyUser;
        try {
            verifyUser = jwt.verify(token, "shaka");
        } catch (error) {
            return res.status(401).send("Invalid token");
        }

        const user = await UserModel.findOne({ _id: verifyUser._id }).select({ Password: 0, tokens: 0 });
        if (!user) {
            return res.status(404).send("User not found");
        }
        console.log(user);
        req.userData = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = auth;
