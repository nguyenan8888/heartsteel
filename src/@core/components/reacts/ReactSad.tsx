// ** Icons
import { Icon } from '@iconify/react'

// ** Types
import { ReactIconTypes } from './type'
import { Tooltip } from '@mui/material'

const ReactSad = (props: ReactIconTypes) => {
  const { size } = props

  return (
    <Tooltip title='Sad' placement='top'>
      <Icon icon='twemoji:sad-but-relieved-face' fontSize={size} />
    </Tooltip>
  )
}

export default ReactSad
