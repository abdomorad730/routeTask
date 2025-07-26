import Joi from "joi";

export const sign_upSchema = {
    body: Joi.object({
        name: Joi.string().min(3),
        password: Joi.string(),
        cPassword: Joi.string().valid(Joi.ref('password')),
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        gender: Joi.string().valid("male", "female"),
        phone: Joi.string().pattern(/^(\+201|01)[0-2,5]{1}[0-9]{8}/)
    }).options({ presence: 'required' }),
    imageCover:Joi.object()
}

export const confirmSchema ={
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
        code: Joi.string().length(4).required()
    })
}

export const sign_inSchema = {
    body:Joi.object({
        password: Joi.string(),
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    }).options({ presence: 'required' })
    
}



export const forgetPasswordSchema = {
    body:Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    }).options({ presence: 'required' })
    
}

export const resetPasswordSchema ={
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        code: Joi.string().length(4),
        password: Joi.string(),
        cPassword: Joi.string().valid(Joi.ref('password')),
    }).options({ presence: 'required' })
}




