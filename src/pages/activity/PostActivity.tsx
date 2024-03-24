import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Tab } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import PostActivityLike from './PostActivityLike'
import PostActivityComment from './PostActivityComment'

const PostActivity = () => {
  const [value, setValue] = useState<string>('like')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='like' label='LIKES' />
        <Tab value='comment' label='COMMENTS' />
      </TabList>
      <TabPanel value='like' sx={{ width: '100%' }}>
        <PostActivityLike />
      </TabPanel>
      <TabPanel value='comment' sx={{ width: '100%' }}>
        <PostActivityComment />
      </TabPanel>
    </TabContext>
  )
}

export default PostActivity
