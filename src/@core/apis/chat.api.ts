// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '../constants'

export const chatApi = {
  getChats: ({ limit, offset }: { limit: number; offset: number }) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/chat/list?limit=${limit}&offset=${offset}`),
  getChatContent: (id: string, page: number | null) => {
    const hasPage = page ? `&page=${page}` : ''

    return axiosClient.get(`${endPointConstant.BASE_URL}/chat?chatId=${id}${hasPage}`)
  },
  reactMessage: (payload: { chatId: string | undefined; action: string; messageId: string }) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/chat/message/react`, payload),
  sendMessage: (payload: { content: string; target_user_id: string; isNew: boolean } | FormData) => {
    return axiosClient.post(
      `${endPointConstant.BASE_URL}/chat/message`,
      payload,
      payload instanceof FormData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        : {}
    )
  }
}
