/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Badge, Direction } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import clsx from 'clsx'

const UploadsImage = ({ setWork, work }: { setWork: any, work: any }, { direction, style }: { direction: Direction, style?: any }) => {
    // ** States
    const [loaded, setLoaded] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

    // ** Hook
    const handleRemovePhoto = () => {
        setWork((prevWork: any) => {
          return {
            ...prevWork,
            images: [],
          };
        });
      };

    return (
        <>
            <Box className='navigation-wrapper' style={{ height: '100%' }}>
                <Box className='keen-slider' style={{ height: '100%' }}>
                        <Box className='keen-slider__slide' style={{
                            width: '100%', // Chiều rộng cố định
                            backgroundColor: 'black', // Màu nền
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            {/* Kiểm tra nếu file là video */}
                            {(work?.images[0] instanceof File && work?.images[0].type.startsWith('video/')) ? (
                                <video style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={URL.createObjectURL(work?.images[0])} controls />
                            ) :  work?.images[0].includes("/videos") ? (
                                <video style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={work?.images[0]} controls />
                            ) : (
                                <div></div>
                            )}
                            <button type='button' onClick={() => handleRemovePhoto()} style={{ position: 'absolute', right: 0, top: 0, border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
                                <Icon icon='material-symbols:delete-outline' fontSize={50} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'grey', color: 'white', borderRadius: '5px', padding: '5px', margin: 20 }} />
                            </button>
                        </Box>
                </Box>
            </Box>
        </>
    )
}

export default UploadsImage


