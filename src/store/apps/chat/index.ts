// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: [],
    unSeen: 0,
    chatsGroup: []
  },
  reducers: {
    initChat: (state, payload) => {
      state.chats = payload.payload.chats
    },
    increaseUnSeen: (state, payload) => {
      state.unSeen = state.unSeen + payload.payload.unSeen
    },
    decreaseUnSeen: (state, action) => {
      state.unSeen = state.unSeen - action.payload.unSeen
    },
    readAllMessage: (state, action) => {
      for (let i = 0; i < state.chats.length; ++i) {
        if (state.chats[i]._id === action.payload.chatId) {
          state.unSeen = state.unSeen - state.chats[i].unReadMessages < 0 ? 0 : state.unSeen - state.chats[i].unReadMessages;
          state.chats[i].unReadMessages = 0;
          break;
        }
      }
    },
    updateChat: (state, action) => {
      const { message, chatId } = action.payload;

      for (let i = 0; i < state.chats.length; ++i) {
        if (state.chats[i]._id === chatId) {
          state.chats[i].lastMessage = { ...message, user: message.user._id };
          break;
        }
      }
    }
  }
})

export const { initChat, increaseUnSeen, decreaseUnSeen, readAllMessage, updateChat } = appChatSlice.actions

export default appChatSlice.reducer
