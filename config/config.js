import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_DB){
    throw new Error("Mongo URI is not defined");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET  is not defined");
}

const config = {
    MONGO_DB: process.env.MONGO_DB,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config;