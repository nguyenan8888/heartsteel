// ** Icons
import { Icon } from '@iconify/react'

// ** Types
import { ReactIconTypes } from './type'
import { Tooltip } from '@mui/material'

const ReactLike = (props: ReactIconTypes) => {
  const { size } = props

  return (
    <Tooltip title='Like' placement='top'>
      <Icon icon='mdi:like' fontSize={size} color={'#059FFB'} />
    </Tooltip>
  )
}

export default ReactLike
