import { Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { postApi } from "src/@core/apis";
const YourEmails = ['Delete','Cancel'];

interface deletePost {
    postDetails?: any,
    handleCloseDeletePost: () => void,
}
const DeletePost = (props: deletePost) => {
    const { postDetails, handleCloseDeletePost } = props
    const handleListItemClickYourEmails = (value: string) => {
        if (value === 'Cancel') {
            handleCloseDeletePost();
        }
        if (value === 'Delete') {
            handleDeletePost();
            console.log('Delete',postDetails.data.post._id)
        }
    };

    const handleDeletePost = async () => {
        try {
          const res = await postApi.delete_post(postDetails?.data.post._id);
          if (res.status) {
            toast.success("Deleted Successfully");
            handleCloseDeletePost();
            window.location.href = '/home';
          } else {
            toast.error("Delete Failed");
          }
        } catch (error) {
          console.error("Error deleting post:", error);
          toast.error("An error occurred while deleting the post");
        }
      };
    
    return (
        <Box>
            <Box sx={{textAlign:'center'}}>
                <Typography sx={{fontSize:'25px', fontWeight:'400'}}>Delete post?</Typography>
                <Typography sx={{fontStyle:'italic'}}>Are you sure you want to delete this post?</Typography>
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

export default DeletePost
