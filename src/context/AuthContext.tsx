// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType } from './types'
import { UsersType } from 'src/types/apps/userTypes'

import { authService } from 'src/@core/auth/authService'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UsersType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      if (!storedToken) {
        router.replace('/login')
      } else {
        setUser(JSON.parse(window.localStorage.getItem(authConfig.userData) || '{}'))
      }
      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (data: UsersType, rememberMe: boolean, accessToken: string, refreshToken: string) => {
    const returnUrl = router.query.returnUrl

    setUser({ ...data, accessToken })
    setLoading(false)
    authService.setLocalStorageWhenLogin({ accessToken, refreshToken, user: { ...data, accessToken } })
    rememberMe ? window.localStorage.setItem('userData', JSON.stringify({ ...data, accessToken })) : null
    window.localStorage.setItem('isLocked', data.isLocked ? 'true' : 'false')
    const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

    router.replace(redirectURL as string)
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
