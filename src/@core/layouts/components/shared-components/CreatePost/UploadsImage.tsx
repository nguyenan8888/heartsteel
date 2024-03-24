// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Badge, Direction } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import clsx from 'clsx'




// const UploadsImage = ({ setWork, work }, { direction, style }: { direction: Direction, style?: any }) => {
//     // ** States

//     // ** Hook
//     const [ref] = useKeenSlider({
//         rtl: direction === 'rtl'
//     })

//     const handleRemovePhoto = (indexToRemove) => {
//         setWork((prevWork) => {
//             return {
//                 ...prevWork,
//                 images: prevWork.images.filter((_, index) => index !== indexToRemove),
//             };
//         });
//     };

//     return (
//         <Box ref={ref} className='keen-slider' sx={{ width: 700, height: 800 }}>
//             {work?.images?.map((file, index) => (
//                 <Box className='keen-slider__slide' key={index} >
//                     {/* Kiểm tra nếu file là video */}
//                     {file instanceof File && file.type.startsWith('video/') ? (
//                         <video style={{width:'100%', objectFit:'contain', margin:'0 auto'}} src={URL.createObjectURL(file)} controls />
//                     ) : (
//                         // Nếu không phải video, giả sử là hình ảnh
//                         <img style={{width:'100%', objectFit:'contain', margin:'0 auto'}} src={file instanceof Object ? URL.createObjectURL(file) : file} alt="work" />
//                     )}
//                     <button type='button' onClick={() => handleRemovePhoto(index)} style={{ position: 'absolute', right: 0, top: 0, border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
//                         <Icon icon='material-symbols:delete-outline' fontSize={50} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'grey', color: 'white', borderRadius: '5px', padding: '5px', margin: 20 }} />
//                     </button>
//                 </Box>
//             ))}
//         </Box>
//     )
// }

// export default UploadsImage
interface FileProp {
    name: string
    type: string
    size: number
}

const UploadsImage = ({ setWork, work }: { setWork: any, work: any }, { direction, style }: { direction: Direction, style?: any }) => {
    // ** States
    const [loaded, setLoaded] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

    // ** Hook
    const [sliderRef, instanceRef] = useKeenSlider({
        rtl: direction === 'rtl',
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        created() {
            setLoaded(true)
        }
    })
    const handleRemovePhoto = (indexToRemove) => {
        setWork((prevWork) => {
            return {
                ...prevWork,
                images: prevWork.images.filter((_, index) => index !== indexToRemove),
            };
        });
    };

    console.log('Work images:', work.images);

    return (
        <>
            <Box className='navigation-wrapper' style={{ height: '100%' }}>
                <Box ref={sliderRef} className='keen-slider' style={{ height: '100%' }}>
                    {work?.images?.map((file, index) => (
                        <Box className='keen-slider__slide' key={index} style={{
                            width: '100%', // Chiều rộng cố định
                            backgroundColor: 'black', // Màu nền
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            {/* Kiểm tra nếu file là video */}
                            {(file instanceof File && file.type.startsWith('video/')) ? (
                                <video style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={URL.createObjectURL(file)} controls />
                            ) : (file instanceof File && file.type.startsWith('image/')) ? (
                                <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={file instanceof Object ? URL.createObjectURL(file) : file} alt="work" />
                            ) : file.includes("/images") ? (
                                <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={file} alt="work" />
                            ) : file.includes("/videos") ? (
                                <video style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={file} controls />
                            ) : (
                                <div></div>
                            )}
                            <button type='button' onClick={() => handleRemovePhoto(index)} style={{ position: 'absolute', right: 0, top: 0, border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
                                <Icon icon='material-symbols:delete-outline' fontSize={50} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'grey', color: 'white', borderRadius: '5px', padding: '5px', margin: 20 }} />
                            </button>
                        </Box>
                    ))}
                </Box>
                {loaded && instanceRef.current && (
                    <>
                        <Icon
                            icon='tabler:chevron-left'
                            className={clsx('arrow arrow-left', {
                                'arrow-disabled': currentSlide === 0
                            })}
                            onClick={e => e.stopPropagation() || instanceRef.current?.prev()}
                        />

                        <Icon
                            icon='tabler:chevron-right'
                            className={clsx('arrow arrow-right', {
                                'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
                            })}
                            onClick={e => e.stopPropagation() || instanceRef.current?.next()}
                        />
                    </>
                )}
            </Box>
            {loaded && instanceRef.current && (
                <Box className='swiper-dots'>
                    {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                        return (
                            <Badge
                                key={idx}
                                variant='dot'
                                component='div'
                                className={clsx({
                                    active: currentSlide === idx
                                })}
                                onClick={() => {
                                    instanceRef.current?.moveToIdx(idx)
                                }}
                            ></Badge>
                        )
                    })}
                </Box>
            )}
        </>
    )
}

export default UploadsImage


