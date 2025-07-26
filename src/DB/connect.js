import mongoose from "mongoose"

const connection=async()=>{
    await mongoose.connect(process.env.URI).then(()=>{
        console.log('connected');
        
    }).catch(()=>{
        console.log('failed');
        
    })
}
export default connection