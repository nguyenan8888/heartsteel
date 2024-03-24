// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '../constants'

export const userApi = {
  profile: (id: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/profile/${id}`),
  editProfile: (data: any) => axiosClient.put(`${endPointConstant.BASE_URL}/user/editProfile`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getFollowers: (id: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/getFollowers/${id}`),
  getFollowing: (id: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/getFollowing/${id}`),
  follow: (id: string) => axiosClient.post(`${endPointConstant.BASE_URL}/user/follow/${id}`),
  savePost: (id: string) => axiosClient.patch(`${endPointConstant.BASE_URL}/user/savePost/${id}`),
  unSavePost: (id: string) => axiosClient.patch(`${endPointConstant.BASE_URL}/user/unSavePost/${id}`),
  getSavedPosts: () => axiosClient.get(`${endPointConstant.BASE_URL}/user/getSavedPosts`),
  search: (data: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/search?userName=${data}`),
  blockUser: (id: string) => axiosClient.patch(`${endPointConstant.BASE_URL}/user/blockUser/${id}`),
  allUsers: (role: string, search: string, isLocked?: any) => axiosClient.get(`${endPointConstant.BASE_URL}/user/allUsers?role=${role}&search=${search}&isLocked=${isLocked}`),
  getListUserCanConversation: (search?: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/conversation?search=${search ? search : ''}`),
  editRole: (id: string, data: any) => axiosClient.patch(`${endPointConstant.BASE_URL}/user/editRole/${id}`, data),
  lockAccount: (id: string) => axiosClient.patch(`${endPointConstant.BASE_URL}/user/lockAccount/${id}`),
}
