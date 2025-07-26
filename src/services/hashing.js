import { compareSync, hashSync } from "bcrypt"

 export const hash = (plainText,saltRound)=>{
    return hashSync(plainText,saltRound)
}
export const verify =  (plainText,hashed)=>{
    return compareSync(plainText,hashed)
}