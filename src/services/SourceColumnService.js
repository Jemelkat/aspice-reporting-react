import { axiosInstance } from "../helpers/AxiosHelper";

export const getColumnsForSource = (sourceId) => {
	return axiosInstance.get(`/source/${sourceId}/columns`);
};

export default class SourceColumnService {
	static getColumDistinctValues(sourceId, columnId) {
		return axiosInstance.get(`/source/${sourceId}/values`, {
			params: { columnId: columnId },
		});
	}
}
