import { getAuthHeaderToken } from "../helpers/AuthHelper";
import { axiosInstance } from "../helpers/AxiosHelper";

export const deleteSource = (sourceId) => {
	return axiosInstance.delete("/source/delete", {
		params: { sourceId: sourceId },
	});
};

export const uploadSource = (file, onProgress) => {
	let formData = new FormData();
	formData.append("file", file[0]);

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: getAuthHeaderToken(),
		},
		onUploadProgress: function (event) {
			onProgress(event);
		},
	};
	return axiosInstance.post("/source/upload", formData, requestOptions);
};

export const getColumns = (sourceId) => {
	return axiosInstance.get(`source/${sourceId}/columns`);
};

export default class SourceService {
	static download(sourceId) {
		const requestOptions = {
			method: "GET",
			headers: {
				Authorization: getAuthHeaderToken(),
				Accept: "text/csv",
			},
			responseType: "blob",
		};
		return axiosInstance.get(`source/${sourceId}/download`, requestOptions);
	}
}
