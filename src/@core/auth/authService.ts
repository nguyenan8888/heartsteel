// ** Auth config import
import jwtConfig from 'src/configs/auth'

// ** Jsonwebtoken import
import jwt from 'jsonwebtoken'

// ** Axios import
import axios from 'axios'
import { UsersType } from 'src/types/apps/userTypes'
import { endPointConstant } from '../constants'

// ** Types
export type LoginPayload = {
  user: UsersType
  accessToken: string
  refreshToken: string
}

export const authService = {
  refreshToken: async () => {
    const apiUrl = `${endPointConstant.BASE_URL}/auth/refresh-token`
    const payload = jwt.decode(localStorage.getItem(jwtConfig.storageTokenKeyName) || '') as any

    const refreshTokenApi = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(jwtConfig.onTokenExpiration)}`
      }
    })

    const data = {
      token: payload?.email,
      refreshToken: localStorage.getItem(jwtConfig.onTokenExpiration)
    }

    return refreshTokenApi.post(apiUrl, data)
  },
  setLocalStorageWhenLogin: (payload: LoginPayload) => {
    localStorage.setItem(jwtConfig.userData, JSON.stringify(payload.user))
    localStorage.setItem(jwtConfig.storageTokenKeyName, payload.accessToken)
    localStorage.setItem(jwtConfig.onTokenExpiration, payload.refreshToken)
  },
  removeLocalStorageWhenLogout: () => {
    localStorage.removeItem(jwtConfig.userData)
    localStorage.removeItem(jwtConfig.expires)
    localStorage.removeItem(jwtConfig.storageTokenKeyName)
    localStorage.removeItem(jwtConfig.onTokenExpiration)
  },
  updateUser: (payload: any) => {
    localStorage.setItem(jwtConfig.userData, JSON.stringify(payload.user))
  },
  updateStorageWhenRefreshToken: (payload: LoginPayload) => {
    localStorage.setItem(jwtConfig.storageTokenKeyName, payload.accessToken)
  }
}
