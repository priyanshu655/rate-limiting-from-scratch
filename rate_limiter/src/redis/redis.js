import {createClient} from "redis";

const redisClient=createClient({
    url:"redis://localhost:6379"
});

redisClient.on("error",(err)=>{
    console.log("Redis error : ",err);
})


await redisClient.connect();
 console.log("Redis connected");

 await redisClient.set("otp","12345",{
    EX:10,
})

console.log("otp stored");
const ttl=await redisClient.ttl("otp");
console.log("ttl:",ttl);

 export default redisClient;