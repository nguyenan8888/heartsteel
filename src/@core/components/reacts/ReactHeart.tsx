// ** Icons
import { Icon } from '@iconify/react'

// ** Types
import { ReactIconTypes } from './type'
import { Tooltip } from '@mui/material'

const ReactHeart = (props: ReactIconTypes) => {
  const { size } = props

  return (
    <Tooltip title='Love' placement='top'>
      <Icon icon='flat-color-icons:like' fontSize={size} />
    </Tooltip>
  )
}

export default ReactHeart
