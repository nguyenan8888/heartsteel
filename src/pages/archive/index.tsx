// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export default function TestPage() {
  const router = useRouter()
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const itemData = [
    {
      id: '1',
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
    },
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
    },
  ];

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='text' style={{ marginLeft: '20px' }} onClick={() => { router.push('/profile') }}>
              <Icon icon='ic:sharp-arrow-back' fontSize={20} style={{ marginRight: '5px' }} />Archive
            </Button>
          </div>
          <TabContext value={value}>
            <TabList centered onChange={handleChange} aria-label='simple tabs example'>
              <Tab value='1' label={<div style={{ display: 'flex' }}><Icon icon='ph:layout' fontSize={20} style={{ marginRight: '5px' }} />Posts</div>} />
              <Tab value='2' label={<div style={{ display: 'flex' }}><Icon icon='ic:sharp-history' fontSize={20} style={{ marginRight: '5px' }} />Stories</div>} />
            </TabList>
            <Typography style={{ marginTop: '20px', marginLeft: '25px' }}>Only you can see your archived posts/stories unless you choose to share them.</Typography>
            <TabPanel value='1'>
              <ImageList sx={{ width: '100%', height: '100%' }} cols={3}>
                {itemData.map((item: any) => (
                  <ImageListItem key={item.img}>
                    <img
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </TabPanel>
            <TabPanel value='2'>
              <ImageList sx={{ width: '100%', height: '100%' }} cols={3}>
                {itemData.map((item: any) => (
                  <ImageListItem key={item.img}>
                    <img
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </Grid>
  )
}
