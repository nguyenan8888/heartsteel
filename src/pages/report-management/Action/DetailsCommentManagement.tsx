import { Avatar, Button, ButtonGroup, Card, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
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
import { postApi } from 'src/@core/apis'
import toast from 'react-hot-toast'

interface DataPost {
  dataPost?: any
  fetchComment?: any
  handleCloseDetailsComment: () => void
}

const DetailsCommentManagement = (props: DataPost) => {
  const { dataPost ,fetchComment,handleCloseDetailsComment} = props
  // console.log('dataPost', dataPost)
  const {
    settings: { direction }
  } = useSettings()

  const [expandedReports, setExpandedReports] = useState<string[]>([]);
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
  const handleDeteteComment =(commentId:any)=>{
    // console.log('commentId', commentId);
    postApi.deleteComment(commentId).then(({ data }) => {
        if (data.isSuccess) {
          fetchComment();
          handleCloseDetailsComment();
        }
    }).catch((err) => {
        toast.error('Delete comment failed')
    })
  }
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
        <Box sx={{ width: '65%', height: '100%' }}>
          <Box sx={{ marginX: '10px' }}>
            <Box sx={{ marginBottom: '10px' }}>
              <Box className="demo-space-x" sx={{ display: 'flex', alignItems: 'start', margin: 5 }}>
                <Avatar aria-label="recipe" src={dataPost.comment.post.user.avatar}>
                  {dataPost.comment.post.user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box >{dataPost.comment.post.user.username}</Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ margin: 5 }}>
                {dataPost.comment.post.content}
              </Typography>
            </Box>
            <KeenSliderWrapper sx={{ width: '100%' }}>
              <SwiperImages
                listData={dataPost.comment.post.images}
                direction={direction}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </KeenSliderWrapper>
            <Box sx={{ boxShadow: 4 , marginBottom: '10px', width: '100%' }}>
              <Paper>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={dataPost.comment.cmt.user.avatar} alt='Caroline Black' sx={{ height: 36, width: 36 }} />
                  </ListItemAvatar>
                  <ListItemText primary={`${dataPost.comment.cmt.user.firstName} ${dataPost.comment.cmt.user.lastName}`} secondary={dataPost.comment.cmt.content} />
                </ListItem>
              </Paper>
            </Box>
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
                <Button variant='contained' color='error' onClick={() => handleDeteteComment(dataPost.reportedTarget)}>
                  Delete Comment
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

export default DetailsCommentManagement
