import React, { useEffect, useState } from 'react'
import { Divider, Avatar, Grid, Paper, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, useMediaQuery, TextField } from "@mui/material";
import { Box, Breakpoint, margin, maxWidth, useTheme } from "@mui/system";
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import styles from './comments.module.css';
import { useAuth } from 'src/hooks/useAuth';
import postDetails from 'src/pages/post-details';
import EditPost from '../EditPost/EditPost';
import { useSettings } from 'src/@core/hooks/useSettings';
import toast from 'react-hot-toast';
import Report from '../Report/Report';
const emails = ['Report', 'Cancel'];
const YourEmails = ['Edit', 'Delete', 'Cancel'];
import { postApi } from 'src/@core/apis'

interface comment {
    postDetails: any,
    comments: any
    setComments?: any
}

const Comment = (props: comment) => {
    const { comments, postDetails, setComments } = props
    const { user } = useAuth();

    const [open, setOpen] = useState<boolean>(false)
    const [expanded, setExpanded] = React.useState(false);
    const [fullWidth, setFullWidth] = useState<boolean>(true)
    const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')

    const {
        settings: { direction }
    } = useSettings()
    const handleClose = () => setOpen(false)
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState<string>('');
    const handleClickOpen = (userId:any, commentId:any, content:any) => {
        setSelectedUserId(userId)
        setSelectedCommentId(commentId)
        setEditedComment(content)
        setOpen(true)
    }

    const userId = user?._id
    const userIsComment = comments.map((cmt: any) => cmt.user._id === userId)
    // console.log(userId, comments, userIsComment)
    // console.log(selectedUserId, selectedCommentId)
    const handleListItemClickYourEmails = (value: string) => {
        if (value === 'Edit') {
            setEditCommentId(selectedCommentId)
            handleClose();
        }
        if (value === 'Delete') {
            deletComment(selectedCommentId)
        }
        if (value === 'Cancel') {
            handleClose();
        }
    };

    const deletComment = (commentId: any) => {
        postApi.deleteComment(commentId).then(({ data }) => {
            if (data.isSuccess) {
                comments.map((cmt: any) => {
                    if (cmt._id === commentId) {
                        comments.splice(comments.indexOf(cmt), 1)
                    }
                })
                setOpen(false)
            }
        }).catch((err) => {
            toast.error('Delete comment failed')
        })
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedComment(e.target.value);
    };


    const handleEditComment = (commentId: string) => {        
        if (!editedComment.trim()) {
            toast.error('Please provide a non-empty comment.');
            return;
        }

        postApi.editComment(commentId, { content: editedComment }).then(({ data }) => {
            console.log(data);
            
            if (data.isSuccess) {
                const updatedComments = comments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, content: editedComment };
                    }
                    return comment;
                });
                setEditCommentId(null);
                setComments(updatedComments);
                toast.success('Comment edited successfully.');
            } else {
                toast.error('Failed to edit comment.');
            }
        }).catch(error => {
            toast.error('Failed to edit comment.');
            console.error('Edit comment error:', error);
        });
    };

    const handleListItemClick = (value: string) => {
        switch (value) {
            case 'Report':
                setOpenReport(true)
                setOpen(false)
                break;
            case 'Cancel':
                setOpen(false)
                break;
            default:
                break;
        }
    };



    // ** State
    const [value, setValue] = useState<string>('Controlled')


    // ** Hooks
    const theme = useTheme()

    // open Report

    const [openReport, setOpenReport] = useState(false)

    // ** Hooks
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpenEP = () => setOpenReport(true)

    const handleCloseReport = () => setOpenReport(false);



    const type = 'Comment';

    return (

        <Box>
            <div className={styles.boxcomment} >
                <ul className={styles.main} >
                    {
                        comments.map((comment: any) => (
                            <li >
                                {/* main comment */}
                                <Box >
                                    <Grid container wrap="nowrap" spacing={2}>
                                        <Grid item>
                                            <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                                <Avatar aria-label="recipe" src={comment.user.avatar}>{comment?.user.username.charAt(0).toUpperCase()}</Avatar>
                                            </Box>
                                        </Grid>
                                        <Grid justifyContent="left" item xs zeroMinWidth style={{ marginTop: '14px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <h4 style={{ margin: 0, textAlign: "left" }}>{comment.user.firstName} {comment.user.lastName}</h4>
                                                <Icon icon='pepicons-pencil:dots-x' fontSize={20} style={{ marginRight: '5px' }} onClick={() => handleClickOpen(comment?.user._id, comment?._id, comment?.content)} />
                                            </Box>
                                            {editCommentId === comment?._id ? (
                                                <Box>
                                                    <TextField
                                                        name='editedComment'
                                                        value={editedComment}
                                                        onChange={handleChange}
                                                        multiline
                                                        fullWidth
                                                        variant="outlined"
                                                        autoFocus
                                                    />
                                                    <Button style={{ fontSize: '13px', marginTop: '10px', padding: '5px 20px' }} variant="contained" onClick={() => handleEditComment(comment?._id)}>Save</Button>
                                                </Box>
                                            ) : (
                                                <Typography style={{ textAlign: "left" }}>
                                                    {comment.content}
                                                </Typography>
                                            )}
                                            {/* <p style={{ textAlign: "left" }}>
                                                {comment.content}
                                            </p> */}
                                            {/* <p style={{ textAlign: "left", color: "gray" }}>
                                                {/* <span>99p</span> 
                                                <Button>
                                                    Like
                                                </Button>
                                            </p> */}
                                        </Grid>
                                    </Grid>
                                </Box>


                            </li>
                        ))
                    }

                </ul>
            </div>

            {/* list action */}
            <Dialog
                open={open}
                maxWidth={maxWidth}
                fullWidth={fullWidth}
                onClose={handleClose}
                aria-labelledby='max-width-dialog-title'
            >
                <DialogContent>
                    {
                        (selectedUserId === userId) ? (
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
                    <Report type={type} postDetails={postDetails} comments={comments} comment={selectedCommentId} handleCloseReport={handleCloseReport} />
                </DialogContent>

            </Dialog>



        </Box>
    )
}

export default Comment
