🚦 Redis Token Bucket Rate Limiter
Ever had an API crash because a single user decided to spam it with requests? Yeah, me too.

This is a distributed, production-ready Rate Limiter built with Node.js, Express.js, and Redis. It uses the classic Token Bucket algorithm to gracefully handle traffic spikes, support multiple user tiers (like Free and Pro), and scale seamlessly across multiple server instances.

✨ What's Inside?
⚡ Token Bucket Algorithm: A smooth, industry-standard approach to rate limiting.

🔥 Distributed by Default: Uses Redis, meaning your rate limits stay synced even if you're running 10 different Node.js instances.

🎯 Tiered Access: Built-in support for different subscription plans (e.g., Free vs. Pro) with varying limits.

⏳ Auto-Refill & Auto-Cleanup: Tokens replenish automatically, and Redis TTLs ensure your memory stays clean.

📊 Metrics Included: Track how many requests were allowed vs. blocked in real-time.

🛡️ HTTP 429 Protection: Automatically returns standard "Too Many Requests" errors with Retry-After headers.

🐳 Docker-Ready: Spin up the Redis dependency in seconds.

🏗️ Architecture at a Glance
Instead of keeping rate-limit data in local memory (which breaks the moment you add a second server), this system centralizes the state in Redis.

Plaintext
       [ Incoming API Request ]
                 │
                 ▼
      ( Express Middleware )
                 │
                 ▼
        [ Redis Storage ] ──▶ Checks Bucket Capacity
                 │        ──▶ Deducts Token (if available)
                 │        ──▶ Tracks Allowed/Blocked Metrics
                 ▼
    [ Passes or Blocks Request ]
🚀 Getting Started
Want to run this locally? It takes less than two minutes.

1. Clone the Repo
Bash
git clone <your-repository-url>
cd rate_limiter
2. Install Dependencies
Bash
npm install
3. Spin Up Redis (The Docker Way)
If you have Docker installed, this is the easiest way to get Redis running:

Bash
docker run -d --name redis-server -p 6379:6379 redis
4. Start the Server
Bash
npm run dev
🎮 How to Use It
The API acts differently depending on the user's "plan". You can simulate this by passing a simple x-plan header.

The "Free" Tier
Limited capacity. Perfect for public or unauthenticated users.
(Config: 5 max tokens, refills 1 token per interval)

HTTP
GET /api/data
x-plan: free
The "Pro" Tier
Generous limits for your paying users.
(Config: 50 max tokens, refills 10 tokens per interval)

HTTP
GET /api/data
x-plan: pro
📈 Standard Response Headers
Whether a request passes or fails, the API always tells the client where they stand:

HTTP
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
If they hit the limit, they get a 429 Too Many Requests with a Retry-After: 1 header.

🧠 How the "Token Bucket" Actually Works
If you're new to this algorithm, here's the TL;DR:

The Bucket: Every user gets a virtual "bucket" that can hold a maximum number of tokens.

The Cost: Every API request costs exactly 1 token.

The Refill: A background timer constantly drips new tokens into the bucket at a fixed rate.

The Catch: If the bucket is empty, the request is dropped (HTTP 429).

Visualized:

Plaintext
Bucket Capacity = 5

[●●●●●] -> Request #1 (Pass)
[●●●●○] -> Request #2 (Pass)
[●●●○○] -> Request #3 (Pass)

... user spams the endpoint ...

[○○○○○] -> Request #6 (BLOCKED! 🛑)
🛠️ Observability Endpoints
I've included a few handy routes to help you see what's happening under the hood.

Check Global Metrics:

HTTP
GET /metrics
JSON
{
  "allowed": 120,
  "blocked": 15
}
Check Your Specific Limits:

HTTP
GET /my-limit
JSON
{
  "plan": "free",
  "capacity": 5,
  "remaining": 3,
  "refillRate": 1
}
⚠️ Known Caveats & The Roadmap
This project is highly functional, but I'm always looking to improve it.

Right now, the token logic uses a GET -> MODIFY -> SET pattern in Redis. Under extreme concurrency, this can cause race conditions.

Next steps for this project:

[ ] Migrate to Redis Lua Scripts: This will make token consumption atomic, completely eliminating race conditions.

[ ] Add Redis Cluster support for enterprise-level scaling.

[ ] Package the middleware and publish it to NPM.

👨‍💻 About the Author
Patel Priyanshu

B.Tech Computer Science Engineering

I'm a Full Stack Developer deeply passionate about Backend Development, System Design, and building scalable APIs that don't break under pressure.

📄 License
This project is open-source and available under the MIT License. Feel free to fork it, break it, and make it your own!
