import { axiosInstance } from "../helpers/AxiosHelper";

export const saveDashboard = async (dashboardId, items) => {
	return axiosInstance.post("dashboard/save", {
		id: dashboardId,
		dashboardItems: items.map((i) => i),
	});
};

export const getDashboard = async () => {
	return axiosInstance.get("/dashboard");
};

export const getItemData = async (id) => {
	return axiosInstance.get("/dashboard/data", { params: { itemId: id } });
};
