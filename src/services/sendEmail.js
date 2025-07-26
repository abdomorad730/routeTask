import { EventEmitter } from 'events';
import { customAlphabet } from 'nanoid';
import userModel from '../DB/models/user.model.js';
import { hash } from './hashing.js';
import { sendEmail } from '../utils/sendEmail.js';

export const eventEmitter = new EventEmitter();

const generateOTP = () => customAlphabet('123456789', 4)();

const handleOtpEvent = async (email, type) => {
  try {
    const otpCode = generateOTP();
    const hashedCode = hash(otpCode, parseInt(process.env.SALT_ROUNDS));
    const customOtp = { type, code: hashedCode };

    const user = await userModel.findOneAndUpdate(
      { email },
      { otp: customOtp },
      { new: true }
    );

    if (!user) {
      console.warn(`User not found for ${type} OTP event: ${email}`);
      return;
    }

    const emailSent = await sendEmail(email, otpCode);
    if (!emailSent) {
      console.error(`Failed to send ${type} OTP email to ${email}`);
    }

  } catch (error) {
    console.error(`Error handling ${type} OTP event for ${email}:`, error.message);
  }
};

eventEmitter.on('sendEmail', async ({ email }) => {
  await handleOtpEvent(email, 'email');
});

eventEmitter.on('forgetPassword', async ({ email }) => {
  await handleOtpEvent(email, 'password');
});
