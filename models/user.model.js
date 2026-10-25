import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true,"UserName is Required"],
        unique:[true,"UserName must be unique"]
    },

    email:{
        type: String,
        required:[true,"email is Required"],
        unique:[true,"email must be unique"]
    },

    password:{
        type: String,
        required:[true,"password is Required"],
    }
})

const userModel = mongoose.model("users", userSchema)

export default userModel;