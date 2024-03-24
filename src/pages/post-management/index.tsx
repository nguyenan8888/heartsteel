/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

// ** MUI Components
import { DataGrid } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { postApi } from 'src/@core/apis'
import { CheckPermissionEnter } from 'src/lib/function'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useSocket } from "src/hooks/useSocket";

// ** Utils Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { GridColDef } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import ReactPlayer from 'react-player/lazy'
import { DialogContentText } from '@mui/material'
import PostDetails from 'src/@core/components/list-post/[id]/PostDetails'
import toast from 'react-hot-toast'

export type ProjectTableRowType = {
  id: string
  user: {
    username: string
    avatar?: any
  }
  totalComment: number
  images: any
  content: any
  createdAt: string
  totalLike: any
  is_public: boolean
}

interface CellType {
  row: ProjectTableRowType
}

interface Data {
  message: string
}

const initialData: Data = {
  message: '',
}

const defaultValues = {
  message: '',
}

const PostManagement = () => {
  // ** State
  const [data, setData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [createdAt, setCreatedAt] = useState<any>('');
  const [totalLike, setTotalLike] = useState<any>('');
  const [totalComment, setTotalComment] = useState<any>('');
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openWarning, setOpenWarning] = useState<boolean>(false)
  const [postId, setPostId] = useState('');
  const [formData, setFormData] = useState<Data>(initialData)
  const { socket } = useSocket();

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm({ defaultValues })

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const onWarningFormSubmit = (postId: string) => {    
    const payload = {
      id: postId,
      title: formData.message,
      type: 'warning',
    }

    socket?.emit('send-post-warning', payload);
    setOpenWarning(false);
    
    // const { phone, address, email } = formData;
    // setLoading(true)
    // userApi
    //   .editProfile({phone, address, email})
    //   .then(({ data }) => {
    //     if (data.isSuccess) {
    //       toast.success('Contact Changed Successfully')
    //     } else {
    //       toast.error(data.message)
    //     }
    //   })
    //   .catch(err => {
    //     toast.error(err?.response.data.message[0].msg)
    //   })
    //   .finally(() => {
    //     setLoading(false)
    //   })
  }

  const handleClickOpenDelete = () => setOpenDelete(true)
  const handleCloseDelete = () => setOpenDelete(false)
  const handleClickOpenWarning = () => setOpenWarning(true)
  const handleCloseWarning = () => setOpenWarning(false)
  const handleClickOpenPostDetails = (id: string) => {
    setOpenPostDetails(true)
    setPostId(id)
  }
  const handleClosePostDetails = () => setOpenPostDetails(false)
  const [postDetail, setPostDetail] = useState(null);

  const handlePostDetails = (postId: string) => {
    setPostId(postId)
    postApi.get_postDetails(postId)
      .then(response => {
        setPostDetail(response.data);
        setOpenPostDetails(true);
      })
      .catch(error => {
        console.error('Error fetching post details:', error);
      });
  };

  const handleDeletePost = (postId: string) => {
    setPostId(postId)
    handleClickOpenDelete();
  }

  useEffect(() => {
    CheckPermissionEnter(['Admin']);
  }, [])

  useEffect(() => {
    fetchData()
  }, [createdAt, totalLike, totalComment])

  const fetchData = () => {
    postApi.getAllPosts(createdAt, totalLike, totalComment)
      .then(response => {
        const updatedData = response.data.data.posts.map((post: { _id: any }) => ({
          ...post,
          id: post._id
        }));
        setData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  const handleDelete = (id: string) => {
    postApi.delete_post(id)
      .then(({ data }) => {
        if (data.isSuccess) {
          handleClosePostDetails();
          handleCloseDelete();
          fetchData()
          toast.success(`Delete post successfully`)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err)
      })
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'content',
      minWidth: 270,
      headerName: 'Content',
      renderCell: ({ row }: CellType) => {
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {(row.images[0].includes("/images") ? (
                <img style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover'}} src={row.images[0]} alt='image' />
              ) : row.images[0].includes("/videos") ? (
                <video muted style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }}>
                  <source src={row.images[0]} />
                </video>
              ) : <div style={{ marginRight: '5px', width: 48, height: 48, backgroundColor:'black'}}></div>)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row.content}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <CustomAvatar src={row.user.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
                <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                  {row.user.username}
                </Typography>
          </Box>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'createdAt',
      headerName: 'Created At',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{new Date(row.createdAt).toLocaleString()}</Typography>
    },
    {
      flex: 0.1,
      field: 'totalLike',
      minWidth: 50,
      headerName: 'Total Like',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.totalLike}</Typography>
    },
    {
      flex: 0.1,
      field: 'totalComment',
      minWidth: 50,
      headerName: 'Total Comment',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.totalComment}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'is_public',
      headerName: 'Is Public',
      renderCell: ({ row }: CellType) => 
        {return row.is_public ? (<Chip label='True' color='success' />) : (<Chip label='False' color='error' />)}
    },
    {
      flex: 0.1,
      minWidth: 10,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <OptionsMenu
          iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
          options={[
            {
              text: 'Details',
              menuItemProps: {
                onClick: () => handlePostDetails(row.id),
              }
            },
            {
              text: 'Delete',
              menuItemProps: {
                onClick: () => handleDeletePost(row.id),
              }
            },
          ]}
        />
      )
    }
  ]

  return data ? (
    <>
    <Card>
      <CardHeader
        title='List Posts'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      <DataGrid
        autoHeight
        pagination
        rows={data}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[1, 5, 10, 20]}
        paginationModel={paginationModel}
        disableRowSelectionOnClick
        onPaginationModelChange={setPaginationModel}
      />
    </Card>

    <Dialog maxWidth='md' open={openPostDetails} onClose={handleClosePostDetails} aria-labelledby='form-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogContentText style={{ height: '100%' }}>
          <PostDetails postDetails={postDetail} isManagement={true} action={<div style={{ display: 'flex', flexDirection: 'column', marginBottom:'50px'}}>
              <Button style={{marginBottom:'10px'}} onClick={handleClickOpenWarning} variant='contained' color='warning'>Send Warning</Button>
              <Button variant='contained' onClick={handleClickOpenDelete} color='error'>Delete Post</Button>
            </div>}
          />
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
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle id='alert-dialog-title'>Delete this post?</DialogTitle>
        <DialogContent>
          Delete this post from Heartsteel and let them know you deletes their post.
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button style={{ color: 'red' }} onClick={() => handleDelete(postId)}>Delete</Button>
          <Button onClick={handleCloseDelete}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openWarning}
        onClose={handleCloseWarning}
        aria-labelledby='max-width-dialog-title'
        fullWidth={true}
      >
        <DialogTitle id='alert-dialog-title'>Warning about this post?</DialogTitle>
        <DialogContent sx={{ mb: 5 }}>
          <form>
            <Divider />
            <CardContent>
              <Grid item xs={12} sm={12}>
                <CustomTextField
                  fullWidth
                  label='Message'
                  placeholder='Enter your message'
                  value={formData.message}
                  onChange={e => handleFormChange('message', e.target.value)}
                  rows={8}
                  multiline
                />
              </Grid>
            </CardContent>
          </form>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button style={{ color: 'orange' }} onClick={() => onWarningFormSubmit(postId)}>Send</Button>
          <Button onClick={handleCloseWarning}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null
}

export default PostManagement
