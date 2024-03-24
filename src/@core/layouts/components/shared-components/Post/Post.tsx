import { Avatar, Card, CardActions, CardContent, CardHeader, Dialog, IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider';
import SwiperControls from 'src/views/components/swiper/SwiperControls';
import DialogSizes from 'src/views/pages/dialog';
import PostDetails from './PostDetails';
import { Breakpoint, height, maxWidth } from '@mui/system';
import { useSettings } from 'src/@core/hooks/useSettings';
import { red } from '@mui/material/colors';
import { Box, useTheme } from "@mui/system";
import Icon from 'src/@core/components/icon'

interface Post {
  user: string;
  content: string;
  images: string[];
  is_public: boolean;
}
const Post = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = useState<boolean>(false)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('xl')
  const handleClose = () => setOpen(false)
  const handleClickOpen = () => setOpen(true)
  const {
    settings: { direction }
  } = useSettings();
  const [post, setPost] = useState<Post | null>(null); // State to store the post data

  // useEffect(() => {
  //   // Assuming the user data is stored in local storage with the key "userData"
  //   const userData = localStorage.getItem('userData');
  
  //   if (userData) {
  //     const userObject = JSON.parse(userData);
  //     const userId = userObject._id;
  //     if(!userId){
  //       console.log("lỗi");
  //     }
  //     console.log(post);
  //     postApi.get_posts()
  //       .then(response => {
  //         setPost(response.data);
  //         console.log(post);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching post data:', error);
  //       });
  //   }
  // }, []); 


  return (
    <div>
      <Card sx={{ width: 600, margin: '20px auto' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          action={<DialogSizes />}
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <KeenSliderWrapper>
          <SwiperControls direction={direction} style={{ height: 500, width: '100%' }} />
        </KeenSliderWrapper>



        <CardContent>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }} >
            <Box>
              <Icon icon='iconamoon:heart-light' fontSize={35} style={{ marginRight: '10px' }} />
              <Icon icon='tabler:message-circle-2' fontSize={35} style={{ marginRight: '10px' }} />
              <Icon icon='bitcoin-icons:share-outline' fontSize={35} style={{ marginRight: '10px', }} />
            </Box>
            <Box>
              <Icon icon='material-symbols:bookmark-outline' fontSize={35} />
            </Box>
          </Box>
          <Box style={{ paddingTop: 5 }}>
            <Typography variant="body2" color="text.secondary" fontSize={"18px"} >
              100 like
            </Typography>
          </Box>
          <Box style={{ paddingTop: 5 }} onClick={handleClickOpen}>
            <Typography variant="body2" color="text.secondary">
              Views all 69 comments
            </Typography>
          </Box>
          <Box style={{ paddingTop: 5 }}>
            <TextField style={{ width: '100%' }} id="commet" variant="standard" placeholder='Add a comment…' />
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <PostDetails />
      </Dialog>
    </div>
  )
}

export default Post
