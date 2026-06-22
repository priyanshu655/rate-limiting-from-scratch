class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate;
        this.lastRefillTime = Date.now();
        this.lastSeen=Date.now();
    }

    refill() {
        const now = Date.now();

        const elapsedTime =
            now - this.lastRefillTime;

        const tokensToAdd =
            Math.floor(elapsedTime / 1000) *
            this.refillRate;

        if (tokensToAdd > 0) {
            this.tokens = Math.min(
                this.capacity,
                this.tokens + tokensToAdd
            );

            this.lastRefillTime = now;
        }
    }

    consume() {
        this.refill();

        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }

        return false;
    }
}

// const bucket = new TokenBucket(5, 1);

// for (let i = 1; i <= 7; i++) {
    // if(i>5){
    //     setTimeout(()=>{
    //          console.log(
    //     `Request ${i}:`,
    //     bucket.consume()
    // );
    //     },i*500);
    // }else{
    //       console.log(
    //     `Request ${i}:`,
    //     bucket.consume()
    // );
    // }

//     console.log(
//         `Request ${i}:`,
//         bucket.consume()
//     )
// }

export default TokenBucket;