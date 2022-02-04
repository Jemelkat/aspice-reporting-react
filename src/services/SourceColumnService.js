import { axiosInstance } from "../helpers/AxiosHelper";

export const getColumnsForSource = (sourceId) => {
	return axiosInstance.get(`/source/${sourceId}/columns`);
};
