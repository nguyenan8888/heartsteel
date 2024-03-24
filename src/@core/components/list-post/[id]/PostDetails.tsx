/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, CardActions, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from "@mui/material";
import { Box, Breakpoint, useTheme } from "@mui/system";
import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import SwiperControls from 'src/views/components/swiper/SwiperControls'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** MUI Imports
import Avatar from '@mui/material/Avatar';

// ** Custom Component Import
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

// ** Icon Imports
import Icon from 'src/@core/components/icon';
import Comment from "src/@core/layouts/components/shared-components/Comments/Comment";
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import EditPost from "src/@core/layouts/components/shared-components/EditPost/EditPost";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";
import { useSocket } from "src/hooks/useSocket";
import { useAuth } from "src/hooks/useAuth";
import { postApi, userApi } from "src/@core/apis";
import SwiperImages from "src/views/components/swiper/SwiperImages";
import TextTruncate from "../../text-truncate";
import toast from 'react-hot-toast'
import Report from "src/@core/layouts/components/shared-components/Report/Report";
import DeletePost from "src/@core/layouts/components/shared-components/DeletePost/DeletePost";
import { set } from "nprogress";

const emails = ['Report', 'Cancel'];
// const YourEmails = [];
interface postDetail {
    postDetails: any,
    isManagement?: boolean
    action?: any
    fetch?: any
}

