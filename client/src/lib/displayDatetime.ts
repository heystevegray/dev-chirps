import dayjs from "dayjs";

const displayRelativeDateOrTime = (dateString: Date): string => {
	const today = new Date();
	const previousDate = new Date(dateString);

	if (
		previousDate.getDate() === today.getDate() &&
		previousDate.getMonth() === today.getMonth() &&
		previousDate.getFullYear() === today.getFullYear()
	) {
		return dayjs(previousDate).format("h:mm a");
	} else if (previousDate.getFullYear() === today.getFullYear()) {
		return dayjs(previousDate).format("MMMM D");
	} else {
		return dayjs(previousDate).format("MMMM D, YYYY");
	}
};

export default displayRelativeDateOrTime;
