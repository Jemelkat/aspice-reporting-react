import { axiosInstance } from "../helpers/AxiosHelper";

export default class SourceColumnService {
	static getColumDistinctValues(sourceId, columnId) {
		return axiosInstance.get(`/source/${sourceId}/values`, {
			params: { columnId: columnId },
		});
	}
	static getColumnsForSource = (sourceId) => {
		return axiosInstance.get(`/source/${sourceId}/columns`);
	};

	static getColumnsForSources = (sources) => {
		debugger;
		return axiosInstance.get(`/source/columns`, {
			params: { sources: sources.join(",") },
		});
	};
}
