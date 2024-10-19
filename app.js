const app = require('express')();
const http = require('http').Server(app)

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://vishalbaghel:vishalbaghel@cluster0.og0w5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const User = require('./scr/modals/user')

http.listen(3000,function(){
    console.log("Server is running")
})