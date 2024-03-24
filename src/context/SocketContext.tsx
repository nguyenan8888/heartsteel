import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import React, { useEffect, useState } from 'react'

import { SocketValuesType } from './types'
import { SOCKET_URL } from '../@core/constants'
import { useAuth } from 'src/hooks/useAuth'

const defaultProvider: SocketValuesType = {
  socket: null
}
export const SocketContext = React.createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.accessToken && !socket?.connected) {
      const socketIO = io(SOCKET_URL, {
        extraHeaders: {
          token: user.accessToken
        }
      })
      setSocket(socketIO)
    } else {
      socket?.disconnect()
    }

    return () => {
      socket?.disconnect()
      setSocket(null)
    }
  }, [setSocket, user?.accessToken])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export default SocketProvider
