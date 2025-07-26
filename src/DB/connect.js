import mongoose from "mongoose"

const connection=async()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/routeTask').then(()=>{
        console.log('connected');
        
    }).catch(()=>{
        console.log('failed');
        
    })
}
export default connection