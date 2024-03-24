/* eslint-disable lines-around-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactPlayer from 'react-player'

// ** MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Comment from "src/@core/layouts/components/shared-components/Comments/Comment";

// ** Next Import
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import SwiperImages from 'src/views/components/swiper/SwiperImages'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import ListItemButton from '@mui/material/ListItemButton'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { Breakpoint } from '@mui/system'
import { useSettings } from 'src/@core/hooks/useSettings'
import Modal from '@mui/material/Modal';
import { postApi, reelApi, userApi } from 'src/@core/apis'
import { DialogContentText, DialogTitle } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSocket } from 'src/hooks/useSocket'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import PostDetails from '../list-post/[id]/PostDetails'
import Backdrop from '@mui/material/Backdrop';
import Fab from '@mui/material/Fab'
import ReportReel from 'src/@core/layouts/components/shared-components/Report/ReportReel'

interface ListPost {
  listData: any,
  fetch?: any,
  liked: boolean
}

const style = {
  position: 'absolute' as const,
  top: '68%',
  left: '84%',
  transform: 'translate(-50%, -50%)',
  width: '20%',
  height: '450px',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: '10px',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const ListReel = (props: ListPost) => {
  const router = useRouter()
  const { listData, fetch, liked } = props
  const [isSaved, setIsSaved] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>();
  const { socket } = useSocket();
  const { user } = useAuth();

  // ** Hook
  const {
    settings: { direction }
  } = useSettings()


  //post details
  const [openComment, setOpenComment] = useState(false)
  const handleClickOpenComment = (postId: string) => {
  console.log('listData._id', postId);

    // if (!listData._id) return;
    reelApi.get_comments(postId, page)
      .then((res) => {
        setComments(res.data.data.comments)
        setTotalPage(res.data.data.totalPage)
        fetch()
      });
    setOpenComment(true)
  }

  const handleCloseComment = () => setOpenComment(false)

  const handleLike = (postId: string) => {
    reelApi.reactReel(postId)
      .then(({ data }) => {
        if (data.isSuccess) {
          if (!showHeart) {
            setShowHeart(true);
            setTimeout(() => {
              setShowHeart(false);
            }, 1000);
          }
          fetch()
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
  }

  // const handleSave = (id: string) => {
  //   userApi.savePost(id)
  //     .then(({ data }) => {
  //       if (data.isSuccess) {
  //         setIsSaved(true)
  //       } else {
  //         toast.error(data.message)
  //       }
  //     })
  //     .catch(err => {
  //       toast.error(err?.response)
  //     })
  // }

  // const handleUnSave = (id: string) => {
  //   userApi.unSavePost(id)
  //     .then(({ data }) => {
  //       if (data.isSuccess) {
  //         setIsSaved(false)
  //       } else {
  //         toast.error(data.message)
  //       }
  //     })
  //     .catch(err => {
  //       toast.error(err?.response)
  //     })
  // }

  
  // comment
  useEffect(() => {
    socket?.on(`comment-reel-${listData._id}`, (data) => {
      setComments((cmt: any) => [...cmt, data])
    })
  }, [listData._id, page])

  const handleSendComment = (e: any) => {
    if (e.keyCode === 13 && comment?.trim() !== '') {
      const payload = {
        userId: user?._id,
        id: listData._id,
        content: comment?.trim(),
        image: user?.avatar,
        type: 'REEL',
      }
      socket?.emit("comment", payload);
      setComment('');
      socket?.emit("send-reel-comment", payload);
    }
  }

  const handleGetMoreComment = () => {
    reelApi.get_comments(listData._id, page + 1)
      .then((res) => {
        setComments((cmt: any) => [...cmt, ...res.data.data.comments])
        setPage(page + 1)
      });
  }

  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
  // open Report
  const [openReport, setOpenReport] = useState(false)

  // ** Hooks
  const handleClickOpenReport = () => setOpenReport(true)
  const handleCloseReport = () => setOpenReport(false);
  const type = 'Reel'

  const userYourReel = user?._id === listData.user?._id


  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'end', width: '100%' }}>
        <Card sx={{ width: '33.33%', height: 'calc(4 * 3.9 * 2.7vw)', position: 'relative' }}>
          <Box className='keen-slider__slide' style={{
            width: '100%', // Chiều rộng cố định
            backgroundColor: 'black', // Màu nền
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `100%`,
          }}>
            <video controls muted loop style={{ width: '100%', height: '100%' }} src={listData.video} autoPlay />
          </Box>
          <div
            style={{
              color: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              marginLeft: 15,
              marginBottom: 65
            }}>
            <CardContent style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, width: '100%' }}>
              <CustomAvatar src={listData.user.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
              <Typography style={{ marginRight: '5px', fontWeight: 'bold', color: 'white', }}>{listData.user.username}:</Typography>
              {listData.content.length > 70 ? <Typography variant="body2" color="text.secondary" style={{ fontSize: 15, color: 'white' }}>
                {listData.content.substring(0, 20)}{' '}...
              </Typography> :
                <Typography variant="body2" style={{ fontSize: 15, color: 'white' }} color="text.secondary">
                  {listData.content}
                </Typography>}
            </CardContent>
          </div>
        </Card>
        <div>
          <div style={{ display: 'block' }}>
            <IconButton onClick={() => handleLike(listData?._id)}>
              {liked ? <FavoriteIcon style={{ color: '#ff3c3c' }} /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
          <div>
            <IconButton aria-label="comment" onClick={() => handleClickOpenComment(listData?._id)}>
              <ModeCommentIcon />
            </IconButton>

            {/* post details */}
            <Modal
              open={openComment}
              onClose={handleCloseComment}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  sx: {
                    //Your style here....
                    backgroundColor: 'transparent',
                  },
                },
              }}
            >
              <Box sx={style}>
                <div>
                  <Box style={{ overflow: 'scroll', height: '350px' }}>
                    <Comment comments={comments} postDetails={listData} setComments={setComments} />
                    {totalPage > 1 && <CardActions style={{ paddingTop: 0 }} onClick={handleGetMoreComment}>
                      <Typography variant="body2" color="text.secondary">
                        Read more comments
                      </Typography>
                    </CardActions>}
                  </Box>
                </div>
                <div>
                  <Box>
                    <Grid container wrap="nowrap" spacing={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <Grid item sx={{ marginTop: '15px' }}>
                        <Avatar aria-label="recipe" sx={{ width: 30, height: 30 }} src={user?.avatar}>{user?.username.charAt(0).toUpperCase()}</Avatar>
                      </Grid>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <TextField
                          style={{ width: '100%' }}
                          id="comment"
                          label="Add a comment"
                          variant="standard"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          onKeyDown={(event) => handleSendComment(event)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              </Box>
            </Modal>
          </div>
          {/* <div>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </div> */}
          {/* <div>
            <IconButton
              aria-label="save"
            // onClick={() => (isSaved ? handleUnSave(listData?._id) : handleSave(listData?._id))}
            >
              {isSaved ? <TurnedInIcon /> : <TurnedInNotIcon />}

            </IconButton>
          </div> */}
          {!userYourReel ? (
            <div>
              <IconButton aria-label="share" onClick={handleClickOpenReport}>
                <ReportOutlinedIcon />
              </IconButton>
            </div>
          ) : null}
        </div>
      </div>

      {/* Report Reel */}
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={openReport} onClose={handleCloseReport} aria-labelledby='full-screen-dialog-title'>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseReport}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* <Report type={type} postDetails={post} handleCloseReport={handleCloseReport} /> */}
          <ReportReel type={type} postDetails={listData} handleCloseReport={handleCloseReport} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ListReel
