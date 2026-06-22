import express from "express";
import "dotenv/config";
import {rateLimiter} from "./middleware/rateLimiter.js"
import { buckets } from "./middleware/rateLimiter.js";
import metrics from "./bucketStore.js";
import "./cleanupJob.js"
const app=express();

const PORT=8080;

app.get("/api/data",rateLimiter,(req,res)=>{
    res.json({
    success:true
    })
})
app.get("/debug",(req,res)=>{

    const data = [];

    buckets.forEach(
        (bucket,ip)=>{
            data.push({
                ip,
                tokens:bucket.tokens
            });
        }
    );

    res.json(data);
});

app.get("/metrics",(req,res)=>{
    res.json({
        allowed:metrics.allowed,
        blocked:metrics.blocked,
        activeBuckets:buckets.size
    })
});



app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
});