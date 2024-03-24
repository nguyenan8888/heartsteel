import { CircularProgress, Typography, Box, AccordionDetails, Accordion, AccordionSummary } from '@mui/material'
import Icon from 'src/@core/components/icon';
import MuiAvatar from '@mui/material/Avatar'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { activityApi } from 'src/@core/apis'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useRouter } from 'next/router'

const ReelActivityComment = () => {
  const router = useRouter();
  const [buckets, setBuckets] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    activityApi
      .get_activities('REEL', 'COMMENT')
      .then(({ data }) => {
        if (data.isSuccess) {
          setBuckets(data.data.activity)
        } else {
          toast.error('Failed to fetch')
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
    <Box>
      {loading && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      )}
      <div style={{ width: '100%', height: '100%' }}>
        {buckets.length > 0 ? buckets.map((e: any, index: any) => (
          <Accordion key={index}>
            <AccordionSummary
              id='panel-header-2'
              aria-controls='panel-content-2'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {(e?.reel?.video.includes("/images") ? (
                  <img style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }} src={e?.reel?.video} alt='image' />
                ) : e?.reel?.video.includes("/videos") ? (
                  <video muted style={{ marginRight: '5px', width: 48, height: 48, objectFit: 'cover' }} onClick={() => router.push(`/reels/reel-detail/${e?.reel?._id}`)}>
                    <source src={e?.reel?.video} />
                  </video>
                ) : <div style={{ marginRight: '5px', width: 48, height: 48, backgroundColor: 'black' }}></div>)}
                <Box sx={{ display: 'flex', flexDirection: 'column' }} onClick={() => router.push(`/reels/reel-detail/${e?.reel?._id}`)}>
                  {e?.reel?.content.length > 70 ? <Typography variant="body2" color="text.secondary">
                    {e?.reel?.content.substring(0, 70)}{' '}...
                  </Typography> :
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {e?.reel?.content}
                    </Typography>}

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar src={e?.reel?.user.avatar} sx={{ mr: 1.5, width: 18, height: 18 }} />
                    <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                      {e?.reel?.user.username}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {e.comments.length > 0 ? e.comments.map((comment: any, index: any) => (
                <Box key={index} sx={{ mb: '.5rem', display: 'flex', alignItems: 'center' }}>
                  <MuiAvatar
                    src={comment.user.avatar}
                    alt={`${comment.user.username}`}
                    sx={{
                      width: 36,
                      height: 36,
                      outline: '2px solid transparent'
                    }}
                  />
                  <Box sx={{ ml: '.5rem' }}>
                    <Typography>
                      <strong>{`${comment.user.lastName} ${comment.user.firstName}`}</strong>
                      <span style={{ marginLeft: '.5rem' }}>{comment.content}</span>
                    </Typography>
                  </Box>
                </Box>
              )) : <></>}
            </AccordionDetails>
          </Accordion>
        )) : <div style={{ width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
          <Icon icon='fe:warning' fontSize={30} style={{ marginRight: '10px', color: 'orange' }} />
          <Typography fontSize={30}>There is no activity.</Typography>
        </div>}
      </div>
    </Box>
  )
}

export default ReelActivityComment
