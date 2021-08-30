const typePolicies = {
	Profile: {
		fields: {
			following: {
				keyArgs: [],
			},
		},
		posts: {
			keyArgs: {},
		},
		replies: {
			keyArgs: [],
		},
	},
	Query: {
		fields: {
			posts: {
				keyArgs: ["filter"],
			},
		},
	},
};

export default typePolicies;
