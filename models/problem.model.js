import mongoose from "mongoose"

const TestCaseSchema = new mongoose.Schema({
    input:{
        type: String,
        required:[true,"input field is required"],
    },

    expectedOutput:{
        type: String,
        required:[true,"expected output is required"],
    },

    isHidden:{
        type: Boolean,
        default: false
    }

},{_id:false})

const problemSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,"Title is Required"],
    },

    difficulty:{
        type: String,
        required:[true,"difficulty is Required"],
        enum: ["Easy", "Medium", "Hard"]
    },

    description:{
        type: String,
        required:[true,"Description is Required"],
    },

    tags:{
        type: [String],
        default: []
    },

    testcases:{
        type: [TestCaseSchema],
        default: []
    }


    
},{timestamps: true})


const problemModel = mongoose.model("problems", problemSchema)
export default problemModel;