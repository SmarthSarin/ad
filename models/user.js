import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  { 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true } // Ensures unique emails
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

export default models.User || model("User", userSchema);
