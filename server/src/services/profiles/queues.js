import { redisSMQ } from "../../config/redis";
import Queue from "../../lib/Queue";
import Profile from "../../models/Profile";

export const initDeleteAccountQueue = async () => {
	const deleteAccountQueue = new Queue(redisSMQ, "account_deleted");
	await deleteAccountQueue.createQueue();
	return deleteAccountQueue;
};

export const initDeleteProfileQueue = async () => {
	const deleteProfileQueue = new Queue(redisSMQ, "profile_deleted");
	await deleteProfileQueue.createQueue();
	return deleteProfileQueue;
};

export const onDeleteAccount = async (payload, deleteProfileQueue) => {
	const { accountId } = JSON.parse(payload.message);
	const { _id } = await Profile.findOneAndDelete({ accountId }).exec();
	await Profile.updateMany({ $pull: { following: _id } }).exec();

	if (_id) {
		deleteProfileQueue.sendMessage(
			JSON.stringify({
				authorProfileId: _id,
			})
		);
	}
};
