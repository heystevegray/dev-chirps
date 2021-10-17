import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import gravatarUrl from "gravatar-url";
import Pagination from "../../../lib/Pagination";
import { uploadStream } from "../../../lib/handleUploads";

class ProfilesDataSource extends DataSource {
	constructor({ auth0, Profile }) {
		super();
		this.auth0 = auth0;
		this.Profile = Profile;
		this.pagination = new Pagination(Profile);
	}

	getProfile(filter) {
		return this.Profile.findOne(filter).exec();
	}

	async getProfiles({ after, before, first, last, orderBy }) {
		const sort = this._getProfileSort(orderBy);
		const queryArgs = { after, before, first, last, sort };
		const edges = await this.pagination.getEdges(queryArgs);
		const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

		return { edges, pageInfo };
	}

	getProfileById(id) {
		return this.Profile.findById(id);
	}

	async updateProfile(
		currentUsername,
		{ avatar, description, fullName, username }
	) {
		if (!avatar && !description && !fullName && !username) {
			throw new UserInputError(
				"You must supply some profile data to update."
			);
		}

		let uploadedAvatar;

		if (avatar) {
			const { _id } = await this.Profile.findOne({
				username: currentUsername,
			}).exec();

			if (!_id) {
				throw new UserInputError(
					"User with that username cannot be found."
				);
			}

			/*
			We explicitly set the public_id of the image to avatar because a random public_id
			will be assigned to the image if we don’t provide one. For this case, we give the
			image a set public_id because we want to make it easy to identify and overwrite
			this image the next time the user wants to update their avatar. The new avatar
			image also has two transformations applied to it by Cloudinary on upload—one to
			crop it to a 1:1 aspect ratio and another to resize the square image to have a
			width and height no larger than 400px.
			
			Lastly, we set sign_url to true and the type to authenticated to prevent
			unauthorized image transformation requests to Cloudinary without access to our API
			Secret. These options will insert a special signed portion into the image URL (for
			example, /s--fG4OpLPY--/) based on a hash of the image’s public_id, a special
			string describing any dynamic transformations, and our API Secret. The original
			image and any derivatives from dynamic transformations will only be delivered
			against a signed URL, and will therefor block unauthorized transformations.
			
			It’s important to note that “authenticated” does not mean that the uploaded images
			will only be available to users of our application who have authenticated with
			Auth0. With our current configuration, anyone who has the URL of the resource can
			access it.

			While this exposure is not ideal given that all other user content in our
			application requires an account to view it, this is a limitation of Cloudinary’s
			free tier. Cloudinary does provide ways to restrict outside access to images, but
			these features require a paid account. For an application such as this one, the
			referral-based whitelisting option would likely be best so that only requests
			originating from the application’s domain are permitted.
			
			Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
			*/
			if (avatar.buffer && avatar.buffer.data) {
				const buffer = Buffer.from(avatar.buffer.data);
				uploadedAvatar = await uploadStream(buffer, {
					folder: `${process.env.NODE_ENV}/${_id}`,
					format: "png",
					public_id: "avatar",
					sign_url: true,
					transformation: [
						{ aspect_ratio: "1:1", crop: "crop" },
						{ height: 400, width: 400, crop: "limit" },
					],
					type: "authenticated",
				})
					.then((result) => {
						return result;
					})
					.catch((error) => {
						if (error.message) {
							throw new Error(
								`Failed to upload profile picture. ${error.message}`
							);
						}
					});
			}
		}

		const data = {
			...(uploadedAvatar && { avatar: uploadedAvatar.secure_url }),
			...(description && { description }),
			...(fullName && { fullName }),
			...(username && { username }),
		};

		return this.Profile.findOneAndUpdate(
			{ username: currentUsername },
			data,
			{ new: true }
		);
	}

	async checkViewerFollowsProfile(viewerAccountId, profileId) {
		const viewerProfile = await this.Profile.findOne({
			accountId: viewerAccountId,
		}).exec();
		return viewerProfile.following.includes(profileId);
	}

	async createProfile(profile) {
		const account = await this.auth0.getUser({ id: profile.accountId });

		const { picture } = account;

		// Get the github profile image
		// Example: https://avatars2.githubusercontent.com/u/1518780?v=4
		if (picture && picture.includes("githubusercontent")) {
			profile.avatar = picture;
		} else {
			const avatar = gravatarUrl(account.email, { default: "mm" });
			profile.avatar = avatar;
		}

		const newProfile = new this.Profile(profile);
		return newProfile.save();
	}

	async deleteProfile(username) {
		const deletedProfile = await this.Profile.findOneAndDelete({
			username,
		}).exec();

		return deletedProfile._id;
	}

	followProfile(username, profileIdToFollow) {
		return this.Profile.findOneAndUpdate(
			{ username },
			{ $addToSet: { following: profileIdToFollow } },
			{ new: true }
		);
	}

	unfollowProfile(username, profileIdToUnfollow) {
		return this.Profile.findOneAndUpdate(
			{ username },
			{ $pull: { following: profileIdToUnfollow } },
			{ new: true }
		);
	}

	async getFollowedProfiles({
		after,
		before,
		first,
		last,
		orderBy,
		following,
	}) {
		const sort = this._getProfileSort(orderBy);
		const filter = { _id: { $in: following } };
		const queryArgs = { after, before, first, last, filter, sort };
		const edges = await this.pagination.getEdges(queryArgs);
		const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

		return { edges, pageInfo };
	}

	async searchProfiles({ after, first, searchString }) {
		const sort = { score: { $meta: "textScore" }, _id: -1 };
		const filter = { $text: { $search: searchString } };
		const queryArgs = { after, first, filter, sort };
		const edges = await this.pagination.getEdges(queryArgs);
		const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

		return { edges, pageInfo };
	}

	_getProfileSort(sortEnum) {
		let sort = {};

		if (sortEnum) {
			const sortArgs = sortEnum.split("_");
			const { field, direction } = sortArgs;
			sort[field] = direction === "DESC" ? -1 : 1;
		} else {
			// Sort by ascending username by default
			sort.username = 1;
		}

		return sort;
	}
}

export default ProfilesDataSource;
