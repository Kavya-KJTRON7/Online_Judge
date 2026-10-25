import problemModel  from "../models/problem.model.js";

export async function getAllProblems(req, res) {

    const problems = await problemModel.find({})
    res.status(200).json({problems})
}

export async function getProblemById(req, res) {

    const {id} = req.params
    const problem = await problemModel.findById(id)

    if(!problem){
        return res.status(404).json({
            message : "Problem not found"
        })
    }

    else{return res.status(200).json({ problem })}

}

export async function createProblem(req,res) {
    
    const { title, description, difficulty, 
            tags, testcases } = req.body;
    
    const problem = await problemModel.create({ 
        title, description, difficulty, tags, testcases });

    res.status(201).json({ 
        message: "Problem created successfully", 
        problem });
}

export async function updateProblem(req,res) {

    const { id } = req.params
    const problem = await problemModel.findByIdAndUpdate(
        id, req.body, { new: true, runValidators: true })

    if(!problem){
        return res.status(404).json({
            message: "problem not found"
        })
    }

    res.status(200).json({
        message:"Problem Updated",
        problem
    })
}

export async function deleteProblem(req,res) {
    
    const { id } = req.params
    const problem = await problemModel.findByIdAndDelete(id)

    if(!problem){
        return res.status(404).json({
            message: "problem not found"
        })
    }

    res.status(200).json({
        message:"Problem deleted successfully",
    })

}

