import {axiosInstance} from "../helpers/AxiosHelper";

export default class DashboardService {
	static saveDashboard = async (dashboardId, items) => {
		return axiosInstance.post("dashboard/save", {
			id: dashboardId,
			dashboardItems: items.map((i) => i),
		});
	};

	static getDashboard = async () => {
		return axiosInstance.get("/dashboard");
	};

	static getItemData = async (id) => {
		return axiosInstance.get("/dashboard/data", { params: { itemId: id } });
	};
}