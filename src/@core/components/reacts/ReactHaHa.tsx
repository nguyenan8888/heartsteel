// ** Icons
import { Icon } from '@iconify/react'

// ** Types
import { ReactIconTypes } from './type'
import { Tooltip } from '@mui/material'

const ReactHaHa = (props: ReactIconTypes) => {
  const { size } = props

  return (
    <Tooltip title='HaHa' placement='top'>
      <Icon icon='twemoji:rolling-on-the-floor-laughing' fontSize={size} />
    </Tooltip>
  )
}

export default ReactHaHa
