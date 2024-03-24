import { Button, Grid, Input } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useState } from "react";

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'

// ** Custom Component Import
import TextField from '@mui/material/TextField'

import Switch from '@mui/material/Switch'


import Divider from '@mui/material/Divider';

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Comment from "../Comments/Comment";

const PostDetails = () => {
    // ** State
    const [value, setValue] = useState<string>('Controlled')
    return (
        <Card>
            <form noValidate autoComplete='off' className=''>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'space-between' }}>
                    <Box sx={{ width: 1020, height: 1000, display: 'flex' }}>
                        <img style={{width:'100%'}} src="https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340" alt="" />
                    </Box>
                    <Box sx={{ width: 500, height: 1000, overflow: "auto" }}>
                       <Box sx={{display:'flex',alignItems:'center' ,justifyContent:'space-between'}}>
                       <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 4 }} src='/images/avatars/3.png' />
                            <Box>Tran Dinh Cuong</Box>
                        </Box>
                        <Box>
                        <Icon icon='pepicons-pencil:dots-x' fontSize={20} style={{ marginRight: '5px' }} />

                        </Box>
                       </Box>

                        <Divider />
                        <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 4 }} src='/images/avatars/3.png' />
                            <Box>Tran Dinh Cuong</Box>
                        </Box>
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography > Hom nay troi dep dsdsd d sfs  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod necessitatibus ratione soluta aliquid, facere minima placeat earum voluptatem saepe doloremque voluptas voluptatibus, a incidunt enim eligendi assumenda voluptates eaque suscipit! Laudantium, ratione? Culpa explicabo fugiat quae animi libero earum. Amet facere ducimus incidunt atque quis autem, consequuntur fuga ipsam mollitia.</Typography>
                        </Box>
                        <Box>
                            <Box>
                                <Comment />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Card>
    )
}

export default PostDetails
