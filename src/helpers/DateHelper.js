export const parseDate = (requestedDate) => {
	if (requestedDate) {
		requestedDate = requestedDate.split(" ");
		const date = requestedDate[0].split("/");
		const time = requestedDate[1].split(":");
		const newDate = new Date(
			Date.UTC(
				parseInt(date[2], 10),
				parseInt(date[1], 10) - 1,
				parseInt(date[0], 10),
				parseInt(time[0], 10),
				parseInt(time[1], 10),
				parseInt(time[2], 10)
			)
		);
		return (
			newDate.toLocaleDateString("en-GB") + " " + newDate.toLocaleTimeString()
		);
	} else {
		return "";
	}
};
