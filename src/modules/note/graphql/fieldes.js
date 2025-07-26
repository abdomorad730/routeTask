import { GraphQLList } from "graphql";
import { getAllNotes } from "./resolve.js";
import { NoteType } from "./types.js";

export const noteQuery={
    getAllNotes:{
        type:new GraphQLList(NoteType),
        resolve:getAllNotes
    }
}