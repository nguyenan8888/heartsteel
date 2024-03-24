// ** Axios client import
import axiosClient from '../auth/jwtService';

// ** Constants import
import { endPointConstant } from '../constants';

export const reelApi = {
  reel: (page: number) => axiosClient.get(`${endPointConstant.BASE_URL}/reel?page=${page}`),
  detail: (id: any) => axiosClient.get(`${endPointConstant.BASE_URL}/reel/detail/${id}`),
  get_comments: (reelId: string, page = 1) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/reel/comments/${reelId}?page=${page}`);
  },

  reactReel: (reelId: string) => {
    return axiosClient.patch(`${endPointConstant.BASE_URL}/reel/react/${reelId}?type=like`);
  },

  newReel: (data: any) => {
    return axiosClient.post(`${endPointConstant.BASE_URL}/reel/newReel`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getAllsReel: (createdAt?: any, totalLike?: any, totalComent?: any) =>{
    return axiosClient.get(
      `${endPointConstant.BASE_URL}/reel/allReels?createdAt=${createdAt}&totalLike=${totalLike}&totalComent=${totalComent}`
    )
  },
  get_reelDetails: (reelId: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/reel/detail/${reelId}`)
  },
  delete_reel: (reelId: string) => {
    return axiosClient.delete(`${endPointConstant.BASE_URL}/reel/${reelId}`)
  },
  personal: (userId: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/reel/personal/${userId}`)
  },
  editReel: (reelId: string, data: any) => {
    return axiosClient.put(`${endPointConstant.BASE_URL}/reel/editReel/${reelId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
};