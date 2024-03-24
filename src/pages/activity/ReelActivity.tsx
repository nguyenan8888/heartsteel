import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Tab } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import ReelActivityLike from './ReelActivityLike'
import ReelActivityComment from './ReelActivityComment'

const ReelActivity = () => {
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
        <ReelActivityLike />
      </TabPanel>
      <TabPanel value='comment' sx={{ width: '100%' }}>
        <ReelActivityComment />
      </TabPanel>
    </TabContext>
  )
}

export default ReelActivity
