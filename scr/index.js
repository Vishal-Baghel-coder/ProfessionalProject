import connectDB from "./db/index.js";
import {app} from './app.js'


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at part : ${process.env.PORT}`)
    })
    app.on("error",(error)=>{
        console.log("Error: ",error);
        throw error
    })
})
.catch((err)=>{
    console.log("Mongo db connection failed !!!",err)
})