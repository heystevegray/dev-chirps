import { redisSMQ } from "../../config/redis";
import Queue from "../../lib/Queue";

export const initDeleteAccountQueue = async () => {
	const deleteAccountQueue = new Queue(redisSMQ, "account_deleted");
	await deleteAccountQueue.createQueue();
	return deleteAccountQueue;
};
