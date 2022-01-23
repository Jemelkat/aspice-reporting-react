import { axiosInstance } from "../helpers/AxiosHelper";

export const deleteSource = (sourceId) => {
	return axiosInstance.delete("/source/delete", {
		params: { sourceId: sourceId },
	});
};
