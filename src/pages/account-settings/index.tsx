// ** React Imports
import { useState, useEffect, SyntheticEvent } from 'react'

// ** Next Import
// import { useRouter } from 'next/router'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'

// import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Tabs Imports
import TabAccount from 'src/pages/account-settings/account'
import TabContact from 'src/pages/account-settings/contact'
import TabSecurity from 'src/pages/account-settings/security'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  border: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(0),
    margin: `${theme.spacing(0)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 200
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const AccountSettings = ({ tab }: { tab: string }) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [value, setValue] = useState<string>('1')

  // ** Hooks
  // const router = useRouter()
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={value}>
          <TabList centered onChange={handleChange}>
            <Tab value='1' label={<div style={{display:'flex',alignItems:'center'}}><Icon icon='iconamoon:profile-fill' fontSize={16} style={{marginRight:'5px'}}/>Profile</div>} />
            <Tab value='2' label={<div style={{display:'flex',alignItems:'center'}}><Icon icon='ph:phone-fill' fontSize={16} style={{marginRight:'5px'}}/>Contact</div>} />
            <Tab value='3' label={<div style={{display:'flex',alignItems:'center'}}><Icon icon='material-symbols:lock' fontSize={16} style={{marginRight:'5px'}}/>Security</div>} />
          </TabList>
          <TabPanel value='1'>
            <TabAccount popperPlacement={undefined}/>
          </TabPanel>
          <TabPanel value='2'>
            <TabContact/>
          </TabPanel>
          <TabPanel value='3'>
            <TabSecurity/>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default AccountSettings
