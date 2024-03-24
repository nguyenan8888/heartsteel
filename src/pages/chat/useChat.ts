import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { chatApi } from 'src/@core/apis'
import { useAuth } from 'src/hooks/useAuth'
import { useSocket } from 'src/hooks/useSocket'
import { RootState } from 'src/store'
import { increaseUnSeen, initChat, readAllMessage } from 'src/store/apps/chat'
import { ChatType } from 'src/types/apps/chatTypes'

const useChat = () => {
  const store = useSelector((state: RootState) => state.chat)
  const dispatch = useDispatch()
  const router = useRouter()
  const { socket } = useSocket()
  const { user } = useAuth()

  // ** States
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null)

  useEffect(() => {
    getChats()

    const handleNoti = ({ count, chatId }: { count: number, chatId: string }) => {
      if (chatId && selectedChat?._id !== chatId) dispatch(increaseUnSeen({ unSeen: count }))
    }

    socket?.on(`noti-message-user-${user?._id}`, handleNoti)

    return () => {
      socket?.off(`noti-message-user-${user?._id}`, handleNoti)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedChat])

  useEffect(() => {
    const handleSeen = () => {
      console.log('Seen', store.chats)
    }

    if (selectedChat) {
      dispatch(readAllMessage({ chatId: selectedChat._id }))

      socket?.on(`response-seen-message`, handleSeen)
    }

    return () => {
      socket?.off(`response-seen-message`, handleSeen)
    }
  }, [selectedChat])

  const getChats = () => {
    chatApi.getChats({ limit: 10, offset: 0 }).then(({ data }) => {
      if (data.isSuccess) {
        dispatch(initChat({ chats: data.data.chats }))

        if (router.asPath !== '/chat/') {
          const unSeen = data.data.chats.reduce((prev, cur) => prev + cur.unReadMessages, 0)
          dispatch(increaseUnSeen({ unSeen }))
        }
      }
    })
  }

  return {
    chats: store.chats,
    chatsGroup: store.chatsGroup,
    selectedChat,
    setSelectedChat
  }
}

export default useChat
