// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '../constants'

type LoginPayload = {
  usernameOrEmail: string
  password: string
}

type RegisterPayload = {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export const authApi = {
  register: (data: RegisterPayload) => axiosClient.post(`${endPointConstant.BASE_URL}/public/auth/register`, data),
  login: (data: LoginPayload) => axiosClient.post(`${endPointConstant.BASE_URL}/public/auth/login`, data),
  changePassword: (data: any) => axiosClient.put(`${endPointConstant.BASE_URL}/user/changePassword`, data)
}
