const express = require('express')

const app = express();
const corn=require('cors')

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(corn())
const port = 3001

const router =require('./router/auth-router')
app.use('/',router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))