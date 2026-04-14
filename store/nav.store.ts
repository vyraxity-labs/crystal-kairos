import { InitialState } from '@/types/nav.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState: InitialState = {
  isMobileNavOpen: false,
  sidebarIsCollapsed: false,
}

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setIsMobileNavOpen: (
      state,
      action: import('@reduxjs/toolkit').PayloadAction<boolean>,
    ) => {
      state.isMobileNavOpen = action.payload
    },
    setSidebarIsCollapsed: (
      state,
      action: import('@reduxjs/toolkit').PayloadAction<boolean>,
    ) => {
      state.sidebarIsCollapsed = action.payload
    },
  },
})

export const { setIsMobileNavOpen, setSidebarIsCollapsed } = navSlice.actions

export default navSlice.reducer
