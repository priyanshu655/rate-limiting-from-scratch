export const consumeToken = (bucket) => {
    const now = Date.now();

    const elapsed =
        now - bucket.lastRefillTime;

    const tokensToAdd =
        Math.floor(elapsed / 1000) *
        bucket.refillRate;

    if (tokensToAdd > 0) {
        bucket.tokens = Math.min(
            bucket.capacity,
            bucket.tokens + tokensToAdd
        );

        bucket.lastRefillTime = now;
    }

    if (bucket.tokens > 0) {
        bucket.tokens--;
        return true;
    }

    return false;
};