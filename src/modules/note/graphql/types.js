import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

const ImageCoverType = new GraphQLObjectType({
  name: 'UserImageCover',
  fields: () => ({
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  }),
});

const OtpType = new GraphQLObjectType({
  name: 'UserOtp',
  fields: () => ({
    type: { type: GraphQLString },
    code: { type: GraphQLString },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString },
    gender: { type: GraphQLString },
    confirmed: { type: GraphQLBoolean },
    imageCover: { type: ImageCoverType },
    otp: { type: OtpType },
  }),
});

export const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    _id:{type:GraphQLID},
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    user: { type: UserType },
  }),
});
