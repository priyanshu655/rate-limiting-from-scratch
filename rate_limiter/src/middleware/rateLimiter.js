import TokenBucket from "../TokenBucket.js";
import metrics from "../bucketStore.js";
import plans from "../plans.js";
const buckets =new Map();

 const rateLimiter=(req,res,next)=>{
    const key=req.headers["x-api-key"]||req.ip;
    if(!buckets.has(key)){
        if(req.headers["x-plan"]=="pro"){
            buckets.set(key,new TokenBucket(plans.pro.capacity))
        }else{
             buckets.set(key,new TokenBucket(5,1));
        }
       
    }
    const bucket=buckets.get(key);
    bucket.lastSeen=Date.now();
    const allowed=bucket.consume();
    console.log({
        key,
        tokens:bucket.tokens
    })
    if(!allowed){
        metrics.blocked++;
        return res.status(429)
        .json({
            error:"Too Many Requests"
        })
    }
    metrics.allowed++;
    next();
}

export  {rateLimiter,buckets};