// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '../constants'

export const postApi = {
  create_post: (data: any) => {
    return axiosClient.post(`${endPointConstant.BASE_URL}/post/createPost`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  get_posts: (userId: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/post/personalPosts/${userId}`)
  },

  get_postDetails: (postId: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/post/postDetail/${postId}`)
  },

  edit_post: (postId: string, data: any) => {
    return axiosClient.put(`${endPointConstant.BASE_URL}/post/editPost/${postId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  newFeed: () => axiosClient.get(`${endPointConstant.BASE_URL}/post/getPosts`),
  reactPost: (postId: string) => {
    return axiosClient.patch(`${endPointConstant.BASE_URL}/post/reactPost/${postId}?type=like`)
  },

  get_comments: (postId: string, page = 1) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/post/getComments/${postId}?page=${page}`)
  },
  post_Report: (targetId: string, data: any) => {
    return axiosClient.post(`${endPointConstant.BASE_URL}/report/newReport/${targetId}`, data)
  },
  get_Report: (page: number, size: number, type: string, createdAt: string, totalReport: number, search: string) => {
    return axiosClient.get(
      `${endPointConstant.BASE_URL}/report/allReport?page=${
        page + 1
      }&size=${size}&type=${type}&totalReport=${totalReport}&createdAt=${createdAt}&search=${search}`
    )
  },
  getAllPosts: (createdAt?: any, totalLike?: any, totalComent?: any) => {
    return axiosClient.get(
      `${endPointConstant.BASE_URL}/post/getAllPosts?createdAt=${createdAt}&totalLike=${totalLike}&totalComent=${totalComent}`
    )
  },
  deleteComment: (commentId: string) => {
    return axiosClient.delete(`${endPointConstant.BASE_URL}/comment/${commentId}`)
  },
  delete_post: (postId: string) => {
    return axiosClient.delete(`${endPointConstant.BASE_URL}/post/${postId}`)
  },
  editComment: (commentId: string, data: any) => {
    return axiosClient.patch(`${endPointConstant.BASE_URL}/comment/${commentId}`, data)
  },
  setComment: (postId: string) => {
    return axiosClient.patch(`${endPointConstant.BASE_URL}/post/setComment/${postId}`);
  },
  setPublic: (postId: string) => {
    return axiosClient.patch(`${endPointConstant.BASE_URL}/post/setPublic/${postId}`);
  },
  getPostLikes: (): Promise<any> => axiosClient.get(`${endPointConstant.BASE_URL}/post/likes`),
  getPostComments: (): Promise<any> => axiosClient.get(`${endPointConstant.BASE_URL}/post/comments`),
  getPostSaved: () :Promise<any> => axiosClient.get(`${endPointConstant.BASE_URL}/post/saved`),
};

