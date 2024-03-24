// ** Icons
import { Icon } from '@iconify/react'

// ** Types
import { ReactIconTypes } from './type'
import { Tooltip } from '@mui/material'

const ReactAngry = (props: ReactIconTypes) => {
  const { size } = props

  return (
    <Tooltip title='Angry' placement='top'>
      <Icon icon='twemoji:angry-face' fontSize={size} />
    </Tooltip>
  )
}

export default ReactAngry
