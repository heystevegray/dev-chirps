import getToken from "../lib/getToken";

const copy = (data) => {
	const proc = require("child_process").spawn("pbcopy");
	proc.stdin.write(data);
	proc.stdin.end();
};

(async () => {
	const [email, password] = process.argv.slice(2);
	const access_token = await getToken(email, password).catch((error) => {
		console.error(error);
	});
	const token = `"Authorization": "Bearer ${access_token}"`;
	try {
		copy(token);
		console.log("Copied the following to your clipboard 😎\n");
	} catch (error) {
		console.error(error);
	}
	console.log(token);
})();
