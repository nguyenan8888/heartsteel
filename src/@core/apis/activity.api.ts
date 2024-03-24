// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '../constants'


export const activityApi = {
  get_activities: (type: string, contentType: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/activity?type=${type}&contentType=${contentType}`)
  },
}