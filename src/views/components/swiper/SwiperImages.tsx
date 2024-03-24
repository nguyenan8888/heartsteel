// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import { Direction } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

interface Data {
  listData: any
  direction: Direction
  style?: any
}

const SwiperImages = (props: Data) => {
  const { listData, direction, style } = props

  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  return (
    <>
      <Box className='navigation-wrapper' style={{ height: '100%' }}>
        <Box ref={sliderRef} className='keen-slider' style={{ height: '100%' }}>
          {listData.map((e: any, i: any) => (
            <Box
              key={i}
              className='keen-slider__slide'
              style={{
                width: '100%', // Chiều rộng cố định
                backgroundColor: 'black', // Màu nền
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: `calc(4 * 3 * 2.7vw)`
              }}
            >
              {e.includes('/images') ? (
                <img style={style} src={e} alt='image' />
              ) : e.includes('/videos') ? (
                <video autoPlay controls muted loop style={{ width: '100%', height: '100%' }}>
                  <source src={e} />
                </video>
              ) : null}
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
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            />

            <Icon
              icon='tabler:chevron-right'
              className={clsx('arrow arrow-right')}
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            />
          </>
        )}
      </Box>
      {loaded && instanceRef.current && (
        // <Box className='swiper-dots'>
        //   {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
        //     return (
        //       <Badge
        //         key={idx}
        //         variant='dot'
        //         component='div'
        //         className={clsx({
        //           active: currentSlide === idx
        //         })}
        //         onClick={() => {
        //           instanceRef.current?.moveToIdx(idx)
        //         }}
        //       ></Badge>
        //     )
        //   })}
        // </Box>
        <></>
      )}
    </>
  )
}

export default SwiperImages
