import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
	DateTime: DateTimeResolver,
	Content: {
		__resolveType(content, context, info) {
			if (content.postId) {
				return "Reply";
			} else {
				return "Post";
			}
		},
	},
	Profile: {
		posts(profile, args, { dataSources }, info) {
			return dataSources.contentAPI.getOwnPosts(
				{ ...args, authorProfileId: profile.id },
				info
			);
		},
		replies(profile, args, { dataSources }, info) {
			return dataSources.contentAPI.getOwnReplies({
				...args,
				authorProfileId: profile.id,
			});
		},
	},
	Post: {
		author(post, args, context, info) {
			return { __typename: "Profile", id: post.authorProfileId };
		},
		id(post, args, context, info) {
			return post._id;
		},
		isBlocked(post, args, context, info) {
			return post.blocked;
		},
		replies(post, args, { dataSources }, info) {
			return dataSources.contentAPI.getPostReplies({
				...args,
				postId: post._id,
			});
		},
	},
	Reply: {
		author(reply, args, context, info) {
			return { __typename: "Profile", id: reply.authorProfileId };
		},
		id(reply, args, context, info) {
			return reply._id;
		},
		isBlocked(reply, args, context, info) {
			return reply.blocked;
		},
		post(reply, args, { dataSources }, info) {
			return dataSources.contentAPI.getPostById(reply.postId);
		},
		postAuthor(reply, args, { dataSources }, info) {
			return { __typename: "Profile", id: reply.postAuthorProfileId };
		},
	},
	Query: {
		post(parent, { id }, { dataSources }, info) {
			return dataSources.contentAPI.getPostById(id);
		},
		posts(parent, args, { dataSources }, info) {
			return dataSources.contentAPI.getPosts(args);
		},
		reply(parent, { id }, { dataSources }, info) {
			return dataSources.contentAPI.getReplyById(id);
		},
		replies(prate, args, { dataSources }, info) {
			return dataSources.contentAPI.getReplies(args);
		},
	},
	Mutation: {
		createPost(parent, { data }, { dataSources }, info) {
			return dataSources.contentAPI.createPost(data);
		},
		deletePost(parent, { where: { id } }, { dataSources }, info) {
			return dataSources.contentAPI.deletePost(id);
		},
	},
};

export default resolvers;
