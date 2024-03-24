// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import InfiniteScrollComponent from 'react-infinite-scroll-component'
import { formatRelative, subDays } from 'date-fns'

// ** Type Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useTheme } from '@mui/system'
import { UsersType } from 'src/types/apps/userTypes'
import { NOTIFICATION_TYPES, NOTIFICATION_RES_TYPES } from 'src/@core/constants'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Divider } from '@mui/material'
import PostDetails from 'src/@core/components/list-post/[id]/PostDetails'
import { notificationApi, postApi, userApi } from 'src/@core/apis'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useSocket } from 'src/hooks/useSocket'

export type NotificationsType = {
  _id: string
  user: UsersType
  title: string
  content: string
  type: 'FOLLOW' | 'TAG' | 'POST' | string
  is_read: boolean
  is_trash: boolean
  meta_data: {
    sender: UsersType
    subject: string
    postId: string
    type: string
  }
  createdAt: string
  updatedAt: string
}
interface Props {
  settings: Settings
  notifications: NotificationsType[]
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsType[]>>
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0,
    '& .MuiMenuItem-root': {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing(4, 6),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const InfiniteScroll = styled(InfiniteScrollComponent)({
  maxHeight: 349
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>({
  fontWeight: 500,
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({
  children,
  hidden,
  data
}: {
  children: ReactNode
  hidden: boolean
  data: NotificationsType[]
}) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <InfiniteScroll dataLength={data?.length}>{children}</InfiniteScroll>
  }
}

const NotificationDropdown = (props: Props) => {
  // ** Props
  const { settings, notifications, setNotifications } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const [postDetail, setPostDetail] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [openNotiDetail, setOpenNotiDetail] = useState(false)
  const [openNotiReelDetail, setOpenNotiReelDetail] = useState(false)


  const router = useRouter();
  const { socket } = useSocket();

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const theme = useTheme()
  const handleClosePostDetails = () => setOpenPostDetails(false)
  const handleCloseNotiDetail = () => setOpenNotiDetail(false)
  const handleCloseNotiReelDetail = () => setOpenNotiReelDetail(false)

  const handleClick = (notification: NotificationsType) => {
    console.log('Notification:', notification);
    if (notification.type === NOTIFICATION_TYPES.POST) {
      handleDropdownClose();
      handlePostDetails(notification.meta_data.postId, notification.is_read, notification._id);
    }
    if (notification.type === NOTIFICATION_TYPES.REEL) {
      router.push(`/reels/reel-detail/${notification.meta_data.reelId}`)
      handleDropdownClose();
    }
    if (notification.type === NOTIFICATION_TYPES.FOLLOW) {
      router.push(`/user-profile/${notification.meta_data.sender._id}`)
      if (!notification.is_read) {
        notificationApi
          .update({ is_read: true, _id: notification._id })
          .then(({ data }) => {
            if (data.isSuccess) {
              setNotifications(prev =>
                prev.map(notification =>
                  notification._id === notification._id ? { ...notification, is_read: true } : notification
                )
              )
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
      handleDropdownClose();
    }

    // if (notification.type === NOTIFICATION_TYPES.REEL) {
    //   router.push(`/reels/reel-detail/${notification.meta_data.reelId}`)
    // }
  }

  const handlePostDetails = (postId: string, is_read: boolean, notificationId: string) => {
    postApi
      .get_postDetails(postId)
      .then(response => {
        setPostDetail(response.data)
        setOpenPostDetails(true)

        if (!is_read) {
          notificationApi
            .update({ is_read: true, _id: notificationId })
            .then(({ data }) => {
              if (data.isSuccess) {
                setNotifications(prev =>
                  prev.map(notification =>
                    notification._id === notificationId ? { ...notification, is_read: true } : notification
                  )
                )
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
      .catch(error => {
        console.error('Error fetching post details:', error)
      })
  }

  const handleGotoReel = (reelId: string, is_read: boolean, notificationId: string) => {
    if (!is_read) {
      notificationApi
        .update({ is_read: true, _id: notificationId })
        .then(({ data }) => {
          if (data.isSuccess) {
            setNotifications(prev =>
              prev.map(notification =>
                notification._id === notificationId ? { ...notification, is_read: true } : notification
              )
            )
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    setOpenNotiReelDetail(false);
    handleDropdownClose();
    router.push(`/reels/reel-detail/${reelId}`)
  }

  // ** Vars
  const { direction } = settings

  const unReadNotification = useMemo(
    () =>
      notifications.reduce((prev, cur) => {
        return !cur.is_read ? prev + 1 : prev
      }, 0),
    [notifications]
  )

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const submitFollow = async (id: string, type: string) => {
    // setLoading(true);
    userApi
      .follow(id)
      .then(({ data }) => {
        if (data.isSuccess) {
          // setFollowed(!followed)
          setButtonDisabled(false);
          socket?.emit("send-follow-accept", {
            id,
            type: 'FOLLOW',
          });
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        return;
      })
  };

  const [noti, setNoti] = useState<any>();
  const handleDetailNoti = (notification: any) => {
    if (notification.meta_data.type === 'POST_WARNING') {
      setNoti(notification);
      setOpenNotiDetail(true)
    }
    if (notification.meta_data.type === "REEL_WARNING") {
      setNoti(notification);
      setOpenNotiReelDetail(true)
      // router.push(`/reels/reel-detail/${notification.meta_data.reelId}`)
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant={unReadNotification === 0 ? 'standard' : 'dot'}
          invisible={!notifications.length}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Icon fontSize='1.625rem' icon='tabler:bell' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              Notifications
            </Typography>
            <CustomChip skin='light' size='small' color='primary' label={`${unReadNotification || 0} New`} />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden} data={notifications}>
          {notifications.map((notification: NotificationsType, index: number) => (
            <MenuItem
              key={index}
              disableRipple
              disableTouchRipple
              sx={notification.is_read ? {} : { backgroundColor: `${theme.palette.primary.main}25` }}
              onClick={() => handleClick(notification)}
            >
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                {!notification.is_read && (
                  <Badge color='primary' variant='dot' sx={{ position: 'relative', left: '-12px' }} />
                )}
                {notification.meta_data.sender.role === 'Admin' ?
                  (<Avatar alt='/images/pages/heartsteel_purple.png' src='/images/pages/heartsteel_purple.png' />)
                  : <Avatar alt={notification.meta_data.sender?.firstName} src={notification.meta_data.sender.avatar} />
                }
                <Box sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }} onClick={() => handleDetailNoti(notification)}>
                  <MenuItemTitle>
                    {notification.meta_data.sender.role === 'Admin' ?
                      (<strong>Heartsteal</strong>) : <strong>{`${notification.meta_data.sender.lastName} ${notification.meta_data.sender.firstName}`}</strong>
                    }
                  </MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>{notification.title}</MenuItemSubtitle>
                  <Typography variant='body2' color={'primary'} sx={{ fontSize: '.75rem' }}>
                    {formatRelative(new Date(notification.createdAt), new Date())}
                  </Typography>
                </Box>
                {notification.type === NOTIFICATION_TYPES.FOLLOW && (
                  <Box sx={{ display: 'flex', gap: 2, marginTop: '.5rem' }}>
                    {buttonDisabled && notification.meta_data.type == NOTIFICATION_RES_TYPES.FOLLOW_REQUEST && (
                      <Button variant='contained' color='primary' onClick={() => submitFollow(notification.meta_data.sender._id, notification.meta_data.type)}>
                        Follow
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>

      <Dialog
        maxWidth='md'
        open={openPostDetails}
        onClose={handleClosePostDetails}
        aria-labelledby='form-dialog-title'
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              height: '100%'
            }
          }
        }}
      >
        <DialogContentText style={{ height: '100%' }}>
          <PostDetails postDetails={postDetail} />
        </DialogContentText>
        <IconButton
          aria-label='close'
          onClick={handleClosePostDetails}
          sx={{ top: 8, left: 10, position: 'absolute', color: 'grey.200' }}
        >
          <Icon icon='tabler:x' fontSize={'35px'} />
        </IconButton>
      </Dialog>

      {/* dialog warning post */}
      <Dialog maxWidth={'md'} open={openNotiDetail} onClose={handleCloseNotiDetail} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "30%",
            height: '25%'
          },
        },
      }}>
        <Box id='customized-dialog-title' sx={{ display: 'flex', justifyContent: 'space-between', padding: '7px' }}>
          <Typography variant='h6' component='span' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px auto' }}>
            <Icon icon='material-symbols:report-outline-rounded' style={{ fontSize: '35px', color: '#ffcc00', marginRight: '15px' }} />
            <span style={{ fontWeight: 900, fontFamily: 'monospace' }}> Warning of community violations by Heartsteel</span>
          </Typography>
        </Box>
        <Divider />
        <DialogTitle id='full-screen-dialog-title' sx={{ 'text-align': 'center', height: '60%', overflow: 'scroll', margin: '0px auto' }}>
          <span style={{ margin: '0px auto' }}>{noti?.title}</span>
        </DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0px auto' }}>
          <Button onClick={handleCloseNotiDetail}>Close</Button>
          <Button onClick={() => handlePostDetails(noti?.meta_data?.postId, noti?.is_read, noti?._id)}>Go to Post</Button>
        </Box>
      </Dialog>


      {/* dialog warning reel */}
      <Dialog maxWidth={'md'} open={openNotiReelDetail} onClose={handleCloseNotiReelDetail} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "30%",
            height: '25%'
          },
        },
      }}>
        <Box id='customized-dialog-title' sx={{ display: 'flex', justifyContent: 'space-between', padding: '7px' }}>
          <Typography variant='h6' component='span' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px auto' }}>
            <Icon icon='material-symbols:report-outline-rounded' style={{ fontSize: '35px', color: '#ffcc00', marginRight: '15px' }} />
            <span style={{ fontWeight: 900, fontFamily: 'monospace' }}> Warning of community violations by Heartsteel</span>
          </Typography>
        </Box>
        <Divider />
        <DialogTitle id='full-screen-dialog-title' sx={{ 'text-align': 'center', height: '60%', overflow: 'scroll', margin: '0px auto' }}>
          <span style={{ margin: '0px auto' }}>{noti?.title}</span>
        </DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0px auto' }}>
          <Button onClick={handleCloseNotiDetail}>Close</Button>
          <Button onClick={() => handleGotoReel(noti?.meta_data?.reelId, noti?.is_read, noti?._id)}>Go to Reel</Button>
        </Box>
      </Dialog>
    </Fragment>
  )
}

export default NotificationDropdown
