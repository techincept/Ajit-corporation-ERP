const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./DB.js');

const server = express();
server.use(cors());
server.use(express.json());

server.get("/",(req,res)=>{
    res.send("<h1>Server@Ajit Corporation ERP</h1>");
})

server.use('/api/ajit-corporation-ERP/v1',require('./routes/index.js'));

const PORT = process.env.PORT;
server.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
    connectDb(process.env.DB_URL);
})