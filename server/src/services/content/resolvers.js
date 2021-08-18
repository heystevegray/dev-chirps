import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
	DateTime: DateTimeResolver,
	Post: {
		author(post, args, content, info) {
			return { __typename: "Profile", id: post.authorProfileId };
		},
		id(post, args, context, info) {
			return post._id;
		},
		isBlocked(post, args, context, info) {
			return post.blocked;
		},
		posts(profile, args, { dataSources }, info) {
			return dataSources.contentAPI.getOwnPosts({
				...args,
				authorProfileId: profile.id,
			});
		},
	},
	Query: {
		post(parent, { id }, { dataSources }, info) {
			return dataSources.contentAPI.getPostById(id);
		},
		posts(parent, args, { dataSources }, info) {
			return dataSources.contentAPI.getPosts(args);
		},
	},
};

export default resolvers;
