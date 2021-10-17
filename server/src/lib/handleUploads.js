import cloudinary from "../config/cloudinary";

/*
The onReadStream function (which is called from within
readNestedFileStreams) will convert each Upload stream into a buffer,
and then return a new Promise containing the concatenated buffers
when all of the data has been consumed from the stream.

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
*/
const onReadStream = (stream) => {
	return new Promise((resolve, reject) => {
		let buffers = [];
		stream.on("error", (error) => reject(error));
		stream.on("data", (data) => buffers.push(data));
		stream.on("end", () => {
			const contents = Buffer.concat(buffers);
			resolve(contents);
		});
	});
};

/*
The readNestedFileStreams function will check the variables sent with the
mutation, look for Upload promises to resolve, call any resolved object’s
createReadStreams method, convert the file stream into a buffer, and then
add the buffer and the original filename and MIME type back to the
variables object.

Now that we have intercepted any initial Upload promises and resolved
them in the gateway the avatar field’s data will have the following shape
in the updateProfile mutation arguments when they reach the profiles
service:

{
  buffer: {
    type: "Buffer",
    data: [ ... ]
  },
  encoding: "7bit",
  filename: "avatar.png",
  mimetype: "image/png"
}

Note that this function will process any deeply nested Upload promises within the mutation variables object 
by checking if a given value is another object and recursively calling readNestedFileStreams on it.

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
*/
const readNestedFileStreams = async (variables) => {
	let variableArray = [];

	if (variables && variables.data) {
		variableArray = Object.entries(variables.data);
	}

	for (const [imageFileKey, imageFileValue] of variableArray) {
		if (Boolean(imageFileValue && imageFileValue.file)) {
			const { createReadStream, encoding, filename, mimetype } =
				await imageFileValue.file;

			const readStream = createReadStream();
			const buffer = await onReadStream(readStream);
			variables["data"][imageFileKey] = {
				buffer,
				encoding,
				filename,
				mimetype,
			};
		}

		/*
			 * TODO: I'm not sure if this is doing anything now that I changed the code above?

			 * The structure I'm getting after adding `app.use(graphqlUploadExpress())` to the
			 * server/src/index.js file is this:
			 *
			 * file: { filename: 'cors.png', mimetype: 'image/png', encoding: '7bit', createReadStream: ƒ, capacitor: WriteStream }
			 * promise: Promise {[[PromiseState]]: 'fulfilled', [[PromiseResult]]: {…}}
			 * resolve: ƒ()
			 * reject: ƒ()
			 *
			 * I'm able to upload the entire file, and I'm not sure if checking for imageFileValue.constructor.name === "Object"
			 * will still work as expected and call this function recursively. Leaving this here, but need to test this more.
			 */
		if (
			imageFileValue !== null &&
			imageFileValue.constructor.name === "Object"
		) {
			await readNestedFileStreams(imageFileValue);
		}
	}
};

/*
The uploadStream function has two parameters. The options parameter is an object that we hand
off to Cloudinary’s upload_stream method to configure options such as the path of a
subdirectory to save the uploaded image in the Media Library. The options object may also
contain and any transformations to apply to the image on upload. The buffer parameter is passed
into the returned stream’s end method to write the buffer before closing the stream.

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
*/
export function uploadStream(buffer, options) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(options, (error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result);
			})
			.end(buffer);
	});
}

/*
Above, we use the cloudinary.api.delete_resources method and extract
the public_id from the image URL to pass into it in an array (we could
pass multiple public IDs inside this array if needed). We also set
some options in a second object argument to invalidate the image on
the CDN and to set the type to authenticated explicitly (otherwise
the deletion will not work).

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
*/

export const deleteUpload = (url) => {
	// Extract the public_id from the image URL
	const public_id = url.split("/").slice(-3).join("/").split(".")[0];

	return new Promise((resolve, reject) => {
		cloudinary.api.delete_resources(
			[public_id],
			{ invalidate: true, type: "authenticated" },
			(error, result) => {
				if (error) {
					return reject(error);
				}

				resolve(result);
			}
		);
	});
};

/*
Now we’ll turn our attention to deleting all of a user’s content images and custom avatar image if they delete 
their account. Doing so will require two steps — first, we must delete all of the images inside of the user’s designated 
subdirectory in Cloudinary, and then we need to delete the now-empty directory itself. Unfortunately, at this time there 
is no way to complete both actions at once with Cloudinary’s APIs because a directory must first be emptied before it can
be programmatically removed from the Media Library.

The deleteUserUploads function will take care of the first step, using a method from the Cloudinary Admin API called
cloudinary.api.delete_resources_by_prefix. This method provides a convenient way to bulk-delete a user’s images based
on the current environment and the user’s profile document ID because the “prefix” is the custom subdirectory portion
of the image’s public ID (for example, development/5d52d6ccbae12121ef58944e).

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
*/
export function deleteUserUploads(profileId) {
	const prefix = `${process.env.NODE_ENV}/${profileId}`;

	return new Promise((resolve, reject) => {
		cloudinary.api.delete_resources_by_prefix(
			prefix,
			{ invalidate: true, type: "authenticated" },
			(error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result);
			}
		);
	});
}

// https://cloudinary.com/documentation/admin_api#delete_folder
export async function deleteUserUploadsDir(profileId) {
	return new Promise((resolve, reject) => {
		cloudinary.api.delete_folder(
			`${process.env.NODE_ENV}/${profileId}`,
			{ invalidate: true, type: "authenticated" },
			(error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result);
			}
		);
	});
}

export { readNestedFileStreams };
