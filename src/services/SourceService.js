import {axiosInstance} from "../helpers/AxiosHelper";
import AuthService from "./AuthService";

export default class SourceService {
    static download(sourceId) {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: AuthService.getAuthHeaderToken(),
                Accept: "text/csv",
            },
            responseType: "blob",
        };
        return axiosInstance.get(`source/${sourceId}/download`, requestOptions);
    }

    static deleteSource (sourceId){
        return axiosInstance.delete("/source/delete", {
            params: {sourceId: sourceId},
        });
    }

    static uploadSource (file, onProgress){
        let formData = new FormData();
        formData.append("file", file[0]);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: AuthService.getAuthHeaderToken(),
            },
            onUploadProgress: function (event) {
                onProgress(event);
            },
        };
        return axiosInstance.post("/source/upload", formData, requestOptions);
    };
}