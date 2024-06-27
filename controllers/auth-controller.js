const corn=require('cors')
const express = require('express')

const app = express();
const jwt = require('jsonwebtoken')
require('../connection/connect')
const nodemailer = require("nodemailer");
const randomstring = require('randomstring');
const UserModel=require('../model/users');
const HistModel=require('../model/tansactionhis');
const auth = require('../middleware/auth');

app.use(corn())

const otps = {};
let tokeni
const transporter = nodemailer.createTransport({
    service:'gmail',
     auth: {
       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
       user: 'stkbantai1@gmail.com',
       pass: 'past password 16 '
     },
   });


// home logic
const home=async(req , res)=>{
    try {
        res.send('Hello Wold! dd');
    } catch (error) {
        console.log(error);
        
    }
}
const signup=async(req,res)=>{
    try {
        const { Fname, Lname, Email, DOB, Phone, Password, CPassword, City, Otp } = req.body;
  
        if (Otp === otps[Email]) {
            delete otps[Email];
            const user = new UserModel({
                Fname,
                Lname,
                Password,
                City,
                DOB: DOB.startDate.toString(),
                Email,
                Phone,
                Balance: 10000,
                Accno: parseInt("15001" + Phone),
                UPIID: Phone + "@shaka"
            });
  
            try {
                const token = await user.generateAuthToken();
                console.log(token);
                tokeni=token;
                // res.json({ message: "success", token });
                // If you want to set a cookie
                // res.cookie("jwt", token, {
                //     expires: new Date(Date.now() + 500000),
                //     httpOnly: true
                // });
            } catch (tokenError) {
                console.error("Error generating auth token:", tokenError);
                // res.status(500).json({ error: "Failed to generate auth token" });
                res.send(tokenError)
                return;
            }
  
            try {
                const created = await user.save();
                console.log("one");
                res.json({ message: "success", token:tokeni })
                // res.json({ message: "success", token }); // Already sending response after generating token
            } catch (saveError) {
              res.send(saveError)
              console.error("Error saving user:", saveError);
              return;
                // res.status(500).json({ error: "Failed to save user" });
            }
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.log("Error6:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        // res.send(error)
    }

}

const login=async(req,res)=>{
    try {
        const {Email,userPassword}=req.body;
       
    
        const userObj=await UserModel.findOne({Email});
      const {Password}=userObj;
    
    if(userPassword===Password){
      const token = await userObj.generateAuthToken();
      res.json({ message: "success", token })
    
    }else{
      console.log("wrong");
      // res.json({ message: "wrong password"})
      res.send("wrong")
    }
        
        
      } catch (error) {
        console.log(error);
        res.json({message:"user not exist"});
        
      }
    

}
const fetchhistory=async(req,res)=>{
    try {
        const {_id}=req.userData
        console.log(_id)
        const transactions = await HistModel.find({
          $or: [
            { sender: _id },
            { receiver: _id }
          ]
        }).select({_id:0})
        console.log(transactions)
        res.send(transactions)
      } catch (error) {
        res.send(error)
        
      }
      
}
const moneysend=async(req,res)=>{
    try {
    
 
        const {  Balance,Email}=req.userData
        
       
        const {ammount, methods, reciver}=req.body.details
       
        const sender= await UserModel.findOne({Email})
       //  const userObj=await UserModel.findOne({UPIID:reciver});
       const dyquery = {};
       
       
       dyquery[methods] = reciver;
       
       console.log(dyquery)
       const userObj= await UserModel.findOne(dyquery)
       console.log(dyquery);
       
        console.log(userObj);
        console.log(req.body.details);
       
        const send =Email;
        const resv =userObj.Email;
       //  console.log(receiver)
       const Rname=userObj.Fname
        
        if(Balance>=parseInt(ammount) && send!==resv && parseInt(ammount)>0){
       const recbal=userObj.Balance+parseInt(ammount)
       const sendbal=sender.Balance-parseInt(ammount)
       await UserModel.updateOne({Email:send}, { Balance:sendbal});
       await UserModel.updateOne({Email:resv}, { Balance:recbal});
       await userObj.save();
       await sender.save();
       const date = new Date();
       
       const options = {
         hour: '2-digit',
         minute: '2-digit',
         day: 'numeric',
         month: 'short',
       }
       console.log(ammount)
       const time= date.toLocaleString('en-US', options).replace(',', '');
       const history = new HistModel({
       mode:methods,
       ammount:ammount,
       time:time,
       sender:sender._id,
       receiver:userObj._id,
       sendername:sender.Fname,
       receivername:userObj.Fname
       });
       receivername:await history.save();
       res.json({message: "success",Rname})
        }else{
         
         res.send("no money")
       
        }
       
       
       } catch (error) {
         console.log(error)
         res.send("user not found")
           
       }
       
}
const  user=async(req,res)=>{
    if(!req.userData){
        return res.send({Email:"eeee"})
      }
      console.log(req.userData)
    
      res.send(req.userData)
}
const otp =async(req,res)=>{ 
    try {
        const {Email}=req.body;
    console.log(Email);
    const otp = randomstring.generate({ length: 6, charset: 'numeric' }); //online
    // const otp = "1";
    otps[Email]=otp;
  console.log(otps[Email]);
      var option ={
        from: "stkbantai1@gmail.com", // sender address
        to: Email, // list of receivers
        subject: "Hello ✔", // Subject line
        // text: ` your otp is ${otp} `, // plain text body
        
       
       html:`<!DOCTYPE html>
       <html lang="en">
         <head>
           <meta charset="UTF-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
           <meta http-equiv="X-UA-Compatible" content="ie=edge" />
           <title>Static Template</title>
       
           <link
             href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
             rel="stylesheet"
           />
         </head>
         <body
           style="
             margin: 0;
             font-family: 'Poppins', sans-serif;
             background: #ffffff;
             font-size: 14px;
           "
         >
           <div
             style="
               max-width: 680px;
               margin: 0 auto;
               padding: 5px 30px 60px;
               background: #f4f7ff;
               background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
               background-repeat: no-repeat;
               background-size: 800px 452px;
               background-position: top center;
               font-size: 14px;
               color: #434343;
             "
           >
             <header style="height: 130px;">
               <table style="width: 100%;">
                 <tbody>
                   <tr style="height: 160px;">
                     <td>
                       Shaka-bank
                     </td>
                     <td style="text-align: right;">
                       <span
                         style="font-size: 16px; line-height: 30px; color: #ffffff;"
                         >12 Nov, 2021</span
                       >
                     </td>
                   </tr>
                 </tbody>
               </table>
             </header>
       
             <main>
               <div
                 style="
                   margin: 0;
                   margin-top: 70px;
                   padding: 92px 30px 115px;
                   background: #ffffff;
                   border-radius: 30px;
                   text-align: center;
                 "
               >
                 <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                   <h1
                     style="
                       margin: 0;
                       font-size: 24px;
                       font-weight: 500;
                       color: #1f1f1f;
                     "
                   >
                     Your OTP
                   </h1>
                   <p
                     style="
                       margin: 0;
                       margin-top: 17px;
                       font-size: 16px;
                       font-weight: 500;
                     "
                   >
                    ${Email},
                   </p>
                   <p
                     style="
                       margin: 0;
                       margin-top: 17px;
                       font-weight: 500;
                       letter-spacing: 0.56px;
                     "
                   >
                     Thank you for choosing Shaka-Bank. Use the following OTP
                     to complete the registeration . OTP is
                     valid for 10 minutes only
                     <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                     Do not share this code with others, including AVAZ
                     employees.
                   </p>
                   <p
                     style="
                       margin: 0;
                       margin-top: 60px;
                       font-size: 40px;
                       font-weight: 600;
                       letter-spacing: 25px;
                       color: #ba3d4f;
                     "
                   >
                   ${otp}
                   </p>
                 </div>
               </div>
       
               <p
                 style="
                   max-width: 400px;
                   margin: 0 auto;
                   margin-top: 90px;
                   text-align: center;
                   font-weight: 500;
                   color: #8c8c8c;
                 "
               >
                 Need help? Ask at
                 <a
                   href="mailto: Example@gmail.com"
                   style="color: #499fb6; text-decoration: none;"
                   >AVAZ@gmail.com</a
                 >
                 or visit our
                 <a
                   href=""
                   target="_blank"
                   style="color: #499fb6; text-decoration: none;"
                   >Help Center</a
                 >
               </p>
             </main>
       
             <footer
               style="
                 width: 100%;
                 max-width: 490px;
                 margin: 20px auto 0;
                 text-align: center;
                 border-top: 1px solid #e6ebf1;
               "
             >
               <p
                 style="
                   margin: 0;
                   margin-top: 40px;
                   font-size: 16px;
                   font-weight: 600;
                   color: #434343;
                 "
               >
                 Shaka-Bank
               </p>
               <p style="margin: 0; margin-top: 8px; color: #434343;">
                1st Rabodi, Thane (West), 400601
               </p>
               <div style="margin: 0; margin-top: 16px;">
                 <a href="" target="_blank" style="display: inline-block;">
                   <img
                     width="36px"
                     alt="Facebook"
                     src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                   />
                 </a>
                 <a
                   href=""
                   target="_blank"
                   style="display: inline-block; margin-left: 8px;"
                 >
                   <img
                     width="36px"
                     alt="Instagram"
                     src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
                 /></a>
                 <a
                   href=""
                   target="_blank"
                   style="display: inline-block; margin-left: 8px;"
                 >
                   <img
                     width="36px"
                     alt="Twitter"
                     src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
                   />
                 </a>
                 <a
                   href=""
                   target="_blank"
                   style="display: inline-block; margin-left: 8px;"
                 >
                   <img
                     width="36px"
                     alt="Youtube"
                     src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
                 /></a>
               </div>
               <p style="margin: 0; margin-top: 16px; color: #434343;">
                 Copyright © 2022 Company. All rights reserved.
               </p>
             </footer>
           </div>
         </body>
       </html>
       `,
    // html body
      };
      transporter.sendMail(option,function(error,info){
        if(error){
              console.log(error);
             res.send(error);
        }else{
          console.log("gg");
             res.send("done");
        }

      })
    } catch (error) {
        res.send(error)
        
    }

}

module.exports={home,signup,login,otp,user,fetchhistory,moneysend}