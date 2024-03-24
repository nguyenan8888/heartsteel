/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon';
// ** Third Party Imports
import { postApi, userApi } from 'src/@core/apis'
import { Avatar, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'
import { Box, Breakpoint, maxWidth } from '@mui/system'
import OptionsMenu from 'src/@core/components/option-menu'
import { format } from 'date-fns';
import toast from 'react-hot-toast'
import { CheckPermissionEnter } from 'src/lib/function'
// ** Action Imports
import DeletePostManagement from './Action/DeletePostManagement'
import DetailsPostManagement from './Action/DetailsPostManagement'
import DeleteCommentManagement from './Action/DeleteCommentManagement'
import DetailsCommentManagement from './Action/DetailsCommentManagement'
import { number } from 'yup'
// ** Custom Components Imports
import { ThemeColor } from 'src/@core/layouts/types'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import DetailsUserManagement from './Action/DetailsUserManagement'
import DeleteReelManagement from './Action/DeleteReelManagement'
import DetailsReelManagement from './Action/DetailsReelManagement'
import DetailsUserReport from './Action/DetailsUserReport'
import { useSocket } from "src/hooks/useSocket";
import Router from 'next/router'
export type ProjectTableRowType = {
  _id: string
  createdAt: string
  reportedTarget: string
  reports:
  {
    user: string
    reportContent: string
    reason: any[]
    _id: string
  }
  totalReport: number
  type: string
  user:
  {
    id: string
    dob: string
    username: string
    email: string
    isLocked?: number
    isActive?: boolean
    role: string
    gender: string
    avatar?: string
    avatarGroup: string[]
    avatarColor?: ThemeColor
  },
  comment:
  {
    cmt:
    {
      id: string
      content: string
      user:
      {
        id: string
        avatar: string
        username: string
        firstName: string
        lastName: string
      }
    }
  }
  post:
  {
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
  reel:
  {
    id: string
    user: {
      username: string
      avatar?: any
    }
    totalComment: number
    video: any
    content: any
    createdAt: string
    totalLike: any
    is_public: boolean

  }

}

interface CellType {
  row: ProjectTableRowType,
  rowIndex?: number;
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


const ReportManagement = () => {
  // ** State
  const [data, setData] = useState([])
  const [value, setValue] = useState<string>('')
  const [createAt, setCreateAt] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [type, setType] = useState<string>('')
  const [totalReport, setTotalReport] = useState<number>('')
  const [count, setCount] = useState<number>(0);
  const [selectedReportType, setSelectedReportType] = useState('Post');
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
  useEffect(() => {
    CheckPermissionEnter(['Admin']);

    fetchData()
  }, [type, createAt, totalReport, paginationModel])
  const renderName = (row: ProjectTableRowType) => {
    if (row.user.avatar) {
      return <CustomAvatar src={row.user.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={(row.user.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials(row.user.username || 'John Doe')}
        </CustomAvatar>
      )
    }
  }
  const fetchData = () => {
    postApi.get_Report(paginationModel.page, paginationModel.pageSize, type, createAt, totalReport, value)
      .then(response => {
        const updatedData = response.data.data.reports.map((report: { _id: any }) => ({
          ...report,
          id: report._id
        }));
        setData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching reports data:', error);
      });
  }
  // console.log('data report', data);

  const router = Router
  //Get ID Form Post
  const [idPost, setIdPost] = useState('');
  const [dataPost, setDataPost] = useState();

  const handlDetailPost = (Id: any, Details: any) => {
    console.log("id", Id);
    console.log('details', Details)
    setDataPost(Details)
    handleClickDetailsPost()

  }
  const handleDeletePost = (Id: any, Details: any) => {
    console.log("id", Id);
    console.log('details', Details.post._id)
    setIdPost(Details.post._id)
    handleClickDeletePost()
  }
  const handleSentPost = (Id: any) => {
    setIdPost(Id)
    console.log('handleSentPost', Id)
    handleClickSentPost()
  }
  const onWarningFormSubmit = (postId: string) => {
    console.log('postId', postId)
    const payload = {
      id: postId,
      title: formData.message,
      type: 'warning',
    }

    socket?.emit('send-post-warning', payload);
    handleCloseSentPost();
  }
  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }



  //Report Comment
  const handlDetailComment = (Id: any, Details: any) => {
    console.log("id", Id);
    console.log('details', Details)
    setDataPost(Details)
    handleClickDetailsComment()
  }
  const handleDeleteComment = (Id: any, Details: any) => {
    console.log("id", Id);
    console.log('details', Details)
    setIdPost(Details.reportedTarget)
    handleClickDeleteComment()
  }


  //Report User
  const handlDetailUser = (Id: any, Details: any) => {
    router.push(`/user-profile/${Details.reportedTarget}`)
  }
  const handleLockUser = (Id: any, Name: any) => {
    userApi
      .lockAccount(Id)
      .then(({ data }) => {
        if (data.isSuccess) {
          if (data.data.isLocked) toast.success(`Lock ${Name} Successfully`)
          if (!data.data.isLocked) toast.success(`Unlock ${Name} Successfully`)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response.data.message[0].msg)
      })
      .finally(() => {
        fetchData()
      })
  }


  //Report Reel

  //Get ID Form Reel
  const [idReel, setIdReel] = useState('');
  const [dataReel, setDataReel] = useState('');
  const handleDeleteReel = (Id: any) => {
    handleClickDeleteReel()
    console.log("id", Id);
    setIdReel(Id)
  }
  const handlDetailReel = (Id: any, Details: any) => {
    handleClickDetailsReel()
    console.log("id", Id);
    console.log('details', Details)
    setDataReel(Details)
  }
  const handleSentReel = (Id: any) => {
    console.log("id", Id);
    setDataReel('Details.post._id')
  }

   
  
  

  useEffect(() => {
    fetchData();
  }, []);


  
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: selectedReportType === 'Post' ? 'content' : (selectedReportType === 'Comment' ? 'comment' : (selectedReportType === 'Reel' ? 'reelContent' : 'user name')),
      minWidth: 50,
      sortable: false,
      headerName: selectedReportType === 'Post' ? 'Content' : (selectedReportType === 'Comment' ? 'Comment' : (selectedReportType === 'Reel' ? 'Reel Content' : 'User Name')),
      renderCell: ({ row, rowIndex }: CellType) => {


        return (
          <Box>
            {
              row.type === 'Post' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {(row.post.images[0].includes("/images") ? (
                      <img style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }} src={row.post.images[0]} alt='image' />
                    ) : row.post.images[0].includes("/videos") ? (
                      <video muted style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }}>
                        <source src={row.post.images[0]} />
                      </video>
                    ) : <div style={{ marginRight: '5px', width: 48, height: 48, backgroundColor: 'black' }}></div>)}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {row.post.content}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CustomAvatar src={row.post.user.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                          {row.post.user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                </>
              ) : row.type === 'Comment' ? (
                <>
                  <Box sx={{ borderColor: 'error.main', width: '100%' }}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={row.comment.cmt.user.avatar} alt='Caroline Black' sx={{ height: 36, width: 36 }} />
                      </ListItemAvatar>
                      <ListItemText primary={`${row.comment.cmt.user.firstName} ${row.comment.cmt.user.lastName}`} secondary={row.comment.cmt.content} />
                    </ListItem>
                  </Box>
                </>
              ) : row.type === 'User' ? (
                <div onClick={handleRowClickUser}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }} >
                    {renderName(row)}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }} >
                        {row.user.username}
                      </Typography>
                      <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                        {new Date(row.user.dob).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </div>
              ) : row.type === 'Reel' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <video style={{ width: '100px', height: '100px' }} src={row.reel.video} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {row.reel.content}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CustomAvatar src={row.reel.user.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                          {row.reel.user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              ) : (null)
            }
          </Box>
        );
      }
    },

    {
      flex: 0.1,
      field: selectedReportType === 'Post' ? 'postId' : (selectedReportType === 'Comment' ? 'commentId' : (selectedReportType === 'Reel' ? 'reelId' : 'userId')),
      minWidth: 50,
      sortable: false,
      headerName: selectedReportType === 'Post' ? 'Post_Id' : (selectedReportType === 'Comment' ? 'Comment_Id' : (selectedReportType === 'Reel' ? 'Reel_Id' : 'User_Id')),
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.reportedTarget}</Typography>
    },

    {
      flex: 0.1,
      field: 'createdAt',
      minWidth: 100,
      sortable: false,
      headerName: 'CreatedAt',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}> {format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm')}</Typography>
    },
    {
      flex: 0.1,
      field: 'totalReport',
      minWidth: 100,
      sortable: false,
      headerName: 'TotalReport',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: '20px' }}>{row.totalReport}</span>  <Icon icon='tabler:alert-square-rounded' color={(row.totalReport > 10) ? '#D21404' : (row.totalReport > 5) ? '#FDD017' : (row.totalReport > 2) ? '#FFF380' : ''} />
      </Typography>
    },
    {
      flex: 0.1,
      minWidth: 10,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box>
          {
            row.type === 'Post' ? (
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'Details',
                    menuItemProps: {
                      onClick: () => handlDetailPost(row._id, row),
                    }
                  }, {
                    text: 'Delete',
                    menuItemProps: {
                      onClick: () => handleDeletePost(row._id, row),
                    }
                  },
                  {
                    text: 'Waring',
                    menuItemProps: {
                      onClick: () => handleSentPost(row.reportedTarget),
                    }
                  },

                ]}
              />
            ) : row.type === 'Comment' ? (
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'Details',
                    menuItemProps: {
                      onClick: () => handlDetailComment(row._id, row),
                    }
                  }, {
                    text: 'Delete',
                    menuItemProps: {
                      onClick: () => handleDeleteComment(row._id, row),
                    }
                  },

                ]}
              />
            ) : row.type === 'User' ? (
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'Details',
                    menuItemProps: {
                      onClick: () => handlDetailUser(row._id, row),
                    }
                  }, {
                    text: row.user.isLocked ? 'UnLock' : 'Lock',
                    menuItemProps: {
                      onClick: () => handleLockUser(row.reportedTarget, row.user.username),
                    }
                  },

                ]}
              />
            ) : row.type === 'Reel' ? (
              <OptionsMenu
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={[
                  {
                    text: 'Details',
                    menuItemProps: {
                      onClick: () => handlDetailReel(row._id, row),
                    }
                  }, {
                    text: 'Delete',
                    menuItemProps: {
                      onClick: () => handleDeleteReel(row.reportedTarget),
                    }
                  },
                  {
                    text: 'Waring',
                    menuItemProps: {
                      onClick: () => handleSentReel(row.reportedTarget),
                    }
                  },

                ]}
              />
            ) : (null)
          }
        </Box>
      )
    }
  ]

  const handleReportTypeChange = (type: string) => {
    setSelectedReportType(type);
  };

  //Post

  //delete Post
  const [openDeletePost, setOpenDeletePost] = useState(false)
  const handleClickDeletePost = () => setOpenDeletePost(true)
  const handleCloseDeletePost = () => setOpenDeletePost(false);

  //details Post
  const [openDetailsPost, setOpenDetailsPost] = useState(false)
  const handleClickDetailsPost = () => setOpenDetailsPost(true)
  const handleCloseDetailsPost = () => setOpenDetailsPost(false);


  //sent Post
  const [openSentPost, setOpenSentPost] = useState(false)
  const handleClickSentPost = () => setOpenSentPost(true)
  const handleCloseSentPost = () => setOpenSentPost(false);

  //Comment

  //delete Comment
  const [openDeleteComment, setOpenDeleteComment] = useState(false)
  const handleClickDeleteComment = () => setOpenDeleteComment(true)
  const handleCloseDeleteComment = () => setOpenDeleteComment(false);

  //details Comment
  const [openDetailsComment, setOpenDetailsComment] = useState(false)
  const handleClickDetailsComment = () => setOpenDetailsComment(true)
  const handleCloseDetailsComment = () => setOpenDetailsComment(false);

  //User 

  //lock user
  // const [openDeleteComment, setOpenDeleteComment] = useState(false)
  // const handleClickDeleteComment = () => setOpenDeleteComment(true)
  // const handleCloseDeleteComment = () => setOpenDeleteComment(false);

  //user details
  const [openDetailsUser, setOpenDetailsUser] = useState(false)
  const handleClickDetailsUser = () => setOpenDetailsUser(true)
  const handleCloseDetailsUser = () => setOpenDetailsUser(false);

  //Reel 

  //reel details
  const [openDetailsReel, setOpenDetailsReel] = useState(false)
  const handleClickDetailsReel = () => setOpenDetailsReel(true)
  const handleCloseDetailsReel = () => setOpenDetailsReel(false);

  //reel delete
  const [openDeleteReel, setOpenDeleteReel] = useState(false)
  const handleClickDeleteReel = () => setOpenDeleteReel(true)
  const handleCloseDeleteReel = () => setOpenDeleteReel(false);


  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (row: any) => {
    setSelectedRow(row)
    // console.log('row clicked', selectedRow)
  };
  const handleRowClickUser = () => {
    handleClickDetailsReportUser()
  }

  const [openDetailsReportUser, setOpenDetailsReportUser] = useState(false)
  const handleClickDetailsReportUser = () => setOpenDetailsReportUser(true)
  const handleCloseDetailsReportUser = () => setOpenDetailsReportUser(false);

  const [formData, setFormData] = useState<Data>(initialData)
  const { socket } = useSocket();



  return data ? (
    <>
      <Card>
        <CardHeader
          title='List Report'
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          action={<CustomTextField value={value} placeholder='Search' onChange={e => setValue(e.target.value)} />}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
        />
        <Box sx={{ margin: '0px 0px 20px 20px' }}>
          <Button onClick={() => handleReportTypeChange('Post')} variant={selectedReportType === 'Post' ? 'contained' : 'outlined'} sx={{ mr: 1 }}>Post</Button>
          <Button onClick={() => handleReportTypeChange('Reel')} variant={selectedReportType === 'Reel' ? 'contained' : 'outlined'} sx={{ mr: 1 }}>Reel</Button>
          <Button onClick={() => handleReportTypeChange('Comment')} variant={selectedReportType === 'Comment' ? 'contained' : 'outlined'} sx={{ mr: 1 }}>Comment</Button>
          <Button onClick={() => handleReportTypeChange('User')} variant={selectedReportType === 'User' ? 'contained' : 'outlined'}>User</Button>
        </Box>
        <DataGrid
          autoHeight
          pagination
          rows={data.filter((row: any) => row?.type === selectedReportType)}
          rowHeight={62}
          columns={columns}
          pageSizeOptions={[1, 5, 10, 20]}
          paginationModel={paginationModel}
          disableRowSelectionOnClick
          onPaginationModelChange={setPaginationModel}
          onRowClick={(params) => handleRowClick(params.row)}
        />
      </Card>


      {/* Post Post */}

      {/* Delete post */}
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={openDeletePost} onClose={handleCloseDeletePost} aria-labelledby='full-screen-dialog-title'>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDeletePost}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DeletePostManagement postDetails={idPost} handleCloseDeletePost={handleCloseDeletePost} fetchData={fetchData} />
      </Dialog>

      {/* Details post */}
      <Dialog maxWidth={'md'} open={openDetailsPost} onClose={handleCloseDetailsPost} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDetailsPost}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DetailsPostManagement dataPost={dataPost} handleCloseDetailPost={handleCloseDetailsPost} fetchPost={fetchData} />
      </Dialog>

      {/* Warning post */}
      <Dialog
        open={openSentPost}
        onClose={handleCloseSentPost}
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
          <Button style={{ color: 'orange' }} onClick={() => onWarningFormSubmit(idPost)}>Send</Button>
          <Button onClick={handleCloseSentPost}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Comment Comment */}

      {/* Delete comment */}
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={openDeleteComment} onClose={handleCloseDeleteComment} aria-labelledby='full-screen-dialog-title'>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDeleteComment}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DeleteCommentManagement postDetails={idPost} handleCloseDeleteComment={handleCloseDeleteComment} fetchData={fetchData} />
      </Dialog>

      {/* Details comment */}
      <Dialog fullWidth={fullWidth} maxWidth={'md'} open={openDetailsComment} onClose={handleCloseDetailsComment} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDetailsComment}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DetailsCommentManagement dataPost={dataPost} fetchComment={fetchData} handleCloseDetailsComment={handleCloseDetailsComment} />
      </Dialog>

      {/* User User */}

      {/*Details user*/}
      <Dialog fullWidth={fullWidth} maxWidth={'md'} open={openDetailsUser} onClose={handleCloseDetailsUser} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDetailsUser}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DetailsUserManagement dataPost={dataPost} fetchUser={fetchData} handleCloseDetailsUser={handleCloseDetailsUser} />
      </Dialog>

      {/* Reel Reel */}

      {/* Delete reel */}
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={openDeleteReel} onClose={handleCloseDeleteReel} aria-labelledby='full-screen-dialog-title'>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDeleteReel}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DeleteReelManagement reelDetails={idReel} handleCloseDeleteReel={handleCloseDeleteReel} fetchData={fetchData} />
      </Dialog>

      {/* Details reel */}
      <Dialog fullWidth={fullWidth} maxWidth={'md'} open={openDetailsReel} onClose={handleCloseDetailsReel} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDetailsReel}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DetailsReelManagement dataReel={dataReel} fetchReel={fetchData} handleCloseDetailsReel={handleCloseDetailsReel} />
      </Dialog>




      <Dialog fullWidth={fullWidth} maxWidth={'md'} open={openDetailsReportUser} onClose={handleCloseDetailsReportUser} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseDetailsReportUser}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DetailsUserReport selectedRow={selectedRow} />
      </Dialog>
    </>

  ) : null
}

export default ReportManagement
