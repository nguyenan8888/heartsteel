import { Avatar, Button, ButtonGroup, Card, CardContent, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
import { Box, fontWeight } from '@mui/system'
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
import { postApi ,userApi} from 'src/@core/apis'
import toast from 'react-hot-toast'

interface DataUser {
    dataPost?: any
    fetchUser?: any
    handleCloseDetailsUser: () => void
}


const DetailsUserManagement = (props: DataUser) => {
    const { dataPost, fetchUser, handleCloseDetailsUser } = props
    // console.log('dataPost', dataPost)
    const {
        settings: { direction }
    } = useSettings()

    const [expandedReports, setExpandedReports] = useState<string[]>([]);
    const [isUserLocked, setIsUserLocked] = useState<boolean>(dataPost.user.isLocked);
    const toggleReport = (reportId: string) => {
        // console.log('toggleReport', reportId)
        setExpandedReports(prevState => {
            if (prevState.includes(reportId)) {
                return prevState.filter(id => id !== reportId);
            } else {
                return [...prevState, reportId];
            }
        });
    };
  
    const handleLockUser = (id: any, username: string) => {
        userApi
        .lockAccount(id)
        .then(({ data }) => {
          if (data.isSuccess) {
            setIsUserLocked(!isUserLocked); 
            if(data.data.isLocked) toast.success(`Lock ${username} Successfully`)
            if(!data.data.isLocked) toast.success(`Unlock ${username} Successfully`)
          } else {
            toast.error(data.message)
          }
        })
        .catch(err => {
          toast.error(err?.response.data.message[0].msg)
        })
        .finally(() => {
            fetchUser()
        })
    }
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
                <Box sx={{ width: '65%', height: '100%' }}>
                    <Box sx={{ marginX: '10px' }}>
                        <Card >
                            <CardContent style={{ display: 'flex' }}>
                                <Avatar
                                    style={{ margin: '0 50px' }}
                                    alt='John Doe'
                                    src={dataPost.user.avatar}
                                    sx={{ width: 150, height: 150 }}
                                />
                                <Typography style={{ marginLeft: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography style={{ fontWeight: 'bold', margin: '0' }} sx={{ mb: 2 }}>
                                            {dataPost.user.username}
                                        </Typography>
                                        {/* <Button variant='contained' style={{ marginLeft: '20px' }} onClick={() => { router.push('/archive') }}>View archive</Button> */}
                                    </div>
                                    <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }} sx={{ mb: 2 }}>
                                        {dataPost.user.firstName} {dataPost.user.lastName}
                                    </Typography>
                                    {/* <Editor onChange={data => setBioValue(data)} editorState={bioValue} readOnly /> */}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
                <Box sx={{ width: '35%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ width: '100%', height: '100%', overflow: 'scroll', display: 'flex', flexDirection: 'column', }}>
                        <Box>
                            <Box >
                                <span style={{ fontSize: '2rem', fontWeight: '600', color: 'black' }}>Report: {dataPost.type}</span><br />
                                <span style={{ fontSize: '2em', fontStyle: 'italic' }}>Total Reports: <span style={{ color: dataPost.totalReport > 10 ? 'red' : dataPost.totalReport > 5 ? 'orange' : dataPost.totalReport > 1 ? 'yellow' : 'black', padding: '2px' }}>
                                    {dataPost.totalReport}

                                </span></span><br />
                            </Box>
                            <ButtonGroup sx={{ gap: 4 }}>
                            <Button variant='contained' color='error' onClick={() => handleLockUser(dataPost.reportedTarget,dataPost.user.username)}>
                                    {isUserLocked ? "Unlock User" : "Lock User"} 
                                </Button>
                            </ButtonGroup>
                            <h2>User Report</h2>
                        </Box>
                        <Box sx={{ overflow: 'scroll' }}>
                            <List  >
                                {
                                    dataPost.reports.map((report: any) => (
                                        <Box>
                                            <Card sx={{ marginBottom: 4 }}>
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
                                            </Card>
                                            {expandedReports.includes(report._id) && (
                                                <Box sx={{ width: '100%' }}>
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
                                                </Box>

                                            )}
                                        </Box>
                                    ))
                                }
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DetailsUserManagement
