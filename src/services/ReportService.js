import axios from "axios";
import { getAuthHeaderToken } from "../helpers/AuthHelper";
import { axiosInstance } from "../helpers/AxiosHelper";

export const saveReport = async (formValues, items, mode) => {
	return axiosInstance.post("/report/save", {
		reportId: formValues.id,
		reportName: formValues.reportName,
		reportItems:
			//TODO REMOVE LINE AFTER : - new items are created every time
			mode === "create"
				? items.map((e) => ({ ...e, itemId: null }))
				: items.map((e_1) => ({ ...e_1, itemId: null })),
		reportTemplate:
			formValues.templateId !== ""
				? {
						templateId: formValues.templateId,
				  }
				: null,
	});
};

export const generateReport = async (reportId) => {
	return axios.get("http://localhost:8080/report/generate", {
		headers: {
			Authorization: getAuthHeaderToken(),
		},
		responseType: "blob",
		params: { reportId: reportId },
	});
};
