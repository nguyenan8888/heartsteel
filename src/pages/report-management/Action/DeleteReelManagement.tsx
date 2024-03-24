import { Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { postApi, reelApi } from "src/@core/apis";
const YourEmails = ['Delete','Cancel'];

interface deletePost {
    fetchData?:any,
    reelDetails?: any,
    handleCloseDeleteReel: () => void,
}
const DeleteReelManagement = (props: deletePost) => {
    const { reelDetails, handleCloseDeleteReel,fetchData } = props
    const handleListItemClickYourEmails = (value: string) => {
        if (value === 'Cancel') {
            handleCloseDeleteReel();
        }
        if (value === 'Delete') {
            handleDeleteReel();
            // console.log('Delete',reelDetails)
        }
    };

    const handleDeleteReel = async () => {
        reelApi.delete_reel(reelDetails)
        .then(({ data }) => {
          if (data.isSuccess) {
            toast.error(data.message)
          } else {
            handleCloseDeleteReel();
          
            fetchData()
            toast.success(`Delete reel successfully`)
          }
        })
        .catch(err => {
          toast.error(err)
        })
      };
    
    return (
        <Box>
            <Box sx={{textAlign:'center'}}>
                <Typography sx={{fontSize:'25px', fontWeight:'400'}}>Delete reel?</Typography>
                <Typography sx={{fontStyle:'italic'}}>Are you sure you want to delete this reel?</Typography>
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

export default DeleteReelManagement
