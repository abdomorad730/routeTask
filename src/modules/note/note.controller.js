import { Router } from "express";
import { auth } from "../../middleware/authentecation.js";
import { validation } from "../../middleware/validation.js";
import { addNoteSchema } from "./note.validation.js";
import { addNote, deleteNote, summarizeNote } from "./note.services.js";

const noteRouter=Router()
noteRouter.post('',auth,validation(addNoteSchema),addNote)
noteRouter.delete('/:id' , auth,deleteNote)
noteRouter.post("/:id/summarize", auth, summarizeNote); 

export default noteRouter;