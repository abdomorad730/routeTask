import CryptoJS from "crypto-js";
export const encrypt =(plainText,key)=>{
    return CryptoJS.AES.encrypt(plainText, key).toString();
}
export const decrypt =(plainText,key)=>{
    return CryptoJS.AES.decrypt(plainText, key).toString(CryptoJS.enc.Utf8);
}
