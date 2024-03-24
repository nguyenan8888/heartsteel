// ** React Imports
import { useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { MessageType, SendMsgComponentType } from 'src/types/apps/chatTypes'
import { useSocket } from 'src/hooks/useSocket'
import { chatApi } from 'src/@core/apis'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { initChat, updateChat } from 'src/store/apps/chat'
import toast from 'react-hot-toast'
import { ImageList, Typography, useTheme } from '@mui/material'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

type FilesType = {
  id: string
  file: File
}

const SendMsgForm = (props: SendMsgComponentType) => {
  // ** Props
  const { selectedChat, setSelectedChat, setMessages, replyTo, setReplyTo } = props
  const { socket } = useSocket()
  const { chats } = useSelector((state: RootState) => state.chat)
  const theme = useTheme()
  const dispatch = useDispatch()

  // ** State
  const [msg, setMsg] = useState<string>('')
  const [files, setFiles] = useState<FilesType[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (socket && selectedChat) {
      const handleResponse = (data: { message: MessageType }) => {
        const { message } = data

        if (message) {
          setMessages(prev => [message, ...prev])
          setMsg('')
          socket.emit('typing-message', { action: 'OFF_TYPING', chatId: selectedChat._id })
          console.log(message);
          dispatch(updateChat({ message, chatId: selectedChat._id }))
        }
      }

      const handleUpdateMessage = (data: { message: MessageType }) => {
        const { message } = data

        if (message) {
          setMessages(prev => prev.map(msg => (msg._id === message._id ? { ...msg, isDelete: message.isDelete } : msg)))
          
        }
      }

      socket?.on(`response-send-message`, handleResponse)
      socket.on('response-update-message', handleUpdateMessage)

      return () => {
        socket.off(`response-send-message`, handleResponse)
        socket.off('response-update-message', handleUpdateMessage)
      }
    }
  }, [socket, setMessages, selectedChat])

  useEffect(() => {
    if (isTyping && socket) {
      socket.emit('typing-message', { action: 'ON_TYPING', chatId: selectedChat._id })
    }

    return () => {
      if (isTyping && socket) socket.emit('typing-message', { action: 'OFF_TYPING', chatId: selectedChat._id })
    }
  }, [isTyping, socket, selectedChat])

  const handleSubmitForm = async (e: SyntheticEvent) => {
    e.preventDefault()
    const msgSend = msg.trim()
    if (msgSend === '' && files.length === 0) return

    if (selectedChat?._id) {
      const payload = {
        chatId: selectedChat._id,
        message: msgSend,
        targetUserId: selectedChat.user._id,
        replyTo: replyTo?._id
      }

      if (files.length > 0) {
        setLoading(true)
        const formData = new FormData()

        formData.append('content', msgSend)
        formData.append('target_user_id', selectedChat.user._id)

        for (let i = 0; i < files.length; ++i) {
          formData.append('files', files[i].file)
        }

        chatApi
          .sendMessage(formData)
          .then(({ data }) => {
            if (data.isSuccess) {
              socket?.emit('send-message-upload', {
                message: data.data,
                chatId: selectedChat._id
              })
              setMessages(prev => [data.data, ...prev])
              setFiles([])
              setMsg('')
              setReplyTo(null)
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => setLoading(false))
      } else if (msgSend !== '') {
        socket?.emit('send-message', payload)
        setReplyTo(null)
      }
    } else {
      const payload = {
        content: msgSend,
        target_user_id: selectedChat.user._id,
        isNew: true
      }

      chatApi
        .sendMessage(payload)
        .then(({ data }) => {
          if (data.isSuccess) {
            const { chat } = data.data

            setSelectedChat(chat)
            dispatch(initChat({ chats: [chat, ...chats] }))
          }
        })
        .catch(err => console.log(err))
    }
  }

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesSelected = e.target.files

    if (!filesSelected) return

    if (files.length + filesSelected.length > 5) {
      return toast.error('Limit upload 5 files')
    }

    const filesChoose = []
    const id = new Date().valueOf()
    for (let i = 0; i < filesSelected.length; ++i) {
      if (filesSelected[i].size > 5 * 10 ** 6) {
        toast.error('File upload size less than 5MB')
      } else
        filesChoose.push({
          id: `${id}_${i}`,
          file: filesSelected[i]
        })
    }

    setFiles(filesChoose)

    e.target.value = ''
  }

  return (
    <Form onSubmit={handleSubmitForm} sx={{ position: 'relative' }}>
      {files.length > 0 && (
        <Box sx={{ position: 'absolute', top: replyTo ? '-120px' : '-80px', zIndex: 10 }}>
          <ImageList sx={{ width: '100%', height: 60 }} cols={100} rowHeight={60}>
            {files.map(data => (
              <div key={data.id} style={{ position: 'relative' }}>
                <img
                  width={60}
                  height={60}
                  style={{
                    objectFit: 'cover',
                    marginRight: '.5rem'
                  }}
                  src={URL.createObjectURL(data.file)}
                />
                <Icon
                  icon={'tabler:xbox-x'}
                  color='red'
                  style={{ position: 'absolute', top: 0, right: '.5rem', cursor: 'pointer' }}
                  onClick={() => setFiles(prev => prev.filter(fileData => fileData.id !== data.id))}
                />
              </div>
            ))}
          </ImageList>
        </Box>
      )}
      {replyTo && (
        <Box
          sx={{
            position: 'absolute',
            top: '-40px',
            width: 'calc(100% - 2.5rem)',
            backgroundColor: theme.palette.background.paper,
            borderTopLeftRadius: '6px',
            borderTopRightRadius: '6px',
            padding: '.25rem .75rem',
            zIndex: 5
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>
              Reply to:
              <strong style={{ marginLeft: '.25rem' }}>{`${replyTo.user.lastName} ${replyTo.user.firstName}`}</strong>
            </Typography>
            <Icon icon={'tabler:x'} style={{ cursor: 'pointer' }} onClick={() => setReplyTo(null)} />
          </div>
          <div>
            <Typography sx={{ fontSize: '.8rem', opacity: '.5', fontWeight: 600 }}>
              {replyTo.content.length > 50 ? `${replyTo.content.slice(0, 50)}...` : replyTo.content}
            </Typography>
          </div>
        </Box>
      )}
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            fullWidth
            value={msg}
            placeholder='Type your message here…'
            onChange={e => {
              const value = e.target.value.trim()

              setMsg(e.target.value)
              setIsTyping(!!value)
            }}
            sx={{
              '& .Mui-focused': { boxShadow: 'none !important' },
              '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
                p: theme => theme.spacing(1.875, 2.5)
              },
              '& .MuiInputBase-root': { border: '0 !important' }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' sx={{ color: 'text.primary' }}>
            <Icon icon='tabler:microphone' />
          </IconButton>
          <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 3, color: 'text.primary' }}>
            <Icon icon='tabler:photo' />
            <input hidden type='file' id='upload-img' accept='image/*' multiple onChange={handleSelectFiles} />
          </IconButton>
          <Button type='submit' variant='contained' disabled={loading}>
            Send
          </Button>
        </Box>
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
