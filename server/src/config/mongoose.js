import mongoose from "mongoose";

export default function () {
	const connectionUrl = process.env.MONGODB_URL;

	mongoose.connect(connectionUrl, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});

	mongoose.connection.on("connected", () => {
		console.log(
			`💾 Mongoose default connection is ready | ${connectionUrl}`
		);
	});

	mongoose.connection.on("error", (error) => {
		console.log("Mongoose default connection error:", error);
	});
}
