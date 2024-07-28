import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      // required: true,
      // unique: true,
    },
    isPatiant: {
      type: Boolean,
      default: false,
    },
    usertype: {
      type: String,
      required: true,
      default: "Patient",
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
