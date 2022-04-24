export default class DataService {
	static parseColumnsSelectData(columns) {
		let array = [];
		if (columns)
			columns.forEach((column) =>
				array.push({ value: column.id, label: column.columnName })
			);
		array.push({ value: null, label: "None" });
		return array;
	}

	static parseSimpleSelectData(data) {
		let resultData = data.map((value) => ({
			value: value,
			label: value,
		}));
		resultData.push({ value: null, label: "None" });
		return resultData;
	}

	static parseSourcesSelectData(sources, none = true) {
		let array = [];
		if (sources)
			sources.forEach((source) =>
				array.push({ value: source.id, label: source.sourceName })
			);
		if (none) {
			array.push({ value: null, label: "None" });
		}
		return array;
	}
}
