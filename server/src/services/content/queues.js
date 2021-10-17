import { redisSMQ } from "../../config/redis";
import Queue from "../../lib/Queue";
import Post from "../../models/Post";
import Reply from "../../models/Reply";
import {
	deleteUserUploads,
	deleteUserUploadsDir,
} from "../../lib/handleUploads";

export const initDeleteProfileQueue = async () => {
	const deleteProfileQueue = new Queue(redisSMQ, "profile_deleted");
	await deleteProfileQueue.createQueue();
	return deleteProfileQueue;
};

export const onDeleteProfile = async (payload) => {
	const { authorProfileId } = JSON.parse(payload.message);
	await Post.deleteMany({ authorProfileId }).exec();
	await Reply.deleteMany({ authorProfileId }).exec();
	await deleteUserUploads(authorProfileId);
	await deleteUserUploadsDir(authorProfileId);
};
