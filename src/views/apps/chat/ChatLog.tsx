// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import InfiniteScroll from 'react-infinite-scroll-component'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import { ChatLogType, MessageType, MsgFeedbackType, MessageGroupType, UserChatType } from 'src/types/apps/chatTypes'
import { useAuth } from 'src/hooks/useAuth'

import { CircularProgress, Divider, Tooltip, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSocket } from 'src/hooks/useSocket'
import Message from './Message'

const ChatBody = styled(Box)<BoxProps>(({ theme }) => {
  return {
    '&': {
      width: '90%',
      '& .message-item': {
        '& .message-action': {
          height: '18px',
          display: 'none',
          gap: 8,
          marginLeft: '.5rem'
        },
        '&:hover': {
          '& .message-action': {
            display: 'flex'
          }
        }
      }
    }
  }
})

const TypingLog = ({ user }: { user: UserChatType }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <CustomAvatar
          skin='light'
          color={'success'}
          sx={{
            width: 32,
            height: 32,
            marginBottom: 'calc(100% - 16px)',
            mr: 3,
            fontSize: theme => theme.typography.body1.fontSize
          }}
          src={user.avatar || ''}
          alt={user.firstName}
        >
          {getInitials(`${user.lastName} ${user.firstName}`)}
        </CustomAvatar>
      </div>
      <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
        <Box sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
          <Box
            sx={{
              boxShadow: 1,
              borderRadius: 1,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(2.25, 4),
              ml: undefined,
              borderTopLeftRadius: 0,
              borderTopRightRadius: undefined,
              color: 'text.primary',
              backgroundColor: 'background.paper',
              height: '40px'
            }}
          >
            <Icon icon='svg-spinners:3-dots-fade' />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const ChatLog = (props: ChatLogType) => {
  // ** Props
  const { hidden, selectedChat, page, messages, hasMore, getChatContent, replyTo, setReplyTo } = props

  // ** Hooks
  const { user } = useAuth()
  const { socket } = useSocket()
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    const handleResponseTyping = (data: { userId: string; action: string }) => {
      const { userId, action } = data

      if (userId === selectedChat.user._id) {
        setIsTyping(action === 'ON_TYPING')
      }
    }

    if (socket) {
      socket.on('response-typing-message', handleResponseTyping)
    }

    return () => {
      if (socket) socket?.off('response-typing-message', handleResponseTyping)
    }
  }, [socket, selectedChat])

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: MessageType[] | [] = []
    if (selectedChat && messages.length > 0) {
      chatLog = messages
    } else return []

    const formattedChatLog: MessageGroupType[] = []
    let chatMessageSender = chatLog[0].user
    let msgGroup: MessageGroupType = {
      user: chatMessageSender,
      messages: []
    }

    chatLog.forEach((msg: MessageType, index: number) => {
      if (chatMessageSender._id === msg.user._id) {
        msgGroup.messages.unshift(msg)
      } else {
        chatMessageSender = msg.user

        formattedChatLog.push(msgGroup)
        msgGroup = {
          user: msg.user,
          messages: [msg]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  const renderMsgFeedback = (isSender: boolean, feedback: MsgFeedbackType) => {
    if (isSender) {
      if (feedback.isSent && !feedback.isDelivered) {
        return (
          <Box component='span' sx={{ display: 'flex', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
            <Icon icon='tabler:check' fontSize='1.125rem' />
          </Box>
        )
      } else if (feedback.isSent && feedback.isDelivered) {
        return (
          <Box
            component='span'
            sx={{
              display: 'flex',
              '& svg': { mr: 1.5, color: feedback.isSeen ? 'success.main' : 'text.secondary' }
            }}
          >
            <Icon icon='tabler:checks' fontSize='1.125rem' />
          </Box>
        )
      } else {
        return null
      }
    }
  }

  // ** Renders user chat
  const renderChats = () => {
    const chatData = formattedChatData()

    return chatData.map((item: MessageGroupType, indexBucket: number) => {
      const isSender = item.user?._id === user?._id
      const isSeenBlocks =
        user && user._id === item.user._id && item.messages.every(message => Object.keys(message.seen).length > 1)

      return (
        <Box
          key={indexBucket}
          sx={{
            display: 'flex',
            flexDirection: !isSender ? 'row' : 'row-reverse',
            mb: indexBucket !== chatData.length - 1 ? 4 : undefined
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Tooltip
              title={isSender ? `You` : `${item.user.lastName} ${item.user.firstName}`}
              placement={isSender ? 'right' : 'left'}
            >
              <CustomAvatar
                skin='light'
                color={'success'}
                sx={{
                  width: 32,
                  height: 32,
                  marginBottom: 'calc(100% - 16px)',
                  ml: isSender ? 3 : undefined,
                  mr: !isSender ? 3 : undefined,
                  fontSize: theme => theme.typography.body1.fontSize
                }}
                {...(selectedChat.user._id && !isSender
                  ? {
                      src: selectedChat.user.avatar || '',
                      alt: selectedChat.user.firstName || ''
                    }
                  : {})}
                {...(isSender
                  ? {
                      src: user?.avatar || '',
                      alt: user?.firstName || ''
                    }
                  : {})}
              >
                {getInitials(`${selectedChat.user.lastName} ${selectedChat.user.firstName}`)}
              </CustomAvatar>
            </Tooltip>
          </div>

          <ChatBody className='chat-body'>
            {item.messages.map((message: MessageType, index: number, { length }: { length: number }) => {
              const time = new Date(message.createdAt)

              return (
                <Message
                  key={message._id}
                  message={message}
                  messages={messages}
                  index={index}
                  isSender={isSender}
                  selectedChat={selectedChat}
                  time={time}
                  length={length}
                  isSeen={!!isSeenBlocks}
                  setReplyTo={setReplyTo}
                />
              )
            })}
          </ChatBody>
        </Box>
      )
    })
  }

  return (
    <Box sx={{ height: 'calc(100% - 8.875rem)' }} key={selectedChat?._id}>
      <InfiniteScroll
        style={{ padding: '1rem', display: 'flex', flexDirection: 'column-reverse' }}
        height={'100%'}
        dataLength={messages.length}
        next={() => {
          getChatContent(selectedChat?._id, page)
        }}
        inverse={true}
        hasMore={hasMore}
        loader={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        }
        endMessage={<Divider style={{ margin: '1rem 0' }}>You're up to date</Divider>}
      >
        {isTyping && <TypingLog user={selectedChat.user} />}
        {renderChats()}
      </InfiniteScroll>
    </Box>
  )
}

export default ChatLog
