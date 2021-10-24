import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import Pagination from "../../../lib/Pagination";
import { deleteUpload, uploadStream } from "../../../lib/handleUploads";
import getProjectionFields from "../../../lib/getProjectionFields";

class ContentDataSource extends DataSource {
	constructor({ Post, Profile, Reply }) {
		super();
		this.Post = Post;
		this.Profile = Profile;
		this.Reply = Reply;
		this.postPagination = new Pagination(Post);
		this.replyPagination = new Pagination(Reply);
	}

	/*
	 * We pass in fewer options to uploadStream here than we did when uploading the avatar
	 * previously because we don’t need to standardize the size, name, or file format of
	 * the image. And because we don’t specify a public_id in the options, when the image
	 * is uploaded to Cloudinary it will be assigned a random name (which is fine for all
	 * non-avatar images).
	 *
	 * Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
	 */
	async uploadMedia(media, profileId) {
		if (media.buffer.data) {
			const buffer = Buffer.from(media.buffer.data);
			const uploadedMedia = await uploadStream(buffer, {
				folder: `${process.env.NODE_ENV}/${profileId}`,
				sign_url: true,
				type: "authenticated",
			}).catch((error) => {
				throw new Error(
					`Failed to upload media to the content service. ${error.message}`
				);
			});

			return uploadedMedia.secure_url;
		}

		return "";
	}

	getPostById(id, info) {
		const projection = getProjectionFields(info, this.Post.schema);
		return this.Post.findById(id).select(projection);
	}

	async getPosts(
		{ after, before, first, last, orderBy, filter: rawFilter },
		info
	) {
		let filter = {};
		// parse the "raw" filter argument into something MongoDB can use
		if (rawFilter && rawFilter.followedBy) {
			const profile = await this.Profile.findOne({
				username: rawFilter.followedBy,
			}).exec();

			if (!profile) {
				throw new UserInputError(
					"User with that username cannot be found."
				);
			}

			filter.authorProfileId = {
				$in: [...profile.following, profile._id],
			};

			if (rawFilter && rawFilter.includeBlocked === false) {
				filter.blocked = { $in: [null, false] };
			}
		}

		// Parse the orderBy enum into something MongoDB can use
		const sort = this._getContentSort(orderBy);
		const queryArgs = { after, before, first, last, filter, sort };

		// Get the edges and page info
		const projection = getProjectionFields(info, this.Post.schema);
		const edges = await this.postPagination.getEdges(queryArgs, projection);
		const pageInfo = await this.postPagination.getPageInfo(
			edges,
			queryArgs
		);

		return { edges, pageInfo };
	}

	async getOwnPosts(
		{ after, before, first, last, orderBy, authorProfileId },
		info
	) {
		const sort = this._getContentSort(orderBy);
		const filter = { authorProfileId };
		const queryArgs = { after, before, first, last, filter, sort };
		const projection = getProjectionFields(info, this.Post.schema);
		const edges = await this.postPagination.getEdges(queryArgs, projection);
		const pageInfo = await this.postPagination.getPageInfo(
			edges,
			queryArgs
		);

		return { edges, pageInfo };
	}

	async createPost({ media, text, username }) {
		const profile = await this.Profile.findOne({ username }).exec();

		if (!profile) {
			throw new UserInputError(
				"You must provide a valid username as the author of this post."
			);
		}

		let uploadedMediaUrl;

		if (media) {
			uploadedMediaUrl = await this.uploadMedia(media, profile._id);
		}

		const newPost = new this.Post({
			...(uploadedMediaUrl && { media: uploadedMediaUrl }),
			authorProfileId: profile._id,
			text,
		});
		return newPost.save();
	}

	async deletePost(id) {
		const deletedPost = await this.Post.findByIdAndDelete(id).exec();

		if (!deletedPost) {
			throw new UserInputError("The provided post id does not exist.");
		}

		const { media } = deletedPost;

		if (media) {
			await deleteUpload(media);
		}

		return deletedPost._id;
	}

	async searchPosts({ after, first, searchString }, info) {
		const sort = { score: { $meta: "textScore" }, _id: -1 };
		const filter = {
			$text: { $search: searchString },
			blocked: { $in: [null, false] },
		};
		const queryArgs = { after, first, filter, sort };
		const projection = getProjectionFields(info, this.Post.schema);
		const edges = await this.postPagination.getEdges(queryArgs, projection);
		const pageInfo = await this.postPagination.getPageInfo(
			edges,
			queryArgs
		);

		return { edges, pageInfo };
	}

