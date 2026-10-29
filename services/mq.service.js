import amqp from "amqplib";
import submissionModel from "../models/submission.model.js"
import problemModel from "../models/problem.model.js"
import { evaluateSubmission } from "./judge.service.js"

const RABBITMQ_URL = process.env.RABBITMQ_URL ||  "amqp://localhost:5672";
const QUEUE_NAME = "submission_queue";

let channel = null;

//connect to rabbitmq and create reusable channel

export async function connectRabbitMQ() {
    try{
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();


        //AssertQueue make sure queue exists  

        await channel.assertQueue(QUEUE_NAME, { durable:true });

        console.log("connected to RabbitMQ successfully");
    }

    catch{
        console.error("failed to connect to RabbitMQ:", error.message);
    }
}


//fucntion to push msg into the queue

export async function sendToQueue(message) {
    if(!channel){
        await connectRabbitMQ();
    }
      // RabbitMQ expects a Buffer, so we convert JSON -> string -> Buffer
    const messageBuffer = Buffer.from(JSON.stringify(message));
    // persistent: true saves the message to disk so it won't be lost if RabbitMQ restarts
    channel.sendToQueue(QUEUE_NAME, messageBuffer, { persistent: true });

}


//Consumer : Listen to the queue and process submission one by one 

export async function startConsumer() {

    if (!channel) await connectRabbitMQ();

    //Tells RabbitMQ: Give this worker only 1 Job at a time
    channel.prefetch(1);

    console.log(`Worker listening on "${QUEUE_NAME}"...`)

    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;
        // (Step 3: Processing code goes right here)
    });


}