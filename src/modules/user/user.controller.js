import { Router } from "express";
import { confirmEmail, login, sign_up, resetPassword, uploadImageCover, forgotPassword } from "./user.sevices.js";
import { validation } from "../../middleware/validation.js";
import { confirmSchema, forgetPasswordSchema, resetPasswordSchema, sign_inSchema, sign_upSchema } from "./user.validation.js";
import { multerHost } from "../../middleware/multer.js";
import { auth } from "../../middleware/authentecation.js";

const userRouter = Router()
userRouter.post('/signUp', validation(sign_upSchema), sign_up)
userRouter.post('/login', validation(sign_inSchema), login)
userRouter.patch('/confirmEmail', validation(confirmSchema), confirmEmail)
userRouter.post('/forgotPassword', validation(forgetPasswordSchema), forgotPassword)
userRouter.post('/resetPassword', validation(resetPasswordSchema), resetPassword)
userRouter.patch('/uploadImageCover', auth, multerHost(['image/jpeg', 'image/jpg', 'image/png']).single('imageCover'), uploadImageCover)


export default userRouter