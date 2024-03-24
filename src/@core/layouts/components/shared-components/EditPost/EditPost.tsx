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
import UploadsImage from '../CreatePost/UploadsImage'
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
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'


interface EditPostsProps {
  postDetails?: any,
  handleCloseEditPost: () => void,
}
interface FormData {
  user: string
  content: string
  images: File[]
  is_public: boolean
}

const EditPost = (props: EditPostsProps) => {
  const { postDetails, handleCloseEditPost } = props;
  const [loading, setLoading] = useState<boolean>(false)
  const {
    settings: { direction }
  } = useSettings()


  const [work, setWork] = useState({
    user: '',
    content: '',
    images: [],
    is_public: true,
    ...(postDetails.data.post || {})
  })
  console.log('postDetails',postDetails)
  console.log('work',work)
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

  const router = useRouter()
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('content', work.content)
    formData.append('is_public', work.is_public.toString())
    for (let i = 0; i < work.images.length; i++) {
      formData.append('files', work.images[i]);
    }
    postApi
      .edit_post(postDetails.data.post._id, formData)
      .then(({ data }) => {
        if (data.isSuccess) {
          handleCloseEditPost(false)
          router.push('/home')
          window.location.href = '/home';
        } else {
          toast.error(data.message)
        }
      })
      .catch(error => {
        console.error('Error submitting the post:', error)
        toast.error('An error occurred while submitting the post')
      })
      .finally(() => {
        setLoading(false)
      })
  }
const [type,setType] =useState('Edit')



  return (
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
                  {/* <FileUploaderMultiple/> */}
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
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '500' }}>Turn on commenting</Typography>
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

    </Card>
  )
}

export default EditPost
