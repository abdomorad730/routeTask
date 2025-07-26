import noteModel from "../../../DB/models/note.model.js"

export const getAllNotes=async(parent,args)=>{
    const notes = await noteModel.find({}).populate([{path:'user'}])
    return notes
}