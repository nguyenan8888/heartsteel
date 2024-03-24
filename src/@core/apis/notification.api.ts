import axiosClient from "../auth/jwtService";
import { endPointConstant } from "../constants";

export const notificationApi = {
    getNotificationsOfUser: (userId: string) => axiosClient.get(`${endPointConstant.BASE_URL}/notification`),
    update: (data: any) => axiosClient.patch(`${endPointConstant.BASE_URL}/notification`, data)
}