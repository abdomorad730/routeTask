import { GraphQLBoolean, GraphQLObjectType, GraphQLSchema } from "graphql";
import { noteQuery } from "./note/graphql/fieldes.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'query',
        fields: noteQuery
    })
})