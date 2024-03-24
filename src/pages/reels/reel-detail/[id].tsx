/* eslint-disable lines-around-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid';
import Comment from "src/@core/layouts/components/shared-components/Comments/Comment";

// ** Next Import
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { Breakpoint } from '@mui/system'
import { useSettings } from 'src/@core/hooks/useSettings'
import Modal from '@mui/material/Modal';
import { reelApi } from 'src/@core/apis'
import { DialogTitle, DialogContentText } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSocket } from 'src/hooks/useSocket'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import Backdrop from '@mui/material/Backdrop';
import ReportReel from 'src/@core/layouts/components/shared-components/Report/ReportReel'
import EditReel from 'src/@core/layouts/components/shared-components/EditReel/EditReel';

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

const ReelDetail = () => {
  const router = useRouter();
  const { id }:any  = router.query;
  // const { listData, fetch, liked } = props
  const [isLiked, setIsLiked] = useState(false)
  const [listData, setListData] = useState()
  const [isSaved, setIsSaved] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [openEditReel, setOpenEditReel] = useState(false)

  const handleCloseEditReel = () => setOpenEditReel(false)
  const handleOpenEditReel = () => setOpenEditReel(true)

  const userIsPostOwner = listData?.user?._id === user?._id

  // ** Hook
  const {
    settings: { direction }
  } = useSettings()

  useEffect(() => {
    if(!id) return;
    fetchData();
  }, [id]);

  //post details
  const [openComment, setOpenComment] = useState(false)
  const handleClickOpenComment = () => setOpenComment(true)
  const handleCloseComment = () => setOpenComment(false)

  const fetchData = async () => {
    reelApi
    .detail(id)
    .then(({ data }) => {
      setListData(data.data)
      setIsLiked(data.data.isLiked)
      console.log(data.data)
    })
    .catch(err => {
      toast.error(err)
    })
    .finally(() => {
      return;
    })
  };

  const handleLike = (postId: string) => {    
    reelApi.reactReel(postId)
      .then(({ data }) => {
        if (data.isSuccess) {
          setIsLiked(data.data.reel.isLiked)
          if (!showHeart) {
            setShowHeart(true);
            setTimeout(() => {
              setShowHeart(false);
            }, 1000);
          }
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
    if (!listData?._id) return;
    reelApi.get_comments(listData?._id, page)
      .then((res) => {
        setComments((cmt: any) => [...cmt, ...res.data.data.comments])
        setTotalPage(res.data.data.totalPage)
      });
    socket?.on(`comment-reel-${listData?._id}`, (data) => {
      setComments((cmt: any) => [...cmt, data])
    })
  }, [listData?._id, page])

  const handleSendComment = (e: any) => {
    if (e.keyCode === 13 && comment?.trim() !== '') {
      const payload = {
        userId: user?._id,
        id: listData?._id,
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
    reelApi.get_comments(listData?._id, page + 1)
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
            <video controls muted loop style={{ width: '100%', height: '100%' }} src={listData?.video} autoPlay />
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
              <CustomAvatar src={listData?.user?.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
              <Typography style={{ marginRight: '5px', fontWeight: 'bold', color: 'white', }}>{listData?.user?.username}:</Typography>
              {listData?.content.length > 70 ? <Typography variant="body2" color="text.secondary" style={{ fontSize: 15, color: 'white' }}>
                {listData?.content.substring(0, 20)}{' '}...
              </Typography> :
                <Typography variant="body2" style={{ fontSize: 15, color: 'white' }} color="text.secondary">
                  {listData?.content}
                </Typography>}
            </CardContent>
          </div>
        </Card>
        <div>
          <div style={{ display: 'block' }}>
            <IconButton onClick={() => handleLike(listData?._id)}>
              {isLiked ? <FavoriteIcon style={{ color: '#ff3c3c' }} /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
          <div>
            <IconButton aria-label="comment" onClick={handleClickOpenComment}>
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
                    <Comment comments={comments} postDetails={listData} setComments={setComments}/>
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
          {!userIsPostOwner &&<div>
            <IconButton aria-label="share" onClick={handleClickOpenReport}>
              <ReportOutlinedIcon />
            </IconButton>
          </div>}
          {userIsPostOwner && <div style={{ display: 'block' }}>
            <IconButton onClick={handleOpenEditReel}>
              <Icon icon="lucide:edit" />
            </IconButton>
          </div>}
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
          <ReportReel type={type} postDetails={listData} handleCloseReport={handleCloseReport}  />
        </DialogContent>
      </Dialog>

      <Dialog maxWidth='xl' open={openEditReel} onClose={handleCloseEditReel} aria-labelledby='full-screen-dialog-title' sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        height: '100%'
                    },
                },
            }}>
                <DialogContentText style={{ height: '100%' }}>
                    {/* <EditReel postDetails={postDetails} handleCloseEditReel={handleCloseEditReel} /> */}
                    <EditReel reelDetails={listData} handleCloseEditReel={handleCloseEditReel} fetch={fetchData}/>
                </DialogContentText>
                <DialogTitle id='full-screen-dialog-title'>
                    <IconButton
                        aria-label='close'
                        onClick={handleCloseEditReel}
                        sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
                    >
                        <Icon icon='tabler:x' />
                    </IconButton>
                </DialogTitle>
            </Dialog>
    </div>
  )
}

export default ReelDetail