	async togglePostBlock(id) {
		const post = await this.Post.findById(id).exec();

		if (!post) {
			throw new UserInputError("Post with that id cannot be found.");
		}

		const currentBlockedStatus =
			post.blocked === undefined ? false : post.blocked;

		return this.Post.findOneAndUpdate(
			{ _id: id },
			{ blocked: !currentBlockedStatus },
			{ new: true }
		);
	}

	getReplyById(id, info) {
		const projection = getProjectionFields(info, this.Reply.schema);
		return this.Reply.findById(id).select(projection);
	}

	async getReplies(
		{ after, before, first, last, orderBy, filter: rawFilter },
		info
	) {
		const { to, from } = rawFilter;

		if (!to && !from) {
			throw new UserInputError(
				"You must provide a username to get replies to or from."
			);
		} else if (to && from) {
			throw new UserInputError(
				"You may only provide a `to` or `from` argument."
			);
		}

		let filter = {};
		const profile = await this.Profile.findOne({
			username: from || to,
		}).exec();

		if (!profile) {
			throw new UserInputError(
				"User with that username cannot be found."
			);
		}

		if (from) {
			filter.authorProfileId = profile._id;
		} else {
			filter.postAuthorProfileId = profile._id;
		}

		const sort = this._getContentSort(orderBy);
		const queryArgs = { after, before, first, last, filter, sort };
		const projection = getProjectionFields(info, this.Reply.schema);
		const edges = this.replyPagination.getEdges(queryArgs, projection);
		const pageInfo = await this.replyPagination.getPageInfo(
			edges,
			queryArgs
		);

		return { edges, pageInfo };
	}

	async getOwnReplies(
		{ after, before, first, last, orderBy, authorProfileId },
		info
	) {
		const sort = this._getContentSort(orderBy);
		const filter = { authorProfileId };
		const queryArgs = { after, before, first, last, filter, sort };
		const projection = getProjectionFields(info, this.Reply.schema);
		const edges = await this.replyPagination.getEdges(
			queryArgs,
			projection
		);
		const pageInfo = await this.replyPagination.getPageInfo(
			edges,
			queryArgs
		);

		return { edges, pageInfo };
	}

	async getPostReplies(
		{ after, before, first, last, orderBy, postId },
		info
	) {
		const sort = this._getContentSort(orderBy);
		const filter = { postId };
		const queryArgs = { after, before, first, last, filter, sort };
		const projection = getProjectionFields(info, this.Reply.schema);
		const edges = await this.replyPagination.getEdges(
			queryArgs,
			projection
		);
		const pageInfo = await this.replyPagination.getPageInfo(
			edges,
			queryArgs
		);

		return { edges, pageInfo };
	}

	async createReply({ media, postId, text, username }) {
		const post = await this.Post.findById(postId).exec();
		const profile = await this.Profile.findOne({ username }).exec();

		if (!profile) {
			throw new UserInputError(
				"You must provide a valid username as the author of this reply."
			);
		} else if (!post) {
			throw new UserInputError(
				"You must provide a valid parent post ID for this reply."
			);
		}

		let uploadedMediaUrl;

		if (media) {
			uploadedMediaUrl = await this.uploadMedia(media, profile._id);
		}

		const newReply = new this.Reply({
			...(uploadedMediaUrl && { media: uploadedMediaUrl }),
			authorProfileId: profile._id,
			text,
			postId,
			postAuthorProfileId: post.authorProfileId,
		});

		return newReply.save();
	}

	async deleteReply(id) {
		const deleteReply = await this.Reply.findByIdAndDelete(id).exec();

		if (!deleteReply) {
			throw new UserInputError("The provided reply id does not exist.");
		}

		const { media } = deleteReply;

		if (media) {
			await deleteUpload(media);
		}

		return deleteReply._id;
	}

	async toggleReplyBlock(id) {
		const reply = await this.Reply.findById(id).exec();

		if (!reply) {
			throw new UserInputError("Reply with that id cannot be found.");
		}

		const currentBlockedStatus =
			reply.blocked === undefined ? false : reply.blocked;

		return this.Reply.findOneAndUpdate(
			{ _id: id },
			{ blocked: !currentBlockedStatus },
			{ new: true }
		);
	}

	_getContentSort(sortEnum) {
		let sort = {};

		if (sortEnum) {
			const sortArgs = sortEnum.split("_");
			const [field, direction] = sortArgs;
			sort[field] = direction === "DESC" ? -1 : 1;
		} else {
			sort.createdAt = -1;
		}

		return sort;
	}
}

export default ContentDataSource;
