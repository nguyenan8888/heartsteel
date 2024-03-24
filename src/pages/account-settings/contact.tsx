// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import storage from 'src/@core/utils/storage'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

// ** Types

// ** Apis
import { userApi } from 'src/@core/apis'
import toast from 'react-hot-toast'

interface Data {
  email: string
  address: string
  phone: number | string
}

const initialData: Data = {
  phone: '',
  address: '',
  email: '',
}

const defaultValues = {
  phone: '',
  address: '',
  email: '',
}


const TabContact = () => {
  const [formData, setFormData] = useState<Data>(initialData)
  const userData = storage.getProfile();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    userApi
      .profile(userData._id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setFormData({
            phone: data.data.user.phone,
            email: data.data.user.email,
            address: data.data.user.address
          })
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  // ** Hooks
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm({ defaultValues })

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const onContactFormSubmit = () => {
    const { phone, address, email } = formData;
    setLoading(true)
    userApi
      .editProfile({phone, address, email})
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success('Contact Changed Successfully')
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response.data.message[0].msg)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Contact' />
          <form>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={formData.email}
                    placeholder='Enter your email'
                    onChange={e => handleFormChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Phone Number'
                    placeholder='Enter your phone'
                    value={formData.phone}
                    onChange={e => handleFormChange('phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    label='Address'
                    placeholder='Enter your address'
                    value={formData.address}
                    onChange={e => handleFormChange('address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                  <Button onClick={onContactFormSubmit} variant='contained' sx={{ mr: 4 }}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TabContact
