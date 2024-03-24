import { Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { postApi } from "src/@core/apis";
const YourEmails = ['Delete', 'Cancel'];
interface deleteComment {
    fetchData?: any,
    postDetails?: any,
    handleCloseDeleteComment: () => void,
}
const DeleteCommentManagement = (props: deleteComment) => {
    const { postDetails, handleCloseDeleteComment, fetchData } = props
    const handleListItemClickYourEmails = (value: string) => {
        if (value === 'Cancel') {
            handleCloseDeleteComment();
        }
        if (value === 'Delete') {
            deleteComment(postDetails);
            // console.log('Delete', postDetails)
        }
    };



    const deleteComment = (commentId: any) => {
        // console.log('commentId', commentId);
        postApi.deleteComment(commentId).then(({ data }) => {
            if (data.isSuccess) {
                handleCloseDeleteComment();
                fetchData();
            }
        }).catch((err) => {
            toast.error('Delete comment failed')
        })
    }
    return (
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
    )
}

export default DeleteCommentManagement
