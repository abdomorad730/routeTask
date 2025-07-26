import mongoose from "mongoose";

const noteSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true ,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const noteModel = mongoose.models.Note || mongoose.model('Note',noteSchema)
export default noteModel;