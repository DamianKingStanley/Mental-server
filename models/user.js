import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    userId: { type: String },
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    university: { type: String, required: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    profilePicture: { type: String },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
}, {
    timestamps: true,
});

export default mongoose.model("user", userSchema);