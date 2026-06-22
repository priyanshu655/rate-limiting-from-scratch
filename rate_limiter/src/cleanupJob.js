import { buckets } from "./middleware/rateLimiter.js";

const TEN_MINUTES=10*1000;

setInterval(()=>{
    const now=Date.now();
    console.log("Running cleanup...");
    for(const[ip,bucket] of buckets.entries()){
        const inActiveTime=now-bucket.lastSeen;
        if(inActiveTime>TEN_MINUTES){
            buckets.delete(ip);

            console.log(`Deleted bucket for ${ip}`)
        }
    }
},60000)