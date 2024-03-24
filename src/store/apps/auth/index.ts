// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { authService } from 'src/@core/auth/authService'

export const authSlice = createSlice({
  name: 'appUsers',
  initialState: {
    user: null
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      authService.setLocalStorageWhenLogin(action.payload)
    }
  }
})

export const { login } = authSlice.actions

export default authSlice.reducer
