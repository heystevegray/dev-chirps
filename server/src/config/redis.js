import redis from "redis";
import RedisSMQ from "rsmq";

const host = process.env.REDIS_HOST_ADDRESS;
const port = Number(process.env.REDIS_PORT);

const client = redis.createClient({ host, port });

client.on("Connect", () => {
	console.log(`Redis connection is ready | http://${host}:${port}/`);
});

client.on("error", (error) => {
	console.log("Redis connection error:", error);
});

export const redisSMQ = new RedisSMQ({ client, ns: "rsmq", host, port });
