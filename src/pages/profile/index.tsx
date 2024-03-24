// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Icon from 'src/@core/components/icon';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import storage from 'src/@core/utils/storage'

// ** Apis
import { postApi, userApi, reelApi } from 'src/@core/apis'
import toast from 'react-hot-toast'
import ListUser from 'src/@core/components/pop-up/list-user'
import DialogContentText from '@mui/material/DialogContentText'
import PostDetails from 'src/@core/components/list-post/[id]/PostDetails'
import IconButton from '@mui/material/IconButton'

import { EditorState, convertFromHTML, Editor, ContentState } from 'draft-js'

const Profile = () => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const [profile, setProfile] = useState<any>({})
  const userData = storage.getProfile();
  const [open, setOpen] = useState<boolean>(false)
  const [popUpTitle, setPopUpTitle] = useState<boolean>(false)
  const [listDataFollower, setListDataFollower] = useState<any>([])
  const [listDataFollowing, setListDataFollowing] = useState<any>([])
  const [post, setPost] = useState<any>([]);
  const [reel, setReel] = useState<any>([]);
  const [savedPost, setSavedPost] = useState<any>([]);
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const [postDetail, setPostDetail] = useState(null);
  const [bioValue, setBioValue] = useState<any>(EditorState.createEmpty())
  const [totalPost, setTotalPost] = useState<number>(0);
  const [totalFollower, setTotalFollower] = useState<number>(0);
  const [totalFollowing, setTotalFollowing] = useState<number>(0);

  const handleClosePostDetails = () => setOpenPostDetails(false)

  const handleClickOpenPopUpFollower = () => {
    setPopUpTitle(true)
    setOpen(true)
  }

  const handleClickOpenPopUpFollowing = () => {
    setPopUpTitle(false)
    setOpen(true)
  }

  const handleClosePopUp = () => setOpen(false)

  useEffect(() => {
    if (!userData._id) return;
    fetchDataFollowing()
    fetchDataFollowers()
    fetchData();
    fetchDataPost();
    fetchDataSavedPost()
    fetchDataReel()
  }, []);

  const handlePostDetails = (postId: any) => {
    postApi.get_postDetails(postId)
      .then(response => {
        setPostDetail(response.data);
        setOpenPostDetails(true);
      })
      .catch(error => {
        console.error('Error fetching post details:', error);
      });
  };

  const fetchDataFollowing = async () => {
    setLoading(true);

    userApi
      .getFollowing(userData._id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setListDataFollowing(data.data.followings)
          setTotalFollowing(data.data.totalDocuments)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchDataPost = async () => {
    setLoading(true);

    postApi
      .get_posts(userData._id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setPost(data.data.posts)
          setTotalPost(data.data.totalDocuments)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchDataReel = async () => {
    setLoading(true);

    reelApi
      .personal(userData._id)
      .then(({ data }) => {
        setReel(data.data.reels)
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchDataSavedPost = async () => {
    setLoading(true);
    userApi
      .getSavedPosts()
      .then(({ data }) => {
        if (data.isSuccess) {
          setSavedPost(data.data)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchDataFollowers = async () => {
    setLoading(true);
    userApi
      .getFollowers(userData._id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setListDataFollower(data.data.followers)
          setTotalFollower(data.data.totalDocuments)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchData = async () => {
    setLoading(true);

    userApi
      .profile(userData._id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setProfile(data.data.user)
          if (data?.data?.user?.biography) {
            setBioValue(EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(data.data.user.biography).contentBlocks
              )
            ));
          }
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent style={{ display: 'flex' }}>
            <Avatar
              style={{ margin: '0 50px' }}
              alt='John Doe'
              src={profile.avatar ? profile.avatar : '/images/avatars/1.png'}
              sx={{ width: 150, height: 150 }}
            />
            <Typography style={{ marginLeft: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontWeight: 'bold', margin: '0' }} sx={{ mb: 2 }}>
                  {profile.username}
                </Typography>
                <Button variant='contained' style={{ marginLeft: '20px' }} onClick={() => { router.push('/account-settings') }}>Edit Profile</Button>
                {/* <Button variant='contained' style={{ marginLeft: '20px' }} onClick={() => { router.push('/archive') }}>View archive</Button> */}
              </div>
              <Typography style={{ display: 'flex', margin: '20px 0' }}>
                <Typography style={{ display: 'flex', marginRight: '40px' }}>
                  <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>{totalPost}</Typography>posts
                </Typography>
                <Typography onClick={handleClickOpenPopUpFollower} style={{ display: 'flex', marginRight: '40px' }}>
                  <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>{totalFollower}</Typography>followers
                </Typography>
                <Typography onClick={handleClickOpenPopUpFollowing} style={{ display: 'flex', marginRight: '40px' }}>
                  <Typography style={{ fontWeight: 'bold', margin: '0 4px' }}>{totalFollowing}</Typography>following
                </Typography>
              </Typography>
              <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }} sx={{ mb: 2 }}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Editor onChange={data => setBioValue(data)} editorState={bioValue} readOnly />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TabContext value={value}>
              <TabList centered onChange={handleChange} aria-label='simple tabs example'>
                <Tab value='1' label={<div style={{ display: 'flex' }}><Icon icon='ph:layout' fontSize={20} style={{ marginRight: '5px' }} />Posts</div>} />
                <Tab value='2' label={<div style={{ display: 'flex' }}><Icon icon='ep:video-play' fontSize={18} style={{ marginRight: '5px' }} />Reels</div>} />
                <Tab value='3' label={<div style={{ display: 'flex' }}><Icon icon='icon-park-outline:tag' fontSize={18} style={{ marginRight: '5px' }} />Saved</div>} />
              </TabList>
              <TabPanel value='1'>
                <ImageList sx={{ width: '100%', height: "100%" }} cols={3}>
                  {post.map((item: any) => (
                    <ImageListItem key={item._id} onClick={() => handlePostDetails(item._id)}>
                      <div
                        style={{
                          position: 'relative',
                          paddingBottom: '100%', // Creates a padding-based square container
                        }}
                      >
                        {(item.images[0].includes("/images") ? (
                          <img style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }} src={item.images[0]} alt='image' />
                        ) : item.images[0].includes("/videos") ? (
                          <video muted style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }}>
                            <source src={item.images[0]} />
                          </video>
                        ) : null)}
                        {/* <img
                          src={`${item.images[0]}?w=164&h=164&fit=crop&auto=format`}
                          alt={item.content}
                          loading="lazy"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }}
                        /> */}
                      </div>
                    </ImageListItem>
                  ))}
                </ImageList>
              </TabPanel>
              <TabPanel value='2'>
                <ImageList sx={{ width: '100%', height: "100%" }} cols={3}>
                  {reel.map((item: any) => (
                    <ImageListItem key={item._id} onClick={() => router.push(`/reels/reel-detail/${item._id}`)}>
                      <div
                        style={{
                          position: 'relative',
                          paddingBottom: '100%', // Creates a padding-based square container
                        }}
                      >
                        {(item.video.includes("/images") ? (
                          <img style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }} src={item.video} alt='image' />
                        ) : item.video.includes("/videos") ? (
                          <video muted style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }}>
                            <source src={item.video} />
                          </video>
                        ) : null)}
                      </div>
                    </ImageListItem>
                  ))}
                </ImageList>
              </TabPanel>
              <TabPanel value='3'>
                <ImageList sx={{ width: '100%', height: '100%' }} cols={3}>
                  {savedPost && savedPost.map((item: any) => (
                    <ImageListItem key={item._id} onClick={() => handlePostDetails(item._id)}>
                      <div
                        style={{
                          position: 'relative',
                          paddingBottom: '100%', // Creates a padding-based square container
                        }}
                      >
                        {(item.images[0].includes("/images") ? (
                          <img style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }} src={item.images[0]} alt='image' />
                        ) : item.images[0].includes("/videos") ? (
                          <video muted style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures image fills the container
                          }}>
                            <source src={item.images[0]} />
                          </video>
                        ) : null)}
                      </div>
                    </ImageListItem>
                  ))}
                </ImageList>
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
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
          <PostDetails postDetails={postDetail} fetch={() => handlePostDetails(postDetail?.data?.post?._id)}/>
        </DialogContentText>
        <IconButton
          aria-label='close'
          onClick={handleClosePostDetails}
          sx={{ top: 8, left: 10, position: 'absolute', color: 'grey.200' }}
        >
          <Icon icon='tabler:x' fontSize={"35px"} />
        </IconButton>
      </Dialog>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'xs'}
        scroll={'paper'}
        onClose={handleClosePopUp}
        aria-labelledby='customized-dialog-title'
        aria-describedby='scroll-dialog-description'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4, display: 'flex', justifyContent: 'space-between', marginLeft: '20px' }}>
          <Typography variant='h6' component='span' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {popUpTitle ? 'Follower' : 'Following'}
          </Typography>
          <Button aria-label='close' onClick={handleClosePopUp}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <ListUser listData={popUpTitle ? listDataFollower : listDataFollowing} />
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default Profile
