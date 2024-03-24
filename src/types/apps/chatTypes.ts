// ** Types
import { Dispatch } from 'redux'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from './userTypes'

export type StatusType = 'busy' | 'away' | 'online' | 'offline'

export type StatusObjType = {
  busy: ThemeColor
  away: ThemeColor
  online: ThemeColor
  offline: ThemeColor
}

export type ProfileUserType = {
  id: number
  role: string
  about: string
  avatar: string
  fullName: string
  status: StatusType
  settings: {
    isNotificationsOn: boolean
    isTwoStepAuthVerificationEnabled: boolean
  }
}

export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}

export type ChatsObj = {
  id: number
  userId: number
  chat: ChatType[]
  unseenMsgs: number
  lastMessage?: ChatType
}

export type ContactType = {
  id: number
  role: string
  about: string
  avatar?: string
  fullName: string
  status: StatusType
  avatarColor?: ThemeColor
}

export type UserChatType = {
  _id: string
  firstName: string
  username: string
  lastName: string
  gender: string
  avatar: string | null
  role: string
  isActive: boolean
}

export type LastMessageType = {
  _id: string
  user: string
  content: string
  reply_to: string
  isDelete: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

export type ChatType = {
  _id?: string
  createdAt?: string
  updatedAt?: string
  user: UserChatType
  lastMessage?: LastMessageType
  unReadMessages: number
}

export type SelectedChatType = null | {
  chat: ChatsObj
  contact: ChatType
}

export type ChatStoreType = {
  chats: ChatType[] | null
  contacts: ContactType[] | null
  userProfile: ProfileUserType | null
  selectedChat: SelectedChatType
}

export type SendMsgParamsType = {
  chat?: ChatsObj
  message: string
  contact?: ChatType
}

export type ChatContentType = {
  hidden: boolean
  mdAbove: boolean
  user: UsersType | null
  sidebarWidth: number
  dispatch: Dispatch<any>
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  selectedChat: ChatType | null
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ChatType>>
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
  handleNewContact: () => void
}

export type ChatSidebarLeftType = {
  hidden: boolean
  mdAbove: boolean
  chats: ChatType[]
  user: UsersType | null
  sidebarWidth: number
  userStatus: StatusType
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  selectChat: (id: number) => void
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
  formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void
  selectedChat: ChatType | null
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ChatType>>
}

export type UserProfileLeftType = {
  hidden: boolean
  user: UsersType | null
  sidebarWidth: number
  userStatus: StatusType
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
}

export type UserProfileRightType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
}

export type SendMsgComponentType = {
  selectedChat: ChatType
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ChatType>>,
  replyTo: MessageType | null
  setReplyTo: React.Dispatch<React.SetStateAction<MessageType | null>>
}

export type ChatLogType = {
  hidden: boolean
  selectedChat: ChatType
  page: number
  messages: MessageType[]
  hasMore: boolean
  getChatContent: (id?: string, page?: number | null) => void
  replyTo: MessageType | null
  setReplyTo: React.Dispatch<React.SetStateAction<MessageType | null>>
}

export type MessageType = {
  _id: string
  user: UserChatType
  content: string
  reply_to: string
  isDelete: false
  images: string[]
  reacts: { [id: string]: string }
  seen: { [id: string]: string }
  createdAt: string
  updatedAt: string
}

export type FormattedChatsType = {
  user: UserChatType
  messages: MessageType[]
}

export type MessageGroupType = {
  user: UserChatType
  messages: MessageType[]
}
