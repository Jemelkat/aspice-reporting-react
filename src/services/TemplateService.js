import { axiosInstance } from "../helpers/AxiosHelper";

export const saveTemplate = async (formValues, items, mode) => {
	return axiosInstance.post("/template/save", {
		templateId: formValues.id,
		templateName: formValues.templateName,
		templateItems:
			//TODO REMOVE LINE AFTER : - new items are created every time
			mode === "create"
				? items.map((e) => ({ ...e, itemId: null }))
				: items.map((e) => ({ ...e, itemId: null })),
	});
};
