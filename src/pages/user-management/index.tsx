/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { userApi } from 'src/@core/apis'
import { CheckPermissionEnter } from 'src/lib/function'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { GridColDef } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useSocket } from "src/hooks/useSocket";

export type ProjectTableRowType = {
  id: string
  dob: string
  username: string
  email: string
  isLocked?: number
  isActive?: boolean
  role: string
  gender: string
  avatar?: string
  avatarGroup: string[]
  avatarColor?: ThemeColor
}

interface CellType {
  row: ProjectTableRowType
}

const UserManagement = () => {
  // ** State
  const [data, setData] = useState([])
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [role, setRole] = useState<string>('')
  const [isLocked, setIsLocked] = useState<any>('');
  const [count, setCount] = useState<number>(0);
  const [roleChange, setRoleChange]= useState<boolean>(false)
  const router = useRouter()
  const { socket } = useSocket();

  useEffect(() => {
    CheckPermissionEnter(['Admin']);
  }, [])

  useEffect(() => {
    fetchData()
  }, [role, value, isLocked, roleChange])

  const renderName = (row: ProjectTableRowType) => {
    if (row.avatar) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials(row.username || 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  const roles = ['Admin', 'Moderator', 'Member']

  const fetchData = () => {
    userApi.allUsers(role, value, isLocked)
      .then(response => {
        const updatedData = response.data.data.users.map((user: { _id: any }) => ({
          ...user,
          id: user._id
        }));
        setData(updatedData);
        setCount(response.data.data.totalDocuments)
        console.log(response.data.data.users)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  const handleEditRoleSubmit = (id: string, role: string) => {
    userApi
      .editRole(id, {role})
      .then(({ data }) => {
        if (data.isSuccess) {
          setRoleChange(!roleChange)
          toast.success('Role Changed Successfully')
          window.location.reload()
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response.data.message[0].msg)
      })
      .finally(() => {
        fetchData()
      })
  }

  const handleLockAccount = (id: string, username: string) => {
    userApi
      .lockAccount(id)
      .then(({ data }) => {
        if (data.isSuccess) {
          const payload = {
            id,
            type: 'LOCKED_ACCOUNT',
          }
          socket?.emit('lock-account-noti', payload);
          if(data.data.isLocked) toast.success(`Lock ${username} Successfully`)
          if(!data.data.isLocked) toast.success(`Unlock ${username} Successfully`)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response.data.message[0].msg)
      })
      .finally(() => {
        fetchData()
      })
  }

  const handleProfile = (id: string) => {
    router.push(`/user-profile/${id}`)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'username',
      minWidth: 220,
      sortable: false,
      headerName: 'Username',
      renderCell: ({ row }: CellType) => {
        const { username, dob } = row
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderName(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {username}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                {new Date(dob).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.email}</Typography>
    },
    {
      flex: 0.1,
      field: 'role',
      editable: true,
      minWidth: 50,
      sortable: false,
      headerName: 'Role',
      renderEditCell: ({ row }: CellType) => (
          <CustomTextField select defaultValue={row.role} onChange={(e) => handleEditRoleSubmit(row.id, e.target.value)}>
            {roles.map((e: any, i: any) => (
              <MenuItem key={i} value={e}>
                {e}
              </MenuItem>
            ))}
          </CustomTextField>
        ),
    },
    {
      flex: 0.1,
      field: 'gender',
      minWidth: 100,
      sortable: false,
      headerName: 'Gender',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.gender}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'isLocked',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => 
        {return !row.isLocked ? (<Chip label='Active' color='success' />) : (<Chip label='Locked' color='error' />)}
    },
    {
      flex: 0.1,
      minWidth: 10,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <OptionsMenu
          iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
          options={[
            {
              text: 'Profile',
              menuItemProps: {
                onClick: () => handleProfile(row.id),
              }
            },
            {
              text: row.isLocked ? 'Unlock':'Lock',
              menuItemProps: {
                onClick: () => handleLockAccount(row.id, row.username),
              }
            },
            // 'Archive',
            // { divider: true, dividerProps: { sx: { my: theme => `${theme.spacing(2)} !important` } } },
            // {
            //   text: 'Delete',
            //   menuItemProps: {
            //     sx: {
            //       color: 'error.main',
            //       '&:not(.Mui-focusVisible):hover': {
            //         color: 'error.main',
            //         backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.08)
            //       }
            //     },
            //     onClick: () => console.log('hiii'),
            //   }
            // }
          ]}
        />
      )
    }
  ]

  return data ? (
    <>
    <Card>
      <CardHeader
        title='List Users'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        action={<CustomTextField value={value} placeholder='Search' onChange={e => setValue(e.target.value)} />}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      <DataGrid
        autoHeight
        pagination
        rows={data}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[2, 5, 10, 20]}
        paginationModel={paginationModel}
        disableRowSelectionOnClick
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
    </>
  ) : null
}

export default UserManagement