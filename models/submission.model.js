import mongoose from "mongoose"

const SubmissionSchema = new mongoose.Schema({
    problemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "problems",
        required: [true, "Problem ID is required"]
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    language:{
        type: String,
        required:[true,"language is Required"],
        enum: ["cpp", "python", "java", "javascript"]
    },
    
    code:{
        type: String,
        required:[true,"code is Required"],
    },

    verdict:{
        type: String,
        enum: ["Pending", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error"],
        default: "Pending"
    },

    executionTime:{
        type: Number,
        default: 0
    },

    testCasesPassed:{
        type: Number,
        default: 0
    }
},
{ timestamps: true })

const submissionModel = mongoose.model("submissions", SubmissionSchema);

export default submissionModel;