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
import { reelApi } from 'src/@core/apis/reel.api'
interface DataReel {
    dataReel?: any
    handleCloseDetailsReel: () => void
    fetchReel?: any
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
const DetailsReelManagement = (props: DataReel) => {
    const { dataReel, handleCloseDetailsReel, fetchReel } = props
    const [openWarning, setOpenWarning] = useState<boolean>(false)
    const [formData, setFormData] = useState<Data>(initialData)
    const { socket } = useSocket();
    // console.log('detail reel',dataReel)
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

    const [openDeleteReel, setOpenDeleteReel] = useState(false)
    const handleClickDeleteReel = () => setOpenDeleteReel(true)
    const handleCloseDeleteReel = () => setOpenDeleteReel(false);
    const handleListItemClickYourEmails = (value: string) => {
        if (value === 'Cancel') {
            handleCloseDeleteReel();
        }
        if (value === 'Delete') {
            handleDeteteReel(dataReel.reportedTarget)
            // console.log('Delete',postDetails)
        }
    };

    const handleDeteteReel = async (id: string) => {
        try {
            const res = await reelApi.delete_reel(id);
            if (res.status) {
                handleCloseDetailsReel();
                fetchReel();
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
    
        socket?.emit('send-reel-warning', payload);
        setOpenWarning(false);
      }

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
                <Box sx={{ width: '65%', height: '100%' }}>
                    <Box sx={{ marginX: '10px' }}>
                        <Box className="demo-space-x" sx={{ display: 'flex', alignItems: 'start', margin: 5 }}>
                            <Avatar aria-label="recipe" src={dataReel.reel.user.avatar}>
                                {dataReel.reel.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box >{dataReel.reel.user.username}</Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ margin: 5 }}>
                            {dataReel.reel.content}
                        </Typography>
                        <video controls muted loop style={{ width: '100%', height: '100%' }} src={dataReel.reel.video} autoPlay />
                    </Box>
                </Box>
                <Box sx={{ width: '35%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ width: '100%', height: '100%', overflow: 'scroll', display: 'flex', flexDirection: 'column'}}>
                        <Box>
                            <Box >
                                <span style={{ fontSize: '2rem', fontWeight: '600', color: 'black' }}>Report: {dataReel.type}</span><br />
                                <span style={{ fontSize: '2em', fontStyle: 'italic' }}>Total Reports: <span style={{ color: dataReel.totalReport > 10 ? 'red' : dataReel.totalReport > 5 ? 'orange' : dataReel.totalReport > 1 ? 'yellow' : 'black', padding: '2px' }}>
                                    {dataReel.totalReport}

                                </span></span><br />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant='contained' color='error' onClick={handleClickDeleteReel}>
                                    Delete Reel
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
                                    dataReel.reports.map((report: any) => (
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
                    <Button style={{ color: 'orange' }} onClick={() => onWarningFormSubmit(dataReel.reportedTarget)}>Send</Button>
                    <Button onClick={handleCloseWarning}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteReel}
                onClose={handleCloseDeleteReel}
                aria-labelledby='max-width-dialog-title'
                fullWidth={true}
            >
                <Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '25px', fontWeight: '400' }}>Delete reel?</Typography>
                        <Typography sx={{ fontStyle: 'italic' }}>Are you sure you want to delete this reel?</Typography>
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

export default DetailsReelManagement
