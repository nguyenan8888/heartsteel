/* eslint-disable lines-around-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

// ** Next Import
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import DialogReport from './DialogReport'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import SwiperImages from 'src/views/components/swiper/SwiperImages'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import ListItemButton from '@mui/material/ListItemButton'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TextField from '@mui/material/TextField'
import React, { useState, useEffect } from 'react'
import { Box, Breakpoint } from '@mui/system'
import { useSettings } from 'src/@core/hooks/useSettings'
import { postApi, userApi } from 'src/@core/apis'
import { DialogContentText } from '@mui/material'
import PostDetails from './[id]/PostDetails'
import Comment from "src/@core/layouts/components/shared-components/Comments/Comment";

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSocket } from 'src/hooks/useSocket'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import postDetails from 'src/pages/post-details'

interface ListPost {
  listData: any,
}

const ListPost = (props: ListPost) => {
  const router = useRouter()
  const { listData } = props
  const [isSaved, setIsSaved] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [isLikedList, setIsLikedList] = useState<boolean[]>([])
  const [isSavedList, setIsSavedList] = useState<boolean[]>([])

  useEffect(() => {
    // Tạo một mảng mới chứa giá trị boolean tương ứng với từng phần tử trong listData
    const newIsLikedList = listData.map((item: any) => item.isLiked);
    const newIsSavedList = listData.map((item: any) => item.isSaved);
    
    // Cập nhật trạng thái isLikedList
    setIsLikedList(newIsLikedList);
    setIsSavedList(newIsSavedList);
  }, [listData]);

  const handleLike = (postId: string, index: any) => {
    postApi.reactPost(postId)
      .then(({ data }) => {
        if (data.isSuccess) {
          setIsLikedList(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];

            return newState;
          });
          if (!showHeart) {
            setShowHeart(true);
            setTimeout(() => {
              setShowHeart(false);
            }, 1000);
          }
          const payload = {
            postId: postId,
            type: 'POST',
          }
          socket?.emit("send-post-like", payload);
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })

  }

  const handleSave = (id: string, index: any) => {
    userApi.savePost(id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setIsSavedList(prevState => {
            const newState = [...prevState];
            newState[index] = true;

            return newState;
          });
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
  }

  const handleUnSave = (id: string, index: any) => {
    userApi.unSavePost(id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setIsSavedList(prevState => {
            const newState = [...prevState];
            newState[index] = false;

            return newState;
          });
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
  }

  // const openCommentDialog = () => {
  //   return ()
  // }
  // ** Hook
  const {
    settings: { direction }
  } = useSettings()


  //post details
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const handleClickOpenPostDetails = () => setOpenPostDetails(true)
  const handleClosePostDetails = () => setOpenPostDetails(false)

  const [postDetail, setPostDetail] = useState(null);
  const handlePostDetails = (postId: string) => {
    postApi.get_postDetails(postId)
      .then(response => {
        setPostDetail(response.data);
        setOpenPostDetails(true);

      })
      .catch(error => {
        console.error('Error fetching post details:', error);
      });
  };

  //comment
  const [comment, setComment] = useState<string>();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);

  const handleSendComment = (e: any, postId: any) => {
    if (e.keyCode === 13 && comment?.trim() !== '') {
      const payload = {
        userId: user?._id,
        id: postId,
        content: comment?.trim(),
        image: user?.avatar,
        type: 'POST',
      }
      socket?.emit("comment", payload);
      setComment('');
      socket?.emit("send-post-comment", payload);

      socket?.on(`comment-post-${postId}`, (data) => {
        setComments([data]);
      })
    }
  }

  return (
    <List>
      {listData.map((e: any, i: any) => (
        <ListItem key={i}>
          <Card sx={{ width: '45%', margin: '5px auto' }}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" alt={e.user.username} src={e.user.avatar} onClick={() => { router.push(`/user-profile/${e.user._id}`) }} />
              }
              action={<DialogReport postDetails={e} />}
              title={<Typography variant="body2" color="text.secondary" onClick={() => { router.push(`/user-profile/${e.user._id}`) }}>
                {e.user.username}
              </Typography>}
              subheader={new Date(e.createdAt).toLocaleString()}
            />
            <div onDoubleClick={() => handleLike(e?._id, i)}>
              {showHeart && (
                <FavoriteIcon
                  style={{
                    color: 'white',
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: 1, // Thêm zIndex để đảm bảo icon nằm trên swiper
                  }}
                  fontSize='large'
                />
              )}
              <KeenSliderWrapper>
                <SwiperImages
                  listData={e.images}
                  direction={direction}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </KeenSliderWrapper>
            </div>
            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
              {/* <Typography style={{ marginRight: '5px', fontWeight: 'bold' }}>{e.user.username}:</Typography> */}
              {e.content.length > 70 ? <Typography variant="body2" color="text.secondary">
                {e.content.substring(0, 70)}{' '}
                <Button style={{ padding: 0, margin: 0, marginBottom: '2px' }} onClick={() => handlePostDetails(e._id)}>...xem thêm</Button>
              </Typography> :
                <Typography variant="body2" color="text.secondary">
                  {e.content}
                </Typography>}
            </CardContent>
            <CardActions style={{ paddingLeft: 15, paddingBottom: 5, display: 'flex', justifyContent: 'space-between' }} disableSpacing>
              <div>
                <IconButton onClick={() => handleLike(e?._id, i)}>
                  {isLikedList[i] ? <FavoriteIcon style={{ color: '#ff3c3c' }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton aria-label="comment">
                  <ModeCommentIcon onClick={() => handlePostDetails(e._id)} />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </div>
              <div>
                <IconButton
                  aria-label="save"
                  onClick={() => (isSavedList[i] ? handleUnSave(e?._id, i) : handleSave(e?._id, i))}
                >
                  {isSavedList[i] ? <TurnedInIcon /> : <TurnedInNotIcon />}

                </IconButton>
              </div>
            </CardActions>
            <CardActions style={{ paddingTop: 5 }}>
              <Typography variant="body2" color="text.secondary">
                Total likes: {e?.totalLike}
              </Typography>
            </CardActions>
            <CardActions style={{ paddingTop: 0 }} onClick={() => handlePostDetails(e._id)}>
              <Typography variant="body2" color="text.secondary">
                All comments
              </Typography>
            </CardActions>
            <CardActions style={{ paddingTop: 0 }}>
              {/* {
                comments[0]?.postId === e._id &&
                <Box style={{ width: '100%' }} >
                  <Comment comments={comments} postDetails={e} />
                </Box>
              } */}
            </CardActions>
            <CardActions style={{ paddingTop: 0 }}>
              <TextField style={{ width: '100%' }} id="commet" label="Add a comment" variant="standard"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                onKeyDown={(event) => handleSendComment(event, e._id)}
              />
            </CardActions>

          </Card>
        </ListItem>
      ))}

      {/* post details */}
      <Dialog maxWidth='md' open={openPostDetails} onClose={handleClosePostDetails} aria-labelledby='form-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogContentText style={{ height: '100%' }}>
          <PostDetails postDetails={postDetail} />
        </DialogContentText>
        <IconButton
          aria-label='close'
          onClick={handleClosePostDetails}
          sx={{ top: 8, left: 10, position: 'absolute', color: 'grey.200' }}
        >
          <Icon icon='tabler:x' fontSize={"35px"} />
        </IconButton>
      </Dialog>
    </List>
  )
}

export default ListPost
