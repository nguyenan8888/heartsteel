// ** MUI Imports
import { Button, DialogActions, DialogTitle, Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import { useEffect, useState } from 'react'
import { userApi } from 'src/@core/apis'

// ** Icon Imports
import ListUser from 'src/@core/components/pop-up/list-user'
import { notificationApi } from 'src/@core/apis'
import Backdrop from '@mui/material/Backdrop';
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { NOTIFICATION_TYPES } from 'src/@core/constants'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import NotificationDropdown, {
  NotificationsType
} from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useAuth } from 'src/hooks/useAuth'
import { useSocket } from 'src/hooks/useSocket'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import jwtConfig from 'src/configs/auth'
import { useRouter } from 'next/router'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

// const notifications: NotificationsType[] = [
//   {
//     user: {
//       _id: '123',
//       firstName: 'Phu',
//       lastName: 'Tran',
//       avatar:
//         'https://firebasestorage.googleapis.com/v0/b/wdp-391.appspot.com/o/images%2F65e03da8969b08464acf7c2e-1709194741297-0?alt=media&token=1c0e433a-3a87-467f-bc22-3dee43258d70'
//     },
//     content: '',
//     is_read: false,
//     is_trash: false,
//     type: NOTIFICATION_TYPES.TAG,
//     title: 'mentioned you in a post',
//     meta_data: {
//       sender: {
//         _id: '123',
//         firstName: 'Phu',
//         lastName: 'Tran',
//         avatar: '/images/avatars/1.png'
//       },
//       subject: '',
//       postId: '123321'
//     },
//     createdAt: '2024-02-29T08:17:44.996+00:00',
//     updatedAt: '2024-02-29T08:17:44.996+00:00'
//   },
//   {
//     user: {
//       _id: '1234',
//       firstName: 'Dang',
//       lastName: 'Pham Vu Hai',
//       avatar: '/images/avatars/1.png'
//     },
//     content: '',
//     is_read: false,
//     is_trash: false,
//     type: NOTIFICATION_TYPES.FRIEND_REQUEST,
//     title: 'sent you a friend request',
//     meta_data: {
//       sender: {
//         _id: '123',
//         firstName: 'Phu',
//         lastName: 'Tran',
//         avatar:
//           'https://firebasestorage.googleapis.com/v0/b/wdp-391.appspot.com/o/images%2F65e03da8969b08464acf7c2e-1709194741297-0?alt=media&token=1c0e433a-3a87-467f-bc22-3dee43258d70'
//       },
//       subject: ''
//     },
//     createdAt: '2024-02-29T06:17:44.996+00:00',
//     updatedAt: '2024-02-29T06:17:44.996+00:00'
//   },
//   {
//     user: {
//       _id: '12345',
//       firstName: 'Trung',
//       lastName: 'Nguyen Chi',
//       avatar: '/images/avatars/1.png'
//     },
//     content: '',
//     is_read: false,
//     is_trash: false,
//     type: NOTIFICATION_TYPES.POST,
//     title: 'commented on your post',
//     meta_data: {
//       sender: {
//         _id: '3123213',
//         firstName: 'An',
//         lastName: 'Nguyen Thanh',
//         avatar:
//           'https://firebasestorage.googleapis.com/v0/b/wdp-391.appspot.com/o/images%2F65e03da8969b08464acf7c2e-1709194741297-0?alt=media&token=1c0e433a-3a87-467f-bc22-3dee43258d70'
//       },
//       subject: ''
//     },
//     createdAt: '2024-02-29T06:17:44.996+00:00',
//     updatedAt: '2024-02-29T06:17:44.996+00:00'
//   }
// ]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const [isOpenLockNoti, setIsOpenLockNoti] = useState<boolean>(window.localStorage.getItem('isLocked') === 'true');

  const [searchUserString, setSearchUserString] = useState<string>('');
  const [listDataUser, setListDataUser] = useState<any>([]);

  useEffect(() => {
    if (searchUserString !== '') fetchSearchUser()
  }, [searchUserString]);

  const fetchSearchUser = () => {
    userApi.search(searchUserString)
      .then(response => {
        setListDataUser(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  const handleOpenSearch = () => setIsOpenSearch(true);
  const handleCloseSearch = () => {
    setIsOpenSearch(false);
    setSearchUserString('');
  }
  const { logout, user } = useAuth()
  const { socket } = useSocket()
  const router = useRouter()

  const [notifications, setNotifications] = useState<NotificationsType[]>([])

  useEffect(() => {
    const handleNotification = ({ notification }: { notification: NotificationsType }) => {
      if (notification.type == NOTIFICATION_TYPES.LOCKED_ACCOUNT) {
        router.push('/lock');
        window.localStorage.setItem('isLocked', 'true');
        setIsOpenLockNoti(true);
      }
      setNotifications(prev => [notification, ...prev])
    }

    socket?.on(`response-notification-${user?._id}`, handleNotification)

    return () => {
      socket?.off(`response-notification-${user?._id}`, handleNotification)
    }
  }, [socket])

  useEffect(() => {
    if (isOpenLockNoti) {
      router.push('/lock');
    }
  }, []);

  useEffect(() => {
    user &&
      notificationApi
        .getNotificationsOfUser(user?._id)
        .then(({ data }) => {
          if (data.isSuccess) setNotifications(data.data.notifications)
        })
        .catch(err => console.log(err))
  }, [user])

  const handleLogout = () => {
    logout()
    setIsOpenLockNoti(false);
  }

    const handleEmailClick = () => {
      window.location.href = 'mailto:heartsteel@gmail.com';
    };
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}

        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <IconButton onClick={handleOpenSearch}>
          <Icon icon='ic:baseline-search' />
        </IconButton>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <NotificationDropdown settings={settings} notifications={notifications} setNotifications={setNotifications} />
        <UserDropdown settings={settings} />
      </Box>

      <Dialog
        open={isOpenSearch}
        fullWidth={true}
        maxWidth={'sm'}
        scroll={'paper'}
        onClose={handleCloseSearch}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4, display: 'flex', justifyContent: 'space-between', marginLeft: '20px' }}>
          <Typography variant='h6' component='span' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Icon icon='ic:baseline-search' /> Search
          </Typography>
          <Button aria-label='close' onClick={handleCloseSearch}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </Button>
        </DialogTitle>
        <DialogContent dividers style={{ height: '500px' }}>
          <Grid sx={{ margin: '0 20px' }}>
            <CustomTextField
              fullWidth
              placeholder='Enter username'
              value={searchUserString}
              onChange={e => setSearchUserString(e.target.value)}
            />
          </Grid>
          <div onClick={handleCloseSearch}>
            {searchUserString && <ListUser listData={listDataUser} />}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenLockNoti}
        fullWidth={true}
        maxWidth={'xs'}
        scroll={'paper'}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4, display: 'flex', justifyContent: 'space-between', marginLeft: '20px' }}>
          <Typography variant='h6' component='span' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Icon icon='material-symbols:report-outline-rounded' style={{ fontSize: '35px', color: 'red',marginRight:'15px' }} />
            <span style={{ fontWeight: 900, fontFamily: 'monospace' }}>You have been locked by Heartsteel</span>
          </Typography>
        </DialogTitle>
        <DialogContent dividers >
          <Typography sx={{fontWeight:900}}>
            Your account has been locked by Heartsteel. Please contact the administrator for more information.
          </Typography>
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon='mdi:email-sent-outline' style={{ fontSize: '35px', marginRight: '5' }}  onClick={handleEmailClick} />
            If you have any questions, please contact us
          </Typography>
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', fontStyle:'italic', textDecoration:'underline', marginTop:4 }} onClick={handleEmailClick} >heartsteel@gmail.com</span>
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleLogout}>Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AppBarContent
