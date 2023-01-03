import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  socialOnly: { type: Boolean, default: false },
  avartar: { type: String },
  email: { type: String, unique: true, required: true },
  username: { type: String , unique: true, required: true},
  name: { type: String, required: true },
  password: { type: String },
  location: { type: String }
})

userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 5)
})

const userModel = mongoose.model('User', userSchema)
export default userModel