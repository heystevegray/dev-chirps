import auth0 from '../../config/auth0'

const resolvers = {
	Account: {
		__resolveReference(reference, context, info) {
			return auth0.getUser({ id: reference.id })
		}
	},
	Query: {
		account(parent, { id }, context, info) {
			return auth0.getUser({ id })
		},
		accounts(parent, { id }, context, info) {
			return auth0.getUsers()
		},
		viewer(parent, args, { user }, info) {
			if (user && user.sub) {
				return auth0.getUser({ id: user.sub })
			}
			return null
		}
	}
}


export default resolvers