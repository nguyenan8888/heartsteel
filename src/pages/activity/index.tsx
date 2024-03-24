import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Card, Tab } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import PostActivity from './PostActivity'
import ReelActivity from './ReelActivity'

const Activity = () => {
  const [value, setValue] = useState<string>('post')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card sx={{ padding: '1rem 0', height: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <TabList orientation='vertical' onChange={handleChange} aria-label='vertical tabs example'>
            <Tab value='post' label='Post' />
            <Tab value='reel' label='Reel' />
          </TabList>
          <TabPanel value='post' sx={{ width: '100%', padding: 0 }}>
            <PostActivity />
          </TabPanel>
          <TabPanel value='reel' sx={{ width: '100%', padding: 0 }}>
            <ReelActivity />
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  )
}

export default Activity
