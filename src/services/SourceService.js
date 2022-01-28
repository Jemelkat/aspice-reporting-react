import { getAuthHeaderToken } from "../helpers/AuthHelper";
import { axiosInstance } from "../helpers/AxiosHelper";

export const deleteSource = (sourceId) => {
	return axiosInstance.delete("/source/delete", {
		params: { sourceId: sourceId },
	});
};

export const uploadSource = (file, onUploadProgress) => {
	let formData = new FormData();
	formData.append("file", file[0]);

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: getAuthHeaderToken(),
		},
	};
	return axiosInstance.post("/source/upload", formData, requestOptions);
};

export const getColumns = (sourceId) => {
	return axiosInstance.get(`source/${sourceId}/columns`);
};
