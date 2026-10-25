import jwt from "jsonwebtoken";
import config from "../config/config.js"

export function authemticate(req,res,next) {
    //get token from header

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401)/json({
            message: "Acess denied. No token Provided"
        });
    }

    // verify the token signature 
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    }

    catch(error){
        return res.status(401).json({
            message: "Invalid / Expired Token"
        });
    }

}