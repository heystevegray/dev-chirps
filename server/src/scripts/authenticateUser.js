import getToken from "../lib/getToken";

(async () => {
	const [email, password] = process.argv.slice(2)
	const access_token = await getToken(email, password).catch(error => {
		console.log(error)
	})
	console.log(`"Authorization": "Bearer ${access_token}"`);
})();