const PostDetails = (props: postDetail) => {
    const { postDetails, isManagement, action, fetch } = props

    const [open, setOpen] = useState<boolean>(false)
    const [expanded, setExpanded] = React.useState(false);
    const [fullWidth, setFullWidth] = useState<boolean>(true)
    const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
    const [comments, setComments] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [YourEmails, setYourEmails] = useState<string[]>(['Edit', 'Delete', 'Turn on/off comment', 'Private/Public', 'Share', 'Cancel']);
    const { socket } = useSocket();
    const [deletePost, setDeletePost] = useState(false);
    const { user } = useAuth();
    const userIsPostOwner = postDetails?.data?.post?.user?._id === user?._id
    const {
        settings: { direction }
    } = useSettings()
    const handleClose = () => setOpen(false)
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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
        if (value === 'Turn on/off comment') {
            setOpen(false)
            handleSetComment();
        }
        if (value === 'Private/Public') {
            setOpen(false)
            handleSetPublic();
        }
    };

    const handleSetComment = () => {
        postApi.setComment(postDetails.data.post._id)
            .then(({ data }) => {
                if (data.isSuccess) {
                    fetch();
                }
            })
            .catch(err => {
                toast.error(err?.response)
            })
    }

    const handleSetPublic = () => {
        postApi.setPublic(postDetails.data.post._id)
            .then(({ data }) => {
                if (data.isSuccess) {
                    fetch();
                }
            })
            .catch(err => {
                toast.error(err?.response)
            })
    }

    const handleListItemClick = (value: string) => {
        if (value === 'Cancel') {
            setOpen(false)
        }
        if (value === 'Report') {
            setOpen(false)
            setOpenReport(true)

        }
    };

    const handleDeletePost = async () => {
        return;
    }

    const handleClickOpen = () => setOpen(true)

    // edit post
    const [openEditPost, setOpenEditPost] = useState(false)

    // ** Hooks
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const handleClickOpenEP = () => setOpenEditPost(true)
    const handleCloseEditPost = () => setOpenEditPost(false);

    // comment
    useEffect(() => {
        postApi.get_comments(postDetails.data.post._id, page)
            .then((res) => {
                setComments((cmt: any) => [...cmt, ...res.data.data.comments])
                setTotalPage(res.data.data.totalPage)
            });
        socket?.on(`comment-post-${postDetails.data.post._id}`, (data) => {
            setComments((cmt: any) => [...cmt, data])

        })
    }, [])

    const [comment, setComment] = useState<string>();
    const handleSendComment = (e: any) => {
        if (e.keyCode === 13 && comment?.trim() !== '') {
            const payload = {
                userId: user?._id,
                id: postDetails.data.post._id,
                content: comment?.trim(),
                image: user?.avatar,
                type: 'POST',
            }
            socket?.emit("comment", payload);
            setComment('');
            socket?.emit("send-post-comment", payload);
        }
    }

    const handleGetMoreComment = () => {
        postApi.get_comments(postDetails.data.post._id, page + 1)
            .then((res) => {
                setComments((cmt: any) => [...cmt, ...res.data.data.comments])
                setPage(page + 1)
            });
    }

    //like and save

    const [isSaved, setIsSaved] = useState(false)
    const [showHeart, setShowHeart] = useState(false)
    const [isLiked, setIsLiked] = useState<boolean>()
    const [isSavedList, setIsSavedList] = useState<boolean>()

    useEffect(() => {
        const newisLiked = postDetails.data.post.isLiked;
        const newIsSavedList = postDetails.data.post.isSaved;

        setIsLiked(newisLiked);
        setIsSavedList(newIsSavedList);
    }, [postDetails]);

    const handleLike = (postId: string) => {
        postApi.reactPost(postId)
            .then(({ data }) => {
                if (data.isSuccess) {
                    if (isLiked) {
                        setIsLiked(false);
                    } else {
                        setIsLiked(true);
                    };
                    if (!showHeart) {
                        setShowHeart(true);
                        setTimeout(() => {
                            setShowHeart(false);
                        }, 1000);
                    }
                    socket?.emit("send-post-like", {
                        postId: postId,
                        type: 'POST',
                    });
                } else {
                    toast.error(data.message)
                }
            })
            .catch(err => {
                toast.error(err?.response)
            })
    }

    const handleSave = (id: string) => {
        userApi.savePost(id)
            .then(({ data }) => {
                if (data.isSuccess) {
                    setIsSavedList(true);
                } else {
                    toast.error(data.message)
                }
            })
            .catch(err => {
                toast.error(err?.response)
            })
    }

    const handleUnSave = (id: string) => {
        userApi.unSavePost(id)
            .then(({ data }) => {
                if (data.isSuccess) {
                    setIsSavedList(false);
                } else {
                    toast.error(data.message)
                }
            })
            .catch(err => {
                toast.error(err?.response)
            })
    }

    // open Report
    const [openReport, setOpenReport] = useState(false)

    const handleClickOpenReport = () => setOpenReport(true)
    const handleCloseReport = () => setOpenReport(false);
    const type = 'Post'


    //delete Post
    const [openDeletePost, setOpenDeletePost] = useState(false)

    const handleClickDeletePost = () => setOpenDeletePost(true)
    const handleCloseDeletePost = () => setOpenDeletePost(false);

    return (
        <Card sx={{ width: '100%', minHeight: '100%' }}>

            <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
                <Box sx={{ height: '100%', width: '60%', backgroundColor: 'black' }}>
                    <KeenSliderWrapper sx={{ width: '100%', height: '100%' }}>
                        <SwiperImages
                            listData={postDetails.data.post.images}
                            direction={direction}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </KeenSliderWrapper>
                </Box>
                <Box sx={{ width: '35%', height: '100%', display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
                    <div>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Avatar aria-label="recipe" src={postDetails.data.post.user.avatar}>{postDetails.data.post.user.username.charAt(0).toUpperCase()}</Avatar>
                                </Box>
                                <Box>
                                    <Box>{postDetails.data.post.user.username}</Box>
                                    {
                                        postDetails.data.post.is_public ? (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Icon fontSize={15} icon="material-symbols:public" />
                                                <p style={{ margin: 0, fontSize: 10 }}>Public</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Icon fontSize={15} icon="uis:lock" />
                                                <p style={{ margin: 0, fontSize: 10 }}>Private</p>
                                            </div>
                                        )
                                    }


                                </Box>
                            </Box>
                            <Box>
                                {isManagement ? <></> : <Icon icon='pepicons-pencil:dots-x' fontSize={20} style={{ marginRight: '5px' }} onClick={handleClickOpen} />}
                            </Box>
                        </Box>

                        {/* người đăng bài post này */}
                        <Box sx={{ overflow: 'scroll' }}>
                            <Box sx={{ marginBottom: 4 }} >
                                {postDetails.data.post.content.length > 70 ? <TextTruncate text={postDetails.data.post.content} maxLength={70} /> :
                                    <Typography variant="body2" color="text.secondary">
                                        {postDetails.data.post.content}
                                    </Typography>}
                            </Box>

                            {isManagement ? <></> : (<>
                                <Box>
                                    <CardActions style={{ display: 'flex', justifyContent: 'space-between' }} disableSpacing>
                                        <div>
                                            <IconButton onClick={() => handleLike(postDetails.data.post._id)}>
                                                {isLiked ? <FavoriteIcon style={{ color: '#ff3c3c' }} /> : <FavoriteBorderIcon />}
                                            </IconButton>
                                            <IconButton aria-label="comment"  >
                                                <ModeCommentIcon />
                                            </IconButton>
                                            <IconButton aria-label="share">
                                                <ShareIcon />
                                            </IconButton>
                                        </div>
                                        <div>
                                            <IconButton
                                                aria-label="save"
                                                onClick={() => (isSavedList ? handleUnSave(postDetails.data.post._id) : handleSave(postDetails.data.post._id))}
                                            >
                                                {isSavedList ? <TurnedInIcon /> : <TurnedInNotIcon />}

                                            </IconButton>
                                        </div>
                                    </CardActions>
                                    <CardActions sx={{ paddingBottom: '0' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total likes: {postDetails.data.post.totalLike}
                                        </Typography>
                                    </CardActions>
                                    <Divider />
                                </Box>
                                {/* {postDetails.data.post.can_comment  } */}
                                {/* neu la can_comment == true thi show commnet */}
                                {postDetails.data.post.can_comment ? <Box style={{ overflow: 'scroll', height: '550px' }}>
                                    <Comment comments={comments} postDetails={postDetails} setComments={setComments}/>
                                    {totalPage > 1 && <CardActions style={{ paddingTop: 0 }} onClick={handleGetMoreComment}>
                                        <Typography variant="body2" color="text.secondary">
                                            Read more comments
                                        </Typography>
                                    </CardActions>}
                                </Box> : <Box>
                                    <Typography sx={{ marginTop: '200px' }} variant="h5" color="text.secondary">
                                        The owner has turned off comments
                                    </Typography>
                                </Box>}
                            </>)}
                        </Box>
                    </div>


                    {/* <Divider /> */}
                    {postDetails.data.post.can_comment ? <Box>
                        {isManagement ? <></> : <Box >
                            <Divider />
                            <Box sx={{ paddingY: '20px' }}>
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item sx={{ marginTop: '5px' }}>
                                        <Avatar aria-label="recipe" src={user?.avatar}>{user?.username.charAt(0).toUpperCase()}</Avatar>
                                    </Grid>
                                    <Grid justifyContent="left" item xs zeroMinWidth>
                                        <TextField
                                            style={{ width: '100%' }}
                                            id="comment"
                                            label="Add a comment"
                                            variant="standard"
                                            value={comment}
                                            onChange={(event) => setComment(event.target.value)}
                                            onKeyDown={(event) => handleSendComment(event)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>}
                    </Box> : <></>
                    }


                    {action}

                </Box>
            </Box>

            {/* list action */}
            <Dialog open={open} maxWidth={maxWidth} fullWidth={fullWidth} onClose={handleClose} aria-labelledby='max-width-dialog-title'
            >
                <DialogTitle id='full-screen-dialog-title'>
                    <IconButton
                        aria-label='close'
                        onClick={handleClose}
                        sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
                    >
                        <Icon icon='tabler:x' />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
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
                </DialogContent>
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
                    <EditPost postDetails={postDetails} handleCloseEditPost={handleCloseEditPost} />
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
                    <Report type={type} postDetails={postDetails} comments={comments} comment={'selectedCommentId'} handleCloseReport={handleCloseReport} />
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
                <DeletePost postDetails={postDetails} handleCloseDeletePost={handleCloseDeletePost} />
            </Dialog>
        </Card>
    )
}

export default PostDetails;
