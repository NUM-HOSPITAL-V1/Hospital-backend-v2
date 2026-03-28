import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    phoneNumber: { type: String },
  },
  { discriminatorKey: "role", timestamps: true }
);

const User = model("User", UserSchema);
export default User;
