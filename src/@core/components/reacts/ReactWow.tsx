// ** Icons
import { Icon } from '@iconify/react'

// ** Types
import { ReactIconTypes } from './type'
import { Tooltip } from '@mui/material'

const ReactWow = (props: ReactIconTypes) => {
  const { size } = props

  return (
    <Tooltip title='Wow' placement='top'>
      <Icon icon='fa-solid:surprise' fontSize={size} color={'#FFCB4C'} />
    </Tooltip>
  )
}

export default ReactWow
