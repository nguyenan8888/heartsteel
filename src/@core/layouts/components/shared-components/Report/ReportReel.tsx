import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, TextField, Grid, Avatar, Paper, Typography, CircularProgress, IconButton, Card, CardContent } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import styles from './report.module.css';
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import Icon from 'src/@core/components/icon';
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import { postApi } from 'src/@core/apis';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Breakpoint, maxWidth } from '@mui/system';
import DeletePost from '../DeletePost/DeletePost';
interface ReportProps {
  comments?: any,
  comment?: any,
  postDetails: any,
  type: string,
  handleCloseReport: () => void,
}

interface CommentForm {
  commentId: number;
  username: string;
  firstName: string;
  lastName: string;
  content: string;
  image: string;
}

interface StateType {
  [key: string]: boolean
}


const ReportDataComments = [{ _id: 1, cmt: 'Spam' }, { _id: 2, cmt: 'Nudity or sexual activity' }, { _id: 3, cmt: 'Bullying or harassment' }, { _id: 4, cmt: 'False information' }, { _id: 5, cmt: 'I just dont like it' }]
// const ReportDataPost = [{_id: 1,ps: 'Spam'},{_id: 2,ps: 'Nudity or sexual activity'},{_id: 3,ps: 'Bullying or harassment'},{_id: 4,ps: 'False information'},{_id: 5,ps: 'I just dont like it'}]
// const ReportDataUser = [{_id: 1,ur: 'Spam'},{_id: 2,ur: 'Nudity or sexual activity'},{_id: 3,ur: 'Bullying or harassment'},{_id: 4,ur: 'False information'},{_id: 5,ur: 'I just dont like it'}]

