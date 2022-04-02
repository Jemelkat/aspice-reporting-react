import { axiosInstance } from "../helpers/AxiosHelper";

export default class TemplateService {
	static getAllSimple = async () => {
		return axiosInstance.get("/templates/allSimple");
	};

	static saveTemplate = async (template) => {
		return axiosInstance.post("/templates/save", {
			...template,
		});
	};

	static getTemplate = async (templateId) => {
		return axiosInstance.get("/templates/get", {
			params: { templateId: templateId },
		});
	};
}
