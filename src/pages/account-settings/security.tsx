// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports

// ** Custom Components Imports

// ** Demo Components
import ChangePasswordCard from 'src/pages/account-settings/security/ChangePasswordCard'

const TabSecurity = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ChangePasswordCard />
      </Grid>
    </Grid>
  )
}
export default TabSecurity
