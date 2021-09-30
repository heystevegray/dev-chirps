/*
The onReadStream function (which is called from within
readNestedFileStreams) will convert each Upload stream into a buffer,
and then return a new Promise containing the concatenated buffers
when all of the data has been consumed from the stream. 
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
*/
const readNestedFileStreams = async (variables) => {
	const variableArray = Object.entries(variables || {});

	for (const [imageFileKey, imageFileValue] of variableArray) {
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

export { readNestedFileStreams };
