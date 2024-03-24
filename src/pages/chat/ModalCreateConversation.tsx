import { Icon } from '@iconify/react'
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Typography,
  styled
} from '@mui/material'
import { ReactEventHandler, use, useCallback, useEffect, useState } from 'react'
import _ from 'lodash'

import CustomTextField from 'src/@core/components/mui/text-field'
import { userApi } from 'src/@core/apis'
import { Box, BoxProps } from '@mui/system'
import Avatar from 'src/@core/components/mui/avatar'
import { ChatType, UserChatType } from 'src/types/apps/chatTypes'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ChatType>>
}

const BoxContact = styled(Box)<BoxProps>(({ theme }) => {
  return {
    '&': {
      padding: '.5rem .25rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: 6
    },
    '&: hover': {
      backgroundColor: 'rgba(0,0,0,0.08)'
    }
  }
})

const Contact = ({
  user,
  setSelectedChat,
  setOpen
}: {
  user: UserChatType
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ChatType>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const handleSelectChat = () => {
    setSelectedChat({ user })
    setOpen(false)
  }

  return (
    <BoxContact onClick={handleSelectChat} sx={{marginTop: '10px'}}>
      <Avatar src={user.avatar || ''} alt={user.firstName} sx={{ width: 36, height: 36 }} />
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <Typography variant='h6' component='span' sx={{ marginLeft: '.5rem' }}>
          {`${user.lastName} ${user.firstName}`}
        </Typography>
        <Typography variant='caption' component='span' sx={{ marginLeft: '.5rem' }}>
          {`${user.username}`}
        </Typography>
      </Box>
    </BoxContact>
  )
}

const ModalCreateConversation = ({ open, setOpen, setSelectedChat }: Props) => {
  const [users, setUsers] = useState<UserChatType[]>([])
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    userApi.getListUserCanConversation().then(({ data }) => {
      if (data.isSuccess) {
        console.log('data.data', data.data);
        
        setUsers(data.data)
      }
    })
  },[])

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.trim()

    if (search === '') setIsSearch(false)
    else setIsSearch(true)

    setLoading(true)
    const { data } = await userApi.getListUserCanConversation(search)

    if (data.isSuccess) {
      setUsers(data.data)
      setLoading(false)
    }
  }

  const handleSearchDebounce = useCallback(_.debounce(handleSearch, 300), [])

  return (
    <Dialog fullWidth onClose={() => setOpen(false)} open={open} aria-labelledby='customized-dialog-title'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5' component='span'>
          Search new contact
        </Typography>
        <IconButton aria-label='close' onClick={() => setOpen(false)}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ height: '500px' }}>
        <CustomTextField
          fullWidth
          placeholder='Contact name'
          onChange={handleSearchDebounce}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='tabler:search' fontSize={20} />
              </InputAdornment>
            ),
            endAdornment: loading && <CircularProgress size={20} sx={{ fontWeight: 800 }} />
          }}
        />

        {users.map(user => (
          <Contact user={user} key={user._id} setSelectedChat={setSelectedChat} setOpen={setOpen} />
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default ModalCreateConversation
