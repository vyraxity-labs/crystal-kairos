import { InitialState } from '@/types/nav.interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState: InitialState = {
  isMobileNavOpen: false,
}

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setIsMobileNavOpen: (state, { payload }: { payload: boolean }) => {
      state.isMobileNavOpen = payload
    },
  },
})

export const { setIsMobileNavOpen } = navSlice.actions

export default navSlice.reducer
