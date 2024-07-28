import mongoose from "mongoose"

export const connectDb = async () =>{
    if(mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        }).then(()=>{
            console.log('mongodb connected');
        }).catch(()=>{
            console.log('mongodb faild!!');
        })
    } catch (error) {
        console.log(error,'mogodb connection');
        throw new Error("throw mogodb connection error")
    }
}