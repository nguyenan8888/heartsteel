import { Avatar, Button, ButtonGroup, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ListItemButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'

// ** MUI Imports
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { red } from '@mui/material/colors'
import SwiperImages from 'src/views/components/swiper/SwiperImages'
import { useSettings } from 'src/@core/hooks/useSettings'
import { postApi } from "src/@core/apis";
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSocket } from "src/hooks/useSocket";

interface DataPost {
    dataPost?: any
    handleCloseDetailPost: () => void
    fetchPost?: any
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
const YourEmails = ['Delete','Cancel'];
const DetailsPostManagement = (props: DataPost) => {
    const { dataPost, handleCloseDetailPost, fetchPost } = props
    const [openWarning, setOpenWarning] = useState<boolean>(false)
    const [formData, setFormData] = useState<Data>(initialData)
    const { socket } = useSocket();

    const {
        settings: { direction }
    } = useSettings()

    const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
        setFormData({ ...formData, [field]: value })
    }

    const [expandedReports, setExpandedReports] = useState<string[]>([]);
    const toggleReport = (reportId: string) => {
        setExpandedReports(prevState => {
            if (prevState.includes(reportId)) {
                return prevState.filter(id => id !== reportId);
            } else {
                return [...prevState, reportId];
            }
        });
    };
    
    const [openDeletePost, setOpenDeletePost] = useState(false)
    const handleClickDeletePost = () => setOpenDeletePost(true)
    const handleCloseDeletePost = () => setOpenDeletePost(false);
    const handleListItemClickYourEmails = (value: string) => {
        if (value === 'Cancel') {
            handleCloseDeletePost();
        }
        if (value === 'Delete') {
            handleDetetePost(dataPost.reportedTarget)
            // console.log('Delete',postDetails)
        }
    };

    const handleDetetePost = async (id: string) => {
        try {
            const res = await postApi.delete_post(id);
            if (res.status) {
                handleCloseDetailPost();
                fetchPost();
                toast.success("Deleted Successfully");
            } else {
                toast.error("Delete Failed");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("An error occurred while deleting the post");
        }
    }

    const handleClickOpenWarning = () => setOpenWarning(true)
    const handleCloseWarning = () => setOpenWarning(false)

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


    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
                <Box sx={{ width: '65%', height: '100%' }}>
                    <Box sx={{ marginX: '10px' }}>
                        <Box className="demo-space-x" sx={{ display: 'flex', alignItems: 'start', margin: 5 }}>
                            <Avatar aria-label="recipe" src={dataPost.post.user.avatar}>
                                {dataPost.post.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box >{dataPost.post.user.username}</Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ margin: 5 }}>
                            {dataPost.post.content}
                        </Typography>
                        <KeenSliderWrapper sx={{ width: '100%' }}>
                            <SwiperImages
                                listData={dataPost.post.images}
                                direction={direction}
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        </KeenSliderWrapper>
                    </Box>
                </Box>
                <Box sx={{ width: '35%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ width: '100%', height: '100%', overflow: 'scroll', display: 'flex', flexDirection: 'column' }}>
                        <Box>
                            <Box >
                                <span style={{ fontSize: '2rem', fontWeight: '600', color: 'black' }}>Report: {dataPost.type}</span><br />
                                <span style={{ fontSize: '2em', fontStyle: 'italic' }}>Total Reports: <span style={{ color: dataPost.totalReport > 10 ? 'red' : dataPost.totalReport > 5 ? 'orange' : dataPost.totalReport > 1 ? 'yellow' : 'black', padding: '2px' }}>
                                    {dataPost.totalReport}

                                </span></span><br />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant='contained' color='error' onClick={handleClickDeletePost}>
                                    Delete Post
                                </Button>
                                <Button variant='contained' color='warning' onClick={handleClickOpenWarning}>
                                    Send warning
                                </Button>
                            </Box>
                            <h2>User Report</h2>
                        </Box>
                        <Box sx={{ overflow: 'scroll' }}>
                            <List  >
                                {
                                    dataPost.reports.map((report: any) => (
                                        <Box>
                                            <ListItem onClick={() => toggleReport(report._id)}>
                                                <ListItemAvatar>
                                                    <Avatar src={report.user.avatar} alt='Caroline Black' sx={{ height: 36, width: 36 }} />
                                                </ListItemAvatar>
                                                <ListItemText primary={report.user.username} secondary={report.reportContent} />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge='end'>
                                                        <Icon icon={expandedReports.includes(report._id) ? 'tabler:chevron-down' : 'tabler:plus'} onClick={() => toggleReport(report._id)} />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>

                                            {expandedReports.includes(report._id) && (
                                                <Card sx={{ width: '100%' }}>
                                                    <Box sx={{ margin: '20px' }}>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Typography><strong>Reason</strong></Typography>
                                                            <ul style={{ listStyleType: '-moz-initial' }}>
                                                                {
                                                                    report.reason.map((reason: any) => (
                                                                        <li>{reason}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </Box>

                                                        <Box sx={{ border: '1px solid black', padding: '4px', borderRadius: '4px', width: '100%' }}>
                                                            <Typography><strong>Report Content</strong></Typography>
                                                            <span style={{ fontSize: '20px', color: 'red' }}>{report.reportContent}</span>
                                                        </Box>
                                                    </Box>
                                                    <Divider />
                                                </Card>

                                            )}
                                        </Box>
                                    ))
                                }
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
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
                    <Button style={{ color: 'orange' }} onClick={() => onWarningFormSubmit(dataPost.reportedTarget)}>Send</Button>
                    <Button onClick={handleCloseWarning}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeletePost}
                onClose={handleCloseDeletePost}
                aria-labelledby='max-width-dialog-title'
                fullWidth={true}
            >
                <Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '25px', fontWeight: '400' }}>Delete post?</Typography>
                        <Typography sx={{ fontStyle: 'italic' }}>Are you sure you want to delete this post?</Typography>
                    </Box>
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
                </Box>
            </Dialog>
        </Box>
    )
}

export default DetailsPostManagement
