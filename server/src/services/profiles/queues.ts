import { QueueMessage } from 'rsmq'
import { redisSMQ } from '../../config/redis'
import Queue from '../../lib/Queue'

export const initDeleteAccountQueue = async () => {
	const deleteAccountQueue = new Queue(redisSMQ, 'account_deleted')
	await deleteAccountQueue.createQueue()
	return deleteAccountQueue;
}

export const initDeleteProfileQueue = async () => {
	const deleteProfileQueue = new Queue(redisSMQ, 'profile_deleted')
	await deleteProfileQueue.createQueue()
	return deleteProfileQueue;
}

export const onDeleteAccount = (payload: QueueMessage) => {
	console.log(JSON.parse(payload.message));
}