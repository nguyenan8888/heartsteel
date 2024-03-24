// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import ListPost from 'src/@core/components/list-post';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Apis
import { postApi } from 'src/@core/apis'
import toast from 'react-hot-toast'
import Card from '@mui/material/Card';
import Box from '@mui/system/Box';
import { Avatar, Dialog, DialogContentText, IconButton } from '@mui/material';
import CustomTextField from 'src/@core/components/mui/text-field';
import AddPost from 'src/@core/layouts/components/shared-components/CreatePost/AddPost';
import { useAuth } from "src/hooks/useAuth";
import { CheckPermissionEnter } from 'src/lib/function'
import DialogContent from '@mui/material/DialogContent'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Typography from '@mui/material/Typography'
import AddReel from 'src/@core/components/create-reel/AddReel'

const listItems = [
  <Typography style={{ margin: 0 }} key='Create Post'>Create Post</Typography>,
  <Typography style={{ margin: 0 }} key='Create Reel'>Create Reel</Typography>,
  <Typography style={{ margin: 0 }} key='Cancel'>Cancel</Typography>
];

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const [listPost, setListPost] = useState<any>([])
  const { user } = useAuth();

 // ** State
 const [open, setOpen] = useState(false)
 const handleClickOpen = () => setOpen(true)
 const handleClose = () => setOpen(false)

 const [openPost, setOpenPost] = useState(false)
 const handleClickOpenPost = () => setOpenPost(true)
 const handleClosePost = () => setOpenPost(false)

 const [openReel, setOpenReel] = useState(false)
 const handleClickOpenReel = () => setOpenReel(true)
 const handleCloseReel = () => setOpenReel(false)

 const handleListItemClick = (value: any) => {
  if (value === 'Cancel') handleClose();
  if (value === 'Create Post') {
    handleClose();
    handleClickOpenPost();
  };
  if (value === 'Create Reel') {
    handleClose();
    handleClickOpenReel();
  };
};

  useEffect(() => {
    fetchData();
    CheckPermissionEnter(['Member']);
  }, []);

  const fetchData = async () => {
    setLoading(true);

    postApi
      .newFeed()
      .then(({ data }) => {
        if (data.isSuccess) {
          setListPost(data.data.posts)
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

  return (
    <>
      <Card sx={{ width: 600, margin: '20px auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4, padding: 2 }}>
            <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 2 }} src={user?.avatar} >
            {user?.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ width: "100%" }}>
              <div onClick={handleClickOpen}>
                <CustomTextField fullWidth id='outlined-full-width' placeholder={`${user?.username}! Hôm nay bạn nghĩ gì?`} InputProps={{ inputProps: { style: { textAlign: 'start', padding: 10, borderRadius: 6 }, }, style: { borderRadius: 999 }, }} />
            </div>
              </Box>
          </Box>
        </Box>
      </Card>

      <Box>
        <ListPost listData={listPost}/>
      </Box>

      {/* Create Post */}
      <Dialog maxWidth='xl' open={openPost} onClose={handleClosePost} aria-labelledby='form-dialog-title' sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        height: '100%'
                    },
                },
            }}>
                <DialogContentText style={{ height: '100%' }}>
                    <AddPost setOpen={setOpenPost} fetchData={fetchData}/>
                </DialogContentText>
                <IconButton
                    aria-label='close'
                    onClick={handleClosePost}
                    sx={{ top: 8, left: 10, position: 'absolute', color: 'grey.200' }}
                >
                    <Icon icon='tabler:x' fontSize={"35px"} />
                </IconButton>
            </Dialog>

            <Dialog maxWidth='md' open={openReel} onClose={handleCloseReel} aria-labelledby='form-dialog-title' sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        height: '100%'
                    },
                },
            }}>
                <DialogContentText style={{ height: '100%' }}>
                    <AddReel setOpen={setOpenReel}/>
                </DialogContentText>
                <IconButton
                    aria-label='close'
                    onClick={handleCloseReel}
                    sx={{ top: 8, left: 10, position: 'absolute', color: 'grey.200' }}
                >
                    <Icon icon='tabler:x' fontSize={"35px"} />
                </IconButton>
            </Dialog>

            <Dialog
        open={open}
        maxWidth='xs'
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {listItems.map((e) => (
              <ListItem disableGutters key={e.props.children}>
                <ListItemButton onClick={() => handleListItemClick(e.props.children)}>
                  <ListItemText style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} primary={e} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Home
