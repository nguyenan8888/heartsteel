/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { Fragment, useState, ChangeEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { SelectChangeEvent } from '@mui/material/Select'
import { styled, Breakpoint } from '@mui/material/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import { useAuth } from "src/hooks/useAuth";
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { Icon } from '@iconify/react'
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { type } from 'os'
import postDetails from 'src/pages/post-details'
import Report from 'src/@core/layouts/components/shared-components/Report/Report'
import DeletePost from 'src/@core/layouts/components/shared-components/DeletePost/DeletePost'
import EditPost from 'src/@core/layouts/components/shared-components/EditPost/EditPost'
import toast from 'react-hot-toast'
import { postApi } from 'src/@core/apis'
import PostDetails from './[id]/PostDetails'
// Styled component for the form
const Form = styled('form')({
  margin: 'auto',
  display: 'flex',
  width: 'fit-content',
  flexDirection: 'column'
})

const emails = ['Report', 'Cancel'];
const YourEmails = ['Edit', 'Delete', 'Cancel'];

interface Report {
  postDetails?: any,

}

const DialogReport = (props: Report) => {
  const { postDetails} = props
  const postDetail = {
    data: {
      post: postDetails
    }
  }  
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)
  const handleClickOpenPostDetails = () => setOpenPostDetails(true)
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const handleClosePostDetails = () => setOpenPostDetails(false)

  const handleListItemClickYourEmails = (value: string) => {
    if (value === 'Edit') {
      setOpenEditPost(true)
      setOpen(false)
    }
    if (value === 'Cancel') {
      setOpen(false)
    }
    if (value === 'Delete') {
      setOpen(false)
      handleClickDeletePost();
    }
  };

  const handleListItemClick = (value: string) => {
    if (value === 'Report') {
      handleClickOpenReport()
      handleClose()
    }
    if (value === 'Cancel') {
      setOpen(false)
      handleClose()
    }
    if (value === 'Go to post') {
      handlePostDetails(postDetails._id)
      setOpen(false)
    }
  };

  const handlePostDetails = (id: string) => {
    setOpenPostDetails(true);
  }
  // open Report
  const [openReport, setOpenReport] = useState(false)

  // ** Hooks
  const handleClickOpenReport = () => setOpenReport(true)
  const handleCloseReport = () => setOpenReport(false);
  const type = 'Post'

  const post = {
    data: {
      post: postDetails
    }
  }

  const { user } = useAuth();
  const userIsPostOwner = postDetails.user._id === user?._id

  //delete Post
  const [openDeletePost, setOpenDeletePost] = useState(false)

  const handleClickDeletePost = () => setOpenDeletePost(true)
  const handleCloseDeletePost = () => setOpenDeletePost(false);


  // edit post
  const [openEditPost, setOpenEditPost] = useState(false)

  const handleClickOpenEP = () => setOpenEditPost(true)
  const handleCloseEditPost = () => setOpenEditPost(false);
  return (
    <Fragment>
      <Button variant='text' onClick={handleClickOpen} style={{ borderRadius: "100%" }}>
        <Icon icon='ph:dots-three-bold' fontSize={20} />
      </Button>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {
              userIsPostOwner ? (
                <List sx={{ pt: 0 }}>
                  {YourEmails.map((email) => (
                    <ListItem disableGutters key={email}>
                      <ListItemButton onClick={() => handleListItemClickYourEmails(email)} >
                        {(email) && (
                          <ListItemText style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',

                          }} >
                            <span style={{ color: email === 'Delete' ? 'red' : 'black' }}>{email}</span>
                          </ListItemText>
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List sx={{ pt: 0 }}>
                  {emails.map((email) => (
                    <ListItem disableGutters key={email}>
                      <ListItemButton onClick={() => handleListItemClick(email)}>
                        {(email) && (
                          <ListItemText style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',

                          }} >
                            <span style={{ color: email === 'Report' ? 'red' : 'black' }}>{email}</span>
                          </ListItemText>
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )
            }
          </List>
        </DialogContent>
      </Dialog>

      {/* Report post */}
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={openReport} onClose={handleCloseReport} aria-labelledby='full-screen-dialog-title'>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseReport}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Report type={type} postDetails={post} handleCloseReport={handleCloseReport} />
        </DialogContent>
      </Dialog>

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
        <DeletePost postDetails={post} handleCloseDeletePost={handleCloseDeletePost} />

      </Dialog>

      {/* edit post */}
      <Dialog maxWidth='xl' open={openEditPost} onClose={handleCloseEditPost} aria-labelledby='full-screen-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            height: '100%'
          },
        },
      }}>
        <DialogContentText style={{ height: '100%' }}>
          <EditPost postDetails={post} handleCloseEditPost={handleCloseEditPost} />
        </DialogContentText>
        <DialogTitle id='full-screen-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={handleCloseEditPost}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>

      </Dialog>

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
    </Fragment>
  )
}

export default DialogReport
