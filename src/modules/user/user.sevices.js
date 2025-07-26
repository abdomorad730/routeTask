import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import { hash, verify } from "../../services/hashing.js";
import { eventEmitter } from "../../services/sendEmail.js";
import cloudinary from "../../services/cloudinary.js";

export const sign_up = async (req, res, next) => {
  try {
    const { name, email, password, cPassword, gender, phone } = req.body;

    if (password !== cPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    if (await userModel.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = hash(password, +process.env.SALT_ROUNDS);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
    });

    eventEmitter.emit('sendEmail', { email });

    return res.status(201).json({ msg: 'User created. Confirmation email sent.', user });
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await userModel.findOne({ email, confirmed: false });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!verify(code, user.otp.code)) {
      return res.status(409).json({ msg: 'Incorrect verification code' });
    }

    const newUser = await userModel.findOneAndUpdate(
      { email },
      { confirmed: true, otp: { exist: false } },
      { new: true }
    );

    return res.status(200).json({ msg: 'Email confirmed', newUser });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email, confirmed: true });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    eventEmitter.emit('forgetPassword', { email });

    return res.status(200).json({ msg: 'Reset code sent to email' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, password, cPassword } = req.body;
    const user = await userModel.findOne({ email, confirmed: true });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.otp.type !== 'password') {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    if (!verify(code, user.otp.code)) {
      return res.status(409).json({ msg: 'Wrong OTP code' });
    }

    if (password !== cPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    const hashedPassword = hash(password, +process.env.SALT_ROUNDS);

    const newUser = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword, $unset: { otp: 0 } },
      { new: true }
    );

    return res.status(200).json({ msg: 'Password reset successful', newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, confirmed: true });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (!verify(password, user.password)) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    const access_token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.TOKEN_KEY,
      { algorithm: 'HS256', expiresIn: '1d' }
    );

    return res.status(200).json({ msg: 'Login successful', access_token });
  } catch (error) {
    next(error);
  }
};

export const uploadImageCover = async (req, res, next) => {
  try {


    const user = await userModel.findOne({ email:req.user.email, confirmed: true });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: 'No image file provided' });
    }

    if (user.imageCover?.public_id) {
      await cloudinary.uploader.destroy(user.imageCover.public_id);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: 'route/imageCovers'
    });

    const newUser = await userModel.findOneAndUpdate(
      { email:req.user.email },
      { imageCover: { secure_url, public_id } },
      { new: true }
    );

    return res.status(200).json({ msg: 'Image uploaded', newUser });
  } catch (error) {
    next(error);
  }
};
