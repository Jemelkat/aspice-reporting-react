export default class DataService {
	static parseColumnsSelectData(columns) {}

	static parseSimpleSelectData(data) {
		let resultData = data.map((value) => ({
			value: value,
			label: value,
		}));
		resultData.push({ value: null, label: "None" });
		return resultData;
	}
}
