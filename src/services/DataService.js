export default class DataService {
	static parseColumnsSelectData(columns) {}

	static parseSimpleSelectData(data) {
		return data.map((value) => ({
			value: value,
			label: value,
		}));
	}
}
