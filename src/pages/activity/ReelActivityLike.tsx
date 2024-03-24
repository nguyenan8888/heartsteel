import { Box, CircularProgress, ImageList, ImageListItem, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { activityApi } from 'src/@core/apis'
import { useRouter } from 'next/router'

const ReelActivityLike = () => {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    activityApi
      .get_activities('REEL', 'LIKE')
      .then(({ data }) => {
        if (data.isSuccess) {
          setReels(data.data.activity)
        } else {
          toast.error('Failed to fetch posts')
        }
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false);
      })
  };

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {loading && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}

      <ImageList sx={{ width: '100%', height: '100%' }} cols={reels.length > 0 ? 3 : 1}>
        {reels.length > 0 ? reels.map((item: any) => (
          <ImageListItem key={item?.reel?._id} onClick={()=> router.push(`/reels/reel-detail/${item?.reel?._id}`)}>
            <div
              style={{
                position: 'relative',
                paddingBottom: '100%', // Creates a padding-based square container
              }}
            >
              {(item?.reel?.video.includes("/images") ? (
                <img style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures image fills the container
                }} src={item?.reel?.video} alt='image' />
              ) : item?.reel?.video.includes("/videos") ? (
                <video muted style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures image fills the container
                }}>
                  <source src={item?.reel?.video} />
                </video>
              ) : null)}
            </div>
          </ImageListItem>
        )) : <div style={{width:'100%', display:"flex", justifyContent: 'center', alignItems:'center'}}>
            <Icon icon='fe:warning' fontSize={30} style={{marginRight:'10px', color:'orange'}}/>
            <Typography fontSize={30}>There is no activity.</Typography>
          </div>}
      </ImageList>
    </Box>
  )
}

export default ReelActivityLike
