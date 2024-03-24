// ** Types
import { is } from 'date-fns/locale'
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  dob: string
  address: string
  gender: string
  biography: string
  avatar: string
  isActive: boolean
  isDelete: boolean
  createdAt: string
  updatedAt: string
  accessToken: string
  isLocked: boolean
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
