const { isObject } = require("@apollo/gateway/dist/utilities/predicates");

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

Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
*/
const readNestedFileStreams = async (variables) => {
	const variableArray = Object.entries(variables || {});
	console.log({ variableArray });

	for (const [imageFileKey, imageFileValue] of variableArray) {
		if (imageFileValue instanceof Promise) {
			// this is a file upload!
			console.log({ imageFileValue });
		}

		if (
			Boolean(imageFileValue && typeof imageFileValue.then === "function")
		) {
			const { createReadStream, encoding, filename, mimetype } =
				await imageFileValue;

			const readStream = createReadStream();
			const buffer = await onReadStream(readStream);
			variables[imageFileKey] = { buffer, encoding, filename, mimetype };
		}

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
const uploadStream = (buffer, options) => {
	return new Promise((reject, resolve) => {
		cloudinary.uploader
			.upload_stream(options, (error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result);
			})
			.end(buffer);
	});
};

export { readNestedFileStreams, uploadStream };
