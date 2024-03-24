import { CircularProgress, Typography, Box, AccordionDetails, Accordion, AccordionSummary, DialogContentText, Dialog, IconButton, Button } from '@mui/material'
import PostDetails from 'src/@core/components/list-post/[id]/PostDetails'
import Icon from 'src/@core/components/icon';
import MuiAvatar from '@mui/material/Avatar'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { activityApi, postApi } from 'src/@core/apis'
import CustomAvatar from 'src/@core/components/mui/avatar'

const PostActivityComment = () => {
  const [buckets, setBuckets] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const [postDetail, setPostDetail] = useState(null);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    activityApi
      .get_activities('POST', 'COMMENT')
      .then(({ data }) => {
        if (data.isSuccess) {
          setBuckets(data.data.activity)
        } else {
          toast.error('Failed to fetch')
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
    <Box>
      {loading && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}
      <div style={{ width: '100%', height: '100%' }}>
        {buckets.length > 0 ? buckets.map((e: any, index: any) => (
          <Accordion key={index}>
            <AccordionSummary
              id='panel-header-2'
              aria-controls='panel-content-2'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => handlePostDetails(e?.post?._id)}>
                {(e?.post?.images[0].includes("/images") ? (
                  <img style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }} src={e?.post?.images[0]} alt='image' />
                ) : e?.post?.images[0].includes("/videos") ? (
                  <video muted style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }}>
                    <source src={e?.post?.images[0]} />
                  </video>
                ) : <div style={{ marginRight: '5px', width: 48, height: 48, backgroundColor: 'black' }}></div>)}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {e?.post?.content.length > 70 ? <Typography variant="body2" color="text.secondary">
                    {e?.post?.content.substring(0, 70)}{' '}
                    <Button style={{ padding: 0, margin: 0, marginBottom: '2px' }} onClick={() => handlePostDetails(e?.post?._id)}>...xem thêm</Button>
                  </Typography> :
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {e?.post?.content}
                    </Typography>}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar src={e?.post?.user.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
                    <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                      {e?.post?.user.username}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {e.comments.length > 0 ? e.comments.map((comment: any, index: any) => (
                <Box key={index} sx={{ mb: '.5rem', display: 'flex', alignItems: 'center' }}>
                  <MuiAvatar
                    src={comment.user.avatar}
                    alt={`${comment.user.username}`}
                    sx={{
                      width: 36,
                      height: 36,
                      outline: '2px solid transparent'
                    }}
                  />
                  <Box sx={{ ml: '.5rem' }}>
                    <Typography>
                      <strong>{`${comment.user.lastName} ${comment.user.firstName}`}</strong>
                      <span style={{ marginLeft: '.5rem' }}>{comment.content}</span>
                    </Typography>
                  </Box>
                </Box>
              )) : <></>}
            </AccordionDetails>
          </Accordion>
        )) : <div style={{ width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
          <Icon icon='fe:warning' fontSize={30} style={{ marginRight: '10px', color: 'orange' }} />
          <Typography fontSize={30}>There is no activity.</Typography>
        </div>}
      </div>

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

export default PostActivityComment
