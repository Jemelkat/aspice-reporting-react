import axios from "axios";
import { getAuthHeaderToken } from "../helpers/AuthHelper";
import { axiosInstance } from "../helpers/AxiosHelper";

export const saveReport = async (formValues, items, mode) => {
	return axiosInstance.post("reports/save", {
		id: formValues.id,
		reportName: formValues.reportName,
		reportItems:
			//TODO REMOVE LINE AFTER : - new items are created every time
			mode === "create"
				? items.map((e) => ({ ...e, id: null }))
				: items.map((e_1) => ({ ...e_1, id: null })),
		reportTemplate:
			formValues.id !== ""
				? {
						id: formValues.id,
				  }
				: null,
	});
};

export const generateReport = async (reportId) => {
	return axios.get("http://localhost:8080/reports/generate", {
		headers: {
			Authorization: getAuthHeaderToken(),
			Accept: "application/pdf",
		},
		responseType: "blob",
		params: { reportId: reportId },
	});
};
