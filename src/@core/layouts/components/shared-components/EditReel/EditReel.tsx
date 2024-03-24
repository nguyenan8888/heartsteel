/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Input, FormControl } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useState } from 'react'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'

// ** Custom Component Import
import TextField from '@mui/material/TextField'

import Switch from '@mui/material/Switch'

import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import UploadsImage from './UploadsImage'
import { useSettings } from 'src/@core/hooks/useSettings'
import toast from 'react-hot-toast'


// ** Apis
import { reelApi } from 'src/@core/apis'
import { useRouter } from 'next/router'


interface EditReelsProps {
  reelDetails?: any,
  handleCloseEditReel: () => void,
  fetch?: any
}
interface FormData {
  user: string
  content: string
  images: File[]
  is_public: boolean
}

const EditReel = (props: EditReelsProps) => {
  const { reelDetails, handleCloseEditReel, fetch } = props;
  const [loading, setLoading] = useState<boolean>(false)
  const {
    settings: { direction }
  } = useSettings()


  const [work, setWork] = useState({
    user: '',
    content: '',
    images: [reelDetails.video],
    is_public: true,
    ...(reelDetails || {})
  })

  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = e.target.files
    for (const file of newPhotos) {
      if (!file?.type.startsWith('video/')) {
        console.error(`Lỗi: không phải là video.`);
        continue;
      }
      setWork((prevWork: any) => {
        return {
          ...prevWork,
          images: [...prevWork.images, file],
        };
      });
    }
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setWork((prevWork: any) => {
      return {
        ...prevWork,
        [name]: value
      }
    })
    setType('null')
  }

  const handleToggleSwitch = () => {
    setWork((prevWork: any) => {
      return {
        ...prevWork,
        is_public: !prevWork.is_public
      }
    })
  }
  const [checkImages, setCheckImages] = useState(false)
  const handleCloseCheckImages = () => setCheckImages(false)

  const router = useRouter()
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    // Kiểm tra xem có hình ảnh được chọn không
    if (work.images.length === 0) {
      toast.error('Please select an image before sharing');
      setCheckImages(true)

      return;
    }
    setLoading(true)

    const formData = new FormData()
    formData.append('content', work.content)
    formData.append('is_public', work.is_public.toString())
    reelApi
      .editReel(reelDetails._id, formData)
      .then(() => {
        handleCloseEditReel()
        fetch()
      })
      .catch((error: any) => {
        console.error('Error submitting the post:', error)
        console.log(work.images[0])
        toast.error('An error occurred while submitting the post')
      })
      .finally(() => {
        setLoading(false)
      })
  }
const [type,setType] =useState('Edit')

  return (
    <>
    {checkImages ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Box sx={{textAlign:'center'}}>
              <Icon icon='tabler:alert-circle' fontSize='50px' style={{ color: '#d54a2a' }} />
              <Typography variant="body1" style={{ fontSize: '80px', margin: '10px 0px' }}>You Can't Post</Typography>
              <Typography variant="body1" style={{ fontSize: '20px', margin: '10px 0px' , fontStyle:'italic'}}>Please post your favorite video</Typography>
              <Button variant="contained" color="primary" onClick={handleCloseCheckImages}>
                Close
              </Button>
            </Box>
          </Box>
        ) : (
          <Card sx={{ width: '100%', minHeight: '100%' }}>
            <form style={{ width: '100%', height: '100%' }} onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
              <Box sx={{ width: '65%', height: '100%', display: 'flex', position: 'relative' }}>
                          {work.images.length < 1 && (
                            <Box sx={{ width: '100%', height: '100%' }}>
                              <input
                                id='image'
                                type='file'
                                style={{ display: 'none' }}
                                accept='video/*'
                                onChange={e => handleUploadPhotos(e)}
                                multiple
                              />
                              <label htmlFor='image' style={{ maxWidth: '100%', maxHeight: '100%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                                <Icon
                                  fontSize={100}
                                  icon='bi:upload'
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'grey',
                                    color: 'white',
                                    borderRadius: '5px',
                                    padding: '5px',
                                    maxWidth: '100%', maxHeight: '100%', cursor: 'pointer',
                                    margin: '0 auto'
                                  }}
                                />
                              </label>
                            </Box>
                          )}
                          {work.images.length > 0 && (
                            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                              <UploadsImage setWork={setWork} work={work} />
                            </Box>
                          )}
                        </Box>
      
                <Box sx={{ width: '35%', minHeight: '100%', display: 'flex', flexDirection: 'column', marginX: '20px', }}>
                  <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 2 }} src={work?.user.avatar} >
                      {work?.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box> {work?.user.username}</Box>
                  </Box>
                  <Box sx={{ marginBottom: 4 }}>
                    <TextField
                      rows={8}
                      multiline
                      variant='standard'
                      placeholder="What's happening?"
                      id='textarea-standard-static'
                      onChange={handleChange}
                      value={work.content}
                      name='content'
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ marginBottom: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '1.4rem', fontWeight: '500' }}>
                        Publish Post
                      </Typography>
                      <Switch size='medium' checked={work.is_public} onChange={handleToggleSwitch} />
                    </Box>
                    <Typography sx={{ fontSize: 13 }}>
                      Only you will see the total number of likes and views on this post. You can change this later by going
                      to the ··· menu at the top of the post. To hide like counts on other people's posts, go to your
                      account settings.
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ marginBottom: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '1.4rem', fontWeight: '500' }}>Turn off commenting</Typography>
                      <Switch size='medium' />
                    </Box>
                    <Typography sx={{ fontSize: 13 }}>
                      You can change this later by going to the ··· menu at the top of your pos
                    </Typography>
                  </Box>
                  <Divider />
                  <Button type='submit' variant='outlined' size='medium' style={{ marginTop: 4 }}>
                    Save
                  </Button>
                </Box>
              </Box>
            </form>
      
          </Card>)}
    </>
  )
}

export default EditReel