const ReportReel = (props: ReportProps) => {
  const { comments, comment, handleCloseReport, postDetails, type } = props;
  // console.log('commentIdData',comments)
  const commentIdData = comments?.filter((comments: any) => comments._id === comment.toString());
  console.log('commentIdData', commentIdData)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
  const [work, setWork] = useState({
    type: type,
    reportContent: '',
    reason: [],
  })

  const handleChange = (e: { target: { name: any; value: any; checked: any } }) => {
    const { name, value, checked } = e.target;
    if (name === 'reason') {
      // Kiểm tra xem giá trị đã được chọn hay không
      // Nếu đã được chọn, thêm giá trị vào mảng reportContent
      // Nếu chưa được chọn, loại bỏ giá trị khỏi mảng reportContent
      const updatedReason = checked
        ? [...work.reason, value]
        : work.reason.filter((item) => item !== value);

      setWork((prevWork) => ({
        ...prevWork,
        [name]: updatedReason,
      }));
    } else {
      setWork((prevWork) => ({
        ...prevWork,
        [name]: value,
      }));
    }
  }

  const [idReport, setIdReport] = useState('')
  useEffect(() => {
    if (type === 'Comment') {
      setIdReport(comment);
    }
    if (type === 'Reel') {
      setIdReport(postDetails._id);
    }
  }, [type, comment, postDetails]);

  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmationClose = () => {
    // Đặt lại trạng thái hiển thị `Box` khi người dùng nhấn nút "Close"
    setShowConfirmation(true);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    postApi
      .post_Report(idReport, work)
      .then(({ data }) => {
        if (data.isSuccess) {
          const { type, reportContent, reason } = data.data
        } else {
          handleConfirmationClose()
        }
      })
      .catch(error => {
        console.error('Error submitting the post:', error)
        toast.error('An error occurred while submitting the post')
      })
      .finally(() => {
      })


  }


  return (
    <Box>
      {
        showConfirmation ? (
          <Box sx={{ textAlign: 'center', padding: '1rem', marginTop: '1rem' }}>
            <Icon icon='tabler:circle-check' fontSize='2rem' style={{ color: '#5cb85c' }} />
            <Typography variant="body1" style={{ fontSize: '20px', margin: '10px 0px' }}>Report submitted successfully.</Typography>
            <Button variant="contained" color="primary" onClick={handleCloseReport}>
              Close
            </Button>
          </Box>
        ) : (
          <Box>
            <Box sx={{ width: '100%' }}>
              {type === 'Reel' ? (
                <Box>
                  <h2>Report Reel</h2>
                </Box>
              ) : type === 'User' ? (
                <Box>
                  <h2>Report User</h2>
                </Box>
              ) : type === 'Comment' ? (
                <Box>
                  <h2>Report Comment</h2>
                  {commentIdData && commentIdData.length > 0 ? (
                    <Paper sx={{ border: 1, borderColor: 'error.main', marginBottom: '20px', width: '100%' }}>
                      <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                          <Box className="demo-space-x" sx={{ display: 'flex', alignItems: 'start', marginBottom: 4 }}>
                            <Avatar aria-label="recipe" src={commentIdData[0]?.user.avatar}>
                              {commentIdData[0]?.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                          </Box>
                        </Grid>
                        <Grid justifyContent="left" item xs zeroMinWidth>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ margin: 0, textAlign: 'left' }}>
                              {commentIdData[0]?.user.firstName} {commentIdData[0]?.user.lastName}
                            </h4>
                          </Box>
                          <p style={{ textAlign: 'left' }}>{commentIdData[0]?.content}</p>
                        </Grid>
                      </Grid>
                    </Paper>
                  ) : (
                    <p>Not Comment</p>
                  )}
                </Box>
              )  : (
                <Fragment>
                  <p>Không xác định được loại báo cáo.</p>
                </Fragment>

              )}
                  <Box>
                    <Card sx={{ width: '100%', height: 'calc(4 * 4.25 * 2.7vw)' }}>
                      <Box className='keen-slider__slide' style={{
                        width: '100%', 
                        backgroundColor: 'black', 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: `100%`,
                      }}>
                        <video controls muted loop style={{ width: '100%', height: '100%' }} src={postDetails.video} />
                      </Box>
                    </Card>
                    <Box>
                      <Grid container wrap="nowrap" spacing={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item   sx={{ display: 'flex', alignItems: 'center', marginY: 4 }}>
                          <Avatar aria-label="recipe" sx={{ width: 30, height: 30,marginRight:'10px' }} src={postDetails.user?.avatar}>{postDetails.user?.username.charAt(0).toUpperCase()}</Avatar>
                          <Box>{postDetails.user?.username}</Box>
                        </Grid>
                      </Grid>
                      <Typography variant="body2" color="text.secondary">
                          {postDetails.content}
                        </Typography>
                    </Box>
                  </Box>
              
           
            </Box>
            <form autoComplete="off" onSubmit={handleSubmit} >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px', width: '100%' }}>
                <FormControl sx={{ mt: 4, mr: 4, width: '100%' }}>
                  <FormLabel>Select To Report</FormLabel>
                  {
                    ReportDataComments.map((report) => (
                      <FormGroup>
                        <FormControlLabel
                          key={report._id}
                          label={report.cmt}
                          control={<Checkbox
                            checked={work.reason.includes(report.cmt)}
                            onChange={handleChange}
                            name="reason"
                            value={report.cmt} />}
                        />
                      </FormGroup>
                    ))
                  }
                  <TextField
                    rows={4}
                    multiline
                    label="Reason"
                    onChange={handleChange}
                    value={work.reportContent}
                    name="reportContent"
                    variant="standard"
                    id="textarea-standard-static"
                  />
                </FormControl>

              </Box>
              {type === 'Reel' ? (
                <Button variant="outlined" color="error" type="submit" >Report Reel</Button>
              ) : type === 'User' ? (
                <Button variant="outlined" color="error" type="submit" >Report User</Button>
              ) : type === 'Comment' ? (
                <Button variant="outlined" color="error" type="submit" >Report Comment</Button>
              ) : (
                <Fragment>
                  <p>Report type unknown.</p>
                </Fragment>
              )}
            </form>
          </Box>
        )
      }




    </Box >

  )
}

export default ReportReel



