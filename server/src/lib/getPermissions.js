export default function (user) {
	if (user && user["https://squeaken.com/user_authorization"]) {
		return user["https://squeaken.com/user_authorization"].permissions;
	}
	return false;
}
