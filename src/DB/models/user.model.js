import mongoose from "mongoose";
import { hash } from "../../services/hashing.js";
import { encrypt } from "../../services/crypto.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, minLength: 3, maxLength: 50 },
  email: { type: String, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  confirmed: { type: Boolean, default: false },
  phone: { type: String, match: /^(\+201|01)[0-2,5]{1}[0-9]{8}/, required: true },
  imageCover: {
    secure_url: String,
    public_id: String
  },
  otp: {
    type: { type: String, enum: ['email', 'password'] },
    code: { type: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hash(this.password, parseInt(process.env.SALT_ROUNDS));
  }

  if (this.isModified('phone')) {
    this.phone = encrypt(this.phone, process.env.ENCRYPT_KEY);
  }

  next();
});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;
