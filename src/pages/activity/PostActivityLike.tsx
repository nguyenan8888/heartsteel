import { Box, CircularProgress, ImageList, ImageListItem, Dialog, DialogContentText, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon';
import PostDetails from 'src/@core/components/list-post/[id]/PostDetails'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { activityApi, postApi } from 'src/@core/apis'

const PostActivityLike = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const [postDetail, setPostDetail] = useState(null);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    activityApi
      .get_activities('POST', 'LIKE')
      .then(({ data }) => {
        if (data.isSuccess) {
          setPosts(data.data.activity)
        } else {
          toast.error('Failed to fetch posts')
        }
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const handleClosePostDetails = () => setOpenPostDetails(false)

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

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {loading && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}

      <ImageList sx={{ width: '100%', height: '100%' }} cols={posts.length > 0 ? 3 : 1}>
        {posts.length > 0 ? posts.map((item: any) => (
          <ImageListItem key={item.post._id} onClick={() => handlePostDetails(item.post._id)}>
            <div
              style={{
                position: 'relative',
                paddingBottom: '100%', // Creates a padding-based square container
              }}
            >
              {(item.post.images[0].includes("/images") ? (
                <img style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures image fills the container
                }} src={item.post.images[0]} alt='image' />
              ) : item.post.images[0].includes("/videos") ? (
                <video muted style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures image fills the container
                }}>
                  <source src={item.post.images[0]} />
                </video>
              ) : null)}
            </div>
          </ImageListItem>
        )) : <div style={{width:'100%', display:"flex", justifyContent: 'center', alignItems:'center'}}>
            <Icon icon='fe:warning' fontSize={30} style={{marginRight:'10px', color:'orange'}}/>
            <Typography fontSize={30}>There is no activity.</Typography>
          </div>}
      </ImageList>

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
    </Box>
  )
}

export default PostActivityLike
