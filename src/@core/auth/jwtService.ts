// ** Axios import
import axios from "axios"

// ** Config import
import jwtConfig from "src/configs/auth"
import { authService } from "./authService"

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json"
  },
  responseType: "json"
})

axiosClient.interceptors.request.use(
  async config => {
    const jwtToken = localStorage.getItem(jwtConfig.storageTokenKeyName)
    if (jwtToken && config.headers) {
      config.headers.Authorization = `${jwtConfig.tokenType} ${jwtToken}`
    }

    return config
  },
  async error => {
    return Promise.reject(error.response.data.errors[0].message)
  }
)
axiosClient.interceptors.response.use(
  async response => {
    return response
  },
  async error => {
    console.log(error)
    if (error.response) {
      // const { code } = error
      const config = error.config
      if (error.response.status === 401) {
        return authService
          .refreshToken()
          .then(rs => {
            if (rs.data?.data?.accessToken) {
              const payload = rs.data.data
              config.headers = {
                ...config.headers,
                Authorization: `${jwtConfig.tokenType} ${payload.accessToken}`
              }
              authService.updateStorageWhenRefreshToken(payload)

              return axiosClient(config)
            } else {
              console.log("loi2")
              authService.removeLocalStorageWhenLogout()
              window.location.href = jwtConfig.loginEndpoint
            }
          })
          .catch(err => {
            console.log("loi1")
            console.log(err)
            authService.removeLocalStorageWhenLogout()

            window.location.href = jwtConfig.loginEndpoint
          })
      }

      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)
export default axiosClient
