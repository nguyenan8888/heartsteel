/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Input, FormControl } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
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

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import PropTypes from 'prop-types'

// ** Apis
import { postApi } from 'src/@core/apis'
import { useRouter } from 'next/router'
import { log } from 'console'
import { useAuth } from 'src/hooks/useAuth'

// ** MUI Imports
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
const defaultValues = {
  user: '',
  content: '',
  images: '',
  is_public: true
}
interface FormData {
  user: string
  content: string
  images: File[]
  is_public: boolean
}
interface AddPostProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  fetchData?: any
}

const AddPost: React.FC<AddPostProps> = ({ setOpen, fetchData }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [can_comment, setCanComment] = useState<boolean>(true)
  const {
    settings: { direction }
  } = useSettings()

  const [work, setWork] = useState({
    user: '',
    content: '',
    images: [],
    is_public: true,
    can_comment: true
  })


  useEffect(() => {
    handleChange({
      target: {
        name: 'content',
        value: work.content
      }
    });
  }, [work.images]);



  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = e.target.files
    setWork(prevWork => {
      return {
        ...prevWork,
        images: [...prevWork.images, ...newPhotos]
      }
    })
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setWork(prevWork => {
      return {
        ...prevWork,
        [name]: value
      }
    })
  }

  const handleToggleSwitch = () => {
    setWork(prevWork => {
      return {
        ...prevWork,
        is_public: !prevWork.is_public
      }
    })
  }

  const handleCommentToggleSwitch = () => {
    setCanComment(!can_comment)
  }

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
    formData.append('can_comment', can_comment.toString())
    for (let i = 0; i < work.images.length; i++) {
      formData.append('files', work.images[i]);
    }
    postApi
      .create_post(formData)
      .then(({ data }) => {
        if (data.isSuccess) {
          const { user, content, images, is_public } = data.data
          setOpen(false)
          fetchData();
        } else {
          toast.error(data.message)
        }
      })
      .catch(error => {
        toast.error('An error occurred while submitting the post')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const [checkImages, setCheckImages] = useState(false)
  const handleCloseCheckImages = () => setCheckImages(false)
  const { user } = useAuth();
  console.log('ueser', user)

  return (

    <>
      {
        checkImages ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Box sx={{textAlign:'center'}}>
              <Icon icon='tabler:alert-circle' fontSize='50px' style={{ color: '#d54a2a' }} />
              <Typography variant="body1" style={{ fontSize: '80px', margin: '10px 0px' }}>You Can't Post</Typography>
              <Typography variant="body1" style={{ fontSize: '20px', margin: '10px 0px' , fontStyle:'italic'}}>Please post your favorite photo/video</Typography>
              <Button variant="contained" color="primary" onClick={handleCloseCheckImages}>
                Close
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {
              loading ?
                (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Box sx={{}}>
                      <CircularProgress size={100} sx={{ width: '500px' }} />
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
                                accept='image/*,video/*'
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

                              <KeenSliderWrapper sx={{ width: '100%', height: '100%' }}>
                                <UploadsImage setWork={setWork} work={work} direction={direction} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                              </KeenSliderWrapper>

                              <input
                                id='image'
                                type='file'
                                style={{ display: 'none' }}
                                accept='image/*,video/*'
                                onChange={e => handleUploadPhotos(e)}
                                multiple
                              />
                              <label htmlFor='image' style={{ position: 'absolute', bottom: 0 }}>
                                <Icon
                                  icon='bi:upload'
                                  fontSize={50}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'grey',
                                    color: 'white',
                                    borderRadius: '5px',
                                    padding: '5px',
                                    margin: 20
                                  }}
                                />
                              </label>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ width: '35%', minHeight: '100%', display: 'flex', flexDirection: 'column', marginX: '20px', }}>
                          <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 2 }} src={user?.avatar} >
                              {user?.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box> {user?.username}</Box>
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
                              <Typography sx={{ fontSize: '1.4rem', fontWeight: '500' }}>Turn on commenting</Typography>
                              <Switch size='medium' checked={can_comment} onChange={handleCommentToggleSwitch}/>
                            </Box>
                            <Typography sx={{ fontSize: 13 }}>
                              You can change this later by going to the ··· menu at the top of your pos
                            </Typography>
                          </Box>
                          <Divider />
                          {
                            work.content !== '' || work.images.length >0 ? (
                              <Button type='submit' variant='outlined' size='medium' style={{ marginTop: 4 }}>
                                Share
                              </Button>
                            ) : (
                              <></>
                            )
                          }
                        </Box>
                      </Box>
                    </form>
                  </Card>
                )
            }</>
        )
      }
    </>
  )
}

export default AddPost